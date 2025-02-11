import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { useToast } from 'vue-toastification';
import router from '@/router'; // Certifique-se de importar o router

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: { Accept: "application/json" }
});

const toast = useToast();

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const { token } = storeToRefs(authStore);

    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const handleValidationErrors = (errors) => {
    const messages = Object.values(errors).flat();
    messages.forEach(message => {
        toast.warning(`${message}`, { timeout: 3000 });
    });
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await api.post('/refresh', {
          refreshToken: authStore.refreshToken
        });
        
        const { token } = response.data;
        authStore.setToken(token);
        
        processQueue(null, token);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.logout();
        router.push('/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 422) {
      handleValidationErrors(error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
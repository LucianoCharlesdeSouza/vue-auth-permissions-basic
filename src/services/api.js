import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from 'vue-toastification';
import router from '@/router';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: { Accept: "application/json" },
  withCredentials: true  // Importante para enviar/receber cookies
});

const toast = useToast();

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(); // Não precisamos mais passar um token
    }
  });
  
  failedQueue = [];
};


const handleValidationErrors = (errors) => {
    const messages = Object.values(errors).flat();
    messages.forEach(message => {
        toast.warning(`${message}`, { timeout: 3000 });
    });
};

const handleLogout = (authStore) => {
    authStore.logout();
    router.push('/login');
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    // Verifica se é erro 401 e não é uma requisição de refresh
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/refresh') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then( () => api(originalRequest))
          .catch(err => {
            // Se o erro for 401 novamente, força logout
            if (err.response?.status === 401) {
              handleLogout(authStore);
            }
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing           = true;

      try {

        await api.post('/refresh');        
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Se o refresh token estiver expirado ou inválido
        if (refreshError.response?.status === 401) {
          toast.error("Sessão expirada. Por favor, faça login novamente.", { timeout: 3000 });
          handleLogout(authStore);
        } else {
          toast.error("Erro ao renovar a sessão", { timeout: 3000 });
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 && originalRequest.url === '/refresh') {
      handleLogout(authStore);
      return Promise.reject(error);
    }

    if (error.response?.status === 422) {
      handleValidationErrors(error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api;
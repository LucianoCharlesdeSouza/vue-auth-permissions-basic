import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { useToast } from 'vue-toastification';  

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: { Accept: "application/json" }
});

const toast = useToast();

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
  
  (error) => {

    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.error || "Erro desconhecido";

      if (status === 422) {
        handleValidationErrors(error.response.data);
      }

      return Promise.reject(new Error(errorMessage));
    }

    toast.error("🚨 Erro na conexão com o servidor", { timeout: 3000 });
    return Promise.reject(new Error("Erro na conexão com o servidor"));
  }
);

export default api;

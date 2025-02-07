import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import router from "@/router";

const api = axios.create({
  baseURL: "http://localhost:8000/api.php",
  headers: { Accept: "application/json" }
});

// Interceptor para adicionar token
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

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();

    if (error.response) {
      const errorMessage = error.response.data?.error || "Erro desconhecido";

      if (error.response.status === 401) {
        authStore.logout();
        router.push("/login");
      }

      return Promise.reject(new Error(errorMessage));
    }

    return Promise.reject(new Error("Erro na conexão com o servidor"));
  }
);

export default api;

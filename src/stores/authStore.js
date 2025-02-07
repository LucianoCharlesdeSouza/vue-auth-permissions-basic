import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    permissions: []
  }),

  getters: {
    isAuthenticated: state => Boolean(state.token),
    hasPermission: (state) => (permission) => {
      return Array.isArray(state.permissions) && state.permissions.includes(permission);
    }
  },

  actions: {
    async login(credentials) {

        const { data } = await api.post('/login', credentials);
        this.setSession(data);
    },

    logout() {
      this.clearSession();
    },

    loadSession() {

      let token         = sessionStorage.getItem('token');
      const user        = sessionStorage.getItem('user');
      const permissions = sessionStorage.getItem('permissions');

      if (!token || token === "null") {
        token = null;
      }

      this.setSession({
        token: token,
        user: user ? JSON.parse(user) : null,
        permissions: permissions ? JSON.parse(permissions) : []
      });      
    },

    setSession(data) {
      this.token       = data.token;
      this.user        = data.user;
      this.permissions = Array.isArray(data.permissions) ? data.permissions : [];

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('permissions', JSON.stringify(data.permissions));
    },

    clearSession() {
      this.token = null;
      this.user = null;
      this.permissions = [];
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("permissions");
    }
  }
});

import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore(
  'auth',
{
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

      this.token = data.token
      this.user = data.user
      this.permissions = data.permissions
    },
    
    logout() {
      this.user = null;
      this.token = null;
      this.permissions = [];
    },
  },
    persist: true 
});

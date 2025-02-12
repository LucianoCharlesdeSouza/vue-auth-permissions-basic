import { defineStore } from 'pinia';
import api from '@/services/api';
import router from '@/router';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    permissions: []
  }),

  getters: {
    isAuthenticated: state => Boolean(state.user),
    hasPermission: (state) => (permission) => {
      return Array.isArray(state.permissions) && state.permissions.includes(permission);
    }
  },

  actions: {
    async login(credentials) {

      const { data } = await api.post('/login', credentials);

      this.user = data.user;
      this.permissions = data.permissions;
    },
        
    async logout() {
      
      await api.post('/logout');
      this.user = null;
      this.permissions = [];
      router.push('/login');
    }
  },
  
  persist: {
    paths: ['user', 'permissions']
  }
});
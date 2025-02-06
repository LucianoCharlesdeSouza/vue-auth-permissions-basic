import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';

export function authGuard(to, from, next) {
  const authStore = useAuthStore();
  const toast = useToast(); 

  if (!authStore.token) {
    authStore.loadSession();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    toast.error('🔒 Você precisa estar autenticado para acessar esta página.', { timeout: 2000 });
    return next('/login');
  }

  if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
    toast.info('⚠️ Você não tem permissão para acessar!',{ timeout: 2000 });
    
    if (to.path === '/dashboard') {
      return next('/login');
    }

    return next('/dashboard');
  }

  next();
}

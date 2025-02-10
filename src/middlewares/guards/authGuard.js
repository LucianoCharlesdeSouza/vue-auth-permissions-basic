import { useAuthStore } from '@/stores/authStore';

export function authGuard(to, from, next) {
  const authStore = useAuthStore();

   if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
   
    if (to.path === '/dashboard') {
      return next('/login');
    }

    return next('/dashboard');
  }

  next();
}

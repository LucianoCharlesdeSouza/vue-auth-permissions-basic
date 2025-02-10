import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export function useMenu() {
  const authStore = useAuthStore();
  const router = useRouter();

  const canAccess = (permission) => authStore.hasPermission(permission);

  const user = authStore.user;

  const logout = () => {
    authStore.logout();
    router.push('/login');
  };

  return { canAccess, logout, user };
}

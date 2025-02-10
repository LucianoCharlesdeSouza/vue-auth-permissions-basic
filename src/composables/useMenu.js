import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

export function useMenu() {
  const authStore = useAuthStore();
  const router = useRouter();

  const canAccess = (permission) => authStore.hasPermission(permission);
  const isAuth = computed(() => authStore.isAuthenticated)

  const logout = () => {
    authStore.logout();
    router.push('/login');
  };



  return { canAccess, logout,isAuth };
}

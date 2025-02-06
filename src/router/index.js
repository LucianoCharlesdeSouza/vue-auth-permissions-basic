import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '../middlewares/guards/authGuard';
import Login from '@/views/LoginView.vue';
import Dashboard from '@/views/DashboardView.vue';
import Users from '@/views/UsersView.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true, permission: 'dashboard' } },
  { path: '/users', component: Users, meta: { requiresAuth: true, permission: 'users' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(authGuard);

export default router;
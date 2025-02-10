import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '../middlewares/guards/authGuard';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import Login from '@/views/LoginView.vue';
import Dashboard from '@/views/DashboardView.vue';
import Users from '@/views/UsersView.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', name: 'Login', component: Login },
  {
    path: '/',
    component: AuthenticatedLayout,
    meta: { requiresAuth: true }, 
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard, meta: {permission: 'dashboard' }  },
      { path: 'users', name: 'Users', component: Users, meta: {permission: 'users' }  }
    ]
  }  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(authGuard);

export default router;
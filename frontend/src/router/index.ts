import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import UserPage from '../views/UserPage.vue';
import Admin from "../views/Admin.vue";
import {useAuthStore} from "../stores/auth.ts";
import AuthCallback from "../views/AuthCallback.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAdmin: true },
  },
  {
    path: '/user/:link',
    name: 'UserPage',
    component: UserPage,
  }, {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: AuthCallback,
  },
];



const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard voor admin routes
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Laad user als token bestaat maar user niet
  if (authStore.token && !authStore.user) {
    await authStore.loadUser();
  }

  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      // Redirect naar home met melding
      next({ name: 'Home', query: { loginRequired: 'true' } });
    } else if (!authStore.isAdmin) {
      // Niet admin
      alert('Je hebt geen admin rechten');
      next({ name: 'Home' });
    } else {
      next();
    }
  } else {
    next();
  }
});


export default router;

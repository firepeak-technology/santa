<template>
    <!-- Voeg toe bovenaan -->
    <div class="mt-4 card bg-white w-full shadow-sm">
      <div class="card-body"  v-if="!authStore.isAdmin">
      <h2 class="text-lg ">Ben je de organisator?</h2>
        <button @click="authStore.loginWithGoogle" class="btn-google">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Login als Admin
        </button>
      </div>
      <div v-else class="card-body">
        <p>✅ Je bent ingelogd als admin</p>
        <router-link to="/admin" class="btn-admin">Ga naar Admin Dashboard</router-link>
      </div>
    </div>


</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { groupsApi, usersApi } from '../services/api';

const authStore = useAuthStore();
// ... rest blijft hetzelfde
</script>

<style scoped>
.admin-cta, .admin-info {
  background: linear-gradient(135deg, #fff5f5 0%, #f0fff4 100%);
  border: 2px solid #c41e3a;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 2rem;
}

.btn-google {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  color: #444;
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-google:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn-admin {
  display: inline-block;
  background: #c41e3a;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  margin-top: 0.5rem;
}

.btn-admin:hover {
  background: #a01729;
}
</style>

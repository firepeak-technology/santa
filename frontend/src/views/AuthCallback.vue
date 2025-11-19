
<template>
  <div class="auth-callback">
    <div class="card bg-white shadow-sm">
      <div class="card-body">
      <h2 class="text-primary font-bold text-lg">Bezig met inloggen...</h2>
      <p>Even geduld...</p></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const token = route.query.token as string;
  if (token) {
    authStore.setToken(token);
    await authStore.loadUser();

    if (authStore.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/');
      alert('Je bent niet geautoriseerd als admin');
    }
  } else {
    router.push('/');
  }
});
</script>

<style scoped>
.auth-callback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

</style>


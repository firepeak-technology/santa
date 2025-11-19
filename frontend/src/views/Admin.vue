<template>
  <div class="admin">
    <div class="admin-header">
      <div class="user-info">
        <div class="avatar">
          <div class="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
            <img v-if="authStore.user?.picture" :src="authStore.user.picture" alt="Profile" class="rounded"/>
          </div>
        </div>
        <div>
          <h2>Admin Dashboard</h2>
          <p>{{ authStore.user?.name }} ({{ authStore.user?.email }})</p>
        </div>
      </div>
      <button @click="authStore.logout" class="btn btn-secondary">Uitloggen</button>
    </div>

    <div class="card bg-white shadow-sm">
      <div class="card-body">
      <h3>Nieuwe Groep Aanmaken</h3>
      <form @submit.prevent="createGroup">
        <input
            v-model="groupName"
            type="text"
            placeholder="Groepsnaam (bijv. Kerst 2025)"
            required
            class="input"
        />
        <input
            v-model="budget"
            type="number"
            placeholder="Budget per persoon"
            required
            class="input w-20"
        />
        <button type="submit" class="ml-4 btn btn-outline btn-secondary">Groep Aanmaken</button>
      </form>
      </div>
    </div>

    <div class="mt-4 card bg-white shadow-sm">
      <div class="card-body">
        <h3>Groepen</h3>
        <div class="flex gap-2">
            <ul class="menu bg-base-200 rounded-box w-30">
                <li
                    v-for="group in groups">
                 <button @click="loadGroup(group)"> {{group.name}}</button>
                </li>
            </ul>
          <div class="flex-1">

    <div v-if="currentGroup">
      <h2>{{ currentGroup.name }} <small>&euro; {{currentGroup.budget}}</small></h2>

      <div class="section">
        <form @submit.prevent="addUser">
          <input
              v-model="username"
              type="text"
              placeholder="Gebruikersnaam"
              required
              class="input"
          />
          <button type="submit" class="ml-2 btn-outline btn btn-secondary">Toevoegen</button>
        </form>
      </div>

      <div v-if="currentGroup.users && currentGroup.users.length > 0" class="section">
        <h3>Deelnemers ({{ currentGroup.users.length }})</h3>
        <ul class="list">
          <li v-for="user in currentGroup.users" :key="user.id" class="list-row">
            <div>{{ user.username }}</div>
            <div></div>
            <button @click="copyLink(user.uniqueLink)" class="btn-copy">
              📋 Kopieer Link
            </button>
          </li>
        </ul>
      </div>

      <div v-if="currentGroup.users && currentGroup.users.length >= 2" class="section">
        <button
            @click="drawLots"
            :disabled="currentGroup.drawn"
            class="btn-draw"
        >
          {{ currentGroup.drawn ? '✅ Lootjes Getrokken!' : '🎲 Trek Lootjes' }}
        </button>
        <p v-if="currentGroup.drawn" class="info">
          De lootjes zijn getrokken! Stuur alle deelnemers hun unieke link.
        </p>
      </div>
    </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { groupsApi, usersApi } from '../services/api';

const authStore = useAuthStore();
const groupName = ref('');
const budget = ref(null);
const username = ref('');
const currentGroup = ref<any>(null);
const message = ref('');
const messageType = ref('success');

const createGroup = async () => {
  try {
    const response = await groupsApi.create(groupName.value, budget.value);
    currentGroup.value = response.data;
    showMessage('Groep succesvol aangemaakt!', 'success');
    groupName.value = '';
  } catch (error: any) {
    if (error.response?.status === 403) {
      showMessage('Geen admin rechten', 'error');
    } else {
      showMessage('Fout bij aanmaken groep', 'error');
    }
  }
};

const addUser = async () => {
  try {
    await usersApi.create(username.value, currentGroup.value.id);
    const response = await groupsApi.get(currentGroup.value.id);
    currentGroup.value = response.data;
    showMessage(`${username.value} toegevoegd!`, 'success');
    username.value = '';
  } catch (error) {
    showMessage('Fout bij toevoegen gebruiker', 'error');
  }
};

const drawLots = async () => {
  try {
    await groupsApi.drawLots(currentGroup.value.id);
    const response = await groupsApi.get(currentGroup.value.id);
    currentGroup.value = response.data;
    showMessage('Lootjes succesvol getrokken!', 'success');
  } catch (error: any) {
    if (error.response?.status === 403) {
      showMessage('Geen admin rechten', 'error');
    } else {
      showMessage('Fout bij trekken lootjes', 'error');
    }
  }
};

const copyLink = (link: string) => {
  const fullLink = `${window.location.origin}/user/${link}`;
  navigator.clipboard.writeText(fullLink);
  showMessage('Link gekopieerd!', 'success');
};

const showMessage = (msg: string, type: string) => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

const groups = ref<any[]>([]);

const fetchGroups = async () => {
  try {
    const response = await groupsApi.list();
    groups.value = response.data;
  } catch (error) {
    showMessage('Fout bij ophalen groepen', 'error');
  }
};

fetchGroups();

const loadGroup = async (group: any) => {
  try {
    const response = await groupsApi.get(group.id);
    currentGroup.value = response.data;
  } catch (error) {
    showMessage('Fout bij laden groep', 'error');
  }
};
</script>

<style scoped>
/* Kopieer styles van Home.vue en voeg toe: */

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

._user-info img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

._user-info h2 {
  margin: 0;
  color: #c41e3a;
}

._user-info p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

</style>

<template>
  <div v-if="user" class="p-4">
    <div class="card bg-white shadow-sm">
      <h2>Hallo {{ user.username }}! 👋</h2>
      
      <div class="section">
        <h3>Jouw Verlanglijstje voor <u>{{user.group.name}}</u></h3>
        <form @submit.prevent="addWishlistItem" class="flex gap-4 flex-col">
          <input v-model="newItem.item" type="text" placeholder="Item" class="input input-lg w-full" required />
          <input v-model="newItem.description" type="text" class="input input-lg w-full"  placeholder="Beschrijving (optioneel)" />
          <input v-model="newItem.link" type="url" class="input input-lg w-full"  placeholder="Link (optioneel)" />
          <button type="submit" class="btn btn-primary">Toevoegen</button>
        </form>

        <ul v-if="user.wishlist && user.wishlist.length > 0" class="list ">
          <li v-for="item in user.wishlist" :key="item.id" class="list-row">
            <div></div>
            <div class="flex-grow">{{ item.item }}
              <p class="text-xs">
                {{ item.description }}
              </p>
            </div>

            <a  v-if="item.link" :href="item.link" target="_blank"  class="btn btn-square btn-ghost">🔗 Link</a>
            <button @click="deleteItem(item.id)" class="btn btn-square btn-ghost">🗑️</button>
          </li>
        </ul>
        <p v-else class="text-gray-400 text-center italic">Je verlanglijstje is nog leeg</p>
      </div>

      <div v-if="user.drawnUser" class="section drawn">
        <h3>🎁 Jij hebt getrokken:</h3>
        <div class="drawn-user">
          <h2 class="text-xl">{{ user.drawnUser.username }}</h2>
          
          <div v-if="user.drawnUser.wishlist && user.drawnUser.wishlist.length > 0">
            <h4 class="my-4">Verlanglijstje van {{ user.drawnUser.username }}:</h4>
            <ul   class="list ">
              <li v-for="item in user.drawnUser.wishlist" :key="item.id" class="list-row">
                <div></div>
                <div class="flex-grow text-left">

                  <a v-if="item.link" :href="item.link"  class="underline font-bold" target="_blank">{{ item.item }}</a>
                  <span class="font-bold" v-else>{{item.item}}</span>
                  <p class="text-xs">
                    {{ item.description }}
                  </p>
                </div>
                <div></div>
                <a  v-if="item.link" :href="item.link" target="_blank"  class="btn btn-square btn-ghost">🔗 Link</a>

              </li>
            </ul>

          </div>
          <p v-else class="text-gray-400 text-center italic">{{ user.drawnUser.username }} heeft nog geen verlanglijstje</p>
        </div>
      </div>
      <div v-else class="section">
        <p class="info">De lootjes zijn nog niet getrokken. Kom later terug!</p>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Laden...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usersApi, wishlistsApi } from '../services/api';

const route = useRoute();
const user = ref<any>(null);
const newItem = ref({ item: '', description: '', link: '' });

onMounted(async () => {
  const link = route.params.link as string;
  try {
    const response = await usersApi.getByLink(link);
    user.value = response.data;
  } catch (error) {
    console.error('Fout bij ophalen gebruiker', error);
  }
});

const addWishlistItem = async () => {
  try {
    await wishlistsApi.create(
      user.value.id,
      newItem.value.item,
      newItem.value.description || undefined,
      newItem.value.link || undefined
    );
    const response = await usersApi.getByLink(route.params.link as string);
    user.value = response.data;
    newItem.value = { item: '', description: '', link: '' };
  } catch (error) {
    console.error('Fout bij toevoegen item', error);
  }
};

const deleteItem = async (id: string) => {
  try {
    await wishlistsApi.delete(id);
    const response = await usersApi.getByLink(route.params.link as string);
    user.value = response.data;
  } catch (error) {
    console.error('Fout bij verwijderen item', error);
  }
};
</script>

<style scoped>
.user-page {
  padding: 1rem;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

h2 {
  color: #c41e3a;
  margin-top: 0;
}

h3 {
  color: #165b33;
  margin-bottom: 1rem;
}

.section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.section:first-of-type {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}




.drawn {
  background: linear-gradient(135deg, #fff5f5 0%, #f0fff4 100%);
  border-radius: 12px;
  padding: 1.5rem;
  border: 3px solid #c41e3a;
}

.drawn-user {
  text-align: center;
  padding: 1rem;
}



.info {
  text-align: center;
  color: #666;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
}
</style>

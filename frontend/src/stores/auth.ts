import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../services/api';

interface User {
    email: string;
    name: string;
    picture: string;
    isAdmin: boolean;
}
const TOKEN_KEY = 'parrot_token';
export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
    const user = ref<User | null>(null);
    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => user.value?.isAdmin || false);

    const setToken = (newToken: string) => {
        token.value = newToken;
        localStorage.setItem(TOKEN_KEY, newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    const clearToken = () => {
        token.value = null;
        user.value = null;
        localStorage.removeItem(TOKEN_KEY);
        delete api.defaults.headers.common['Authorization'];
    };

    const loadUser = async () => {
        if (!token.value) return;

        try {
            api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
            const response = await api.get('/auth/me');

            user.value = response.data;
        } catch (error) {
            console.error('Failed to load user:', error);
            clearToken();
        }
    };

    const loginWithGoogle = () => {
        const backendUrl = import.meta.env.DEV
            ? 'http://localhost:3000'
            : '/api';
        window.location.href = `${backendUrl}/auth/google`;
    };

    const logout = () => {
        clearToken();
    };

    return {
        token,
        user,
        isAuthenticated,
        isAdmin,
        setToken,
        clearToken,
        loadUser,
        loginWithGoogle,
        logout,
    };
});

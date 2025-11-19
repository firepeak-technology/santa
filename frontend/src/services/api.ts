import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const groupsApi = {
  create: (name: string) => api.post('/groups', { name }),
  list: (name: string) => api.get('/groups', ),
  get: (id: string) => api.get(`/groups/${id}`),
  drawLots: (id: string) => api.post(`/groups/${id}/draw`),
};

export const usersApi = {
  create: (username: string, groupId: string) => api.post('/users', { username, groupId }),
  getByLink: (link: string) => api.get(`/users/link/${link}`),
};

export const wishlistsApi = {
  create: (userId: string, item: string, description?: string, link?: string) => 
    api.post('/wishlists', { userId, item, description, link }),
  getByUser: (userId: string) => api.get(`/wishlists/user/${userId}`),
  delete: (id: string) => api.delete(`/wishlists/${id}`),
};

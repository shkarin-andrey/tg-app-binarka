import axios from 'axios';

const { VITE_APP_API_URL, VITE_APP_TOKEN } = import.meta.env;

export const api = axios.create({
  baseURL: VITE_APP_API_URL,
  headers: {
    Authorization: `Bearer ${VITE_APP_TOKEN}`,
  },
});

import axios from 'axios';

export const baseAPI = axios.create({
  baseURL: process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_CLIENT_API_URL,
});

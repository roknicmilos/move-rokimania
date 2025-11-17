import { Entry } from "@/type";
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_CLIENT_API_URL,
});

export const moveAPI = {

  async getEntries(): Promise<Entry[]> {
    const config = {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    };

    const res = await api.get<Entry[]>('/entries/', config);
    return res.data;
  },

  async createRepsEntry(data: {
    exercise: string;
    reps: number;
    load?: number;
  }): Promise<Entry> {

    const res = await api.post<Entry>('/entries/reps', data);
    return res.data;
  },

  async createHoldEntry(data: {
    exercise: string;
    started_at: string;
    ended_at: string;
    load?: number;
  }): Promise<Entry> {

    const res = await api.post<Entry>('/entries/hold', data);
    return res.data;
  },

  async deleteRepsEntry(id: number): Promise<void> {
    await api.delete(`/entries/reps/${id}`);
  },

  async deleteHoldEntry(id: number): Promise<void> {
    await api.delete(`/entries/hold/${id}`);
  },

};
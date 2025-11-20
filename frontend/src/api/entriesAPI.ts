import { Entry } from "@/api/type";
import { baseAPI, createAPI } from "@/api/baseAPI";

export const entryAPI = {

  /**
   * Meant to be used in server components only
   */
  async getEntries(userToken?: string): Promise<Entry[]> {
    const baseAPI = createAPI(userToken)
    const res = await baseAPI.get('/entries/');
    return res.data as Entry[];
  },

  async createRepsEntry(data: {
    exercise: string;
    reps: number;
    load?: number;
  }): Promise<Entry> {

    const res = await baseAPI.post('/entries/reps', data);
    return res.data as Entry;
  },

  async createHoldEntry(data: {
    exercise: string;
    started_at: string;
    ended_at: string;
    load?: number;
  }): Promise<Entry> {

    const res = await baseAPI.post('/entries/hold', data);
    return res.data as Entry;
  },

  async deleteRepsEntry(id: number): Promise<void> {
    await baseAPI.delete(`/entries/reps/${id}`);
  },

  async deleteHoldEntry(id: number): Promise<void> {
    await baseAPI.delete(`/entries/hold/${id}`);
  },

};

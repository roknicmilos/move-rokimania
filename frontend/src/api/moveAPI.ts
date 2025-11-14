import { Entry } from "@/type";

export const moveAPI = {

  async getEntries(): Promise<Entry[]> {
    const url = process.env.INTERNAL_API_URL + '/entries/';
    const res = await fetch(url, {cache: 'no-store'});
    if (!res.ok) {
      throw new Error(`Failed to fetch entries: ${res.statusText}`);
    }
    return res.json();
  }

};

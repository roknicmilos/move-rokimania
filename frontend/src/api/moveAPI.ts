import { entryAPI } from "@/api/entriesAPI";
import { usersAPI } from "@/api/usersAPI";


export const moveAPI = {
  ...entryAPI,
  ...usersAPI,
};

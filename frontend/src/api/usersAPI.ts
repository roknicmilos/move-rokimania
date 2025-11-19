import { baseAPI } from "@/api/baseAPI";
import { AxiosResponse } from "axios";
import { LoginApiValidationError, RegisterApiValidationError } from "@/core/errors";

export const usersAPI = {

  async register(username: string, password: string): Promise<AxiosResponse> {
    const response = await baseAPI.post(
      "/users/register",
      {username, password},
      {validateStatus: () => true}
    )

    if (response.status === 400) {
      throw new RegisterApiValidationError(response.data);
    }

    return response;
  },

  async login(username: string, password: string): Promise<AxiosResponse> {
    const response = await baseAPI.post(
      "/users/login",
      {username, password},
      {validateStatus: () => true}
    )

    if (response.status === 400) {
      throw new LoginApiValidationError(response.data);
    }

    return response;
  }

};

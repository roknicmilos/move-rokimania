import { baseAPI } from "@/api/baseAPI";
import { LoginApiValidationError, RegisterApiValidationError } from "@/core/errors";
import { AuthResponse } from "@/api/type";

export const usersAPI = {

  async register(username: string, password: string): Promise<AuthResponse> {
    const response = await baseAPI.post(
      "/users/register",
      {username, password},
      {validateStatus: () => true}
    )

    if (response.status === 400) {
      throw new RegisterApiValidationError(response.data);
    }

    if (response.status !== 201) {
      throw new Error("Registration failed");
    }

    return response.data;
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await baseAPI.post(
      "/users/login",
      {username, password},
      {validateStatus: () => true}
    )

    if (response.status === 400) {
      throw new LoginApiValidationError(response.data);
    }

    if (response.status !== 200) {
      throw new Error("Login failed");
    }

    return response.data;
  }

};

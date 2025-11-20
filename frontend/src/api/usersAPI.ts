import { baseAPI, createAPI } from "@/api/baseAPI";
import { LoginApiValidationError, RegisterApiValidationError } from "@/core/errors";
import { User } from "@/api/type";

export const usersAPI = {

  async register(username: string, password: string): Promise<User> {
    const response = await baseAPI.post(
      "/users/register",
      { username, password },
      { validateStatus: () => true }
    );

    if (response.status === 400) {
      throw new RegisterApiValidationError(response.data);
    }

    if (response.status !== 201) {
      throw new Error("Registration failed");
    }

    return response.data;
  },

  async login(username: string, password: string): Promise<User> {
    const response = await baseAPI.post(
      "/users/login",
      { username, password },
      { validateStatus: () => true }
    )

    if (response.status === 400) {
      throw new LoginApiValidationError(response.data);
    }

    if (response.status !== 200) {
      throw new Error("Login failed");
    }

    return response.data;
  },

  /**
   * Can be used in both server and client components
   */
  async getMe(userToken?: string): Promise<User | null> {
    const api = userToken ? createAPI(userToken) : baseAPI;
    const response = await api.get("/users/me", { validateStatus: () => true });
    if (response.status === 401) {
      return null;
    }
    return response.data;
  },

  async logout(): Promise<void> {
    await baseAPI.post("/users/logout");
  }

};

import axios from 'axios';


export const createAPI = (userToken?: string) => {
  const config = {}
  if (userToken) {
    Object.assign(config, {
      headers: {
        Cookie: `user_token=${userToken}`,
      }
    });
  }

  return axios.create({
    baseURL: process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_CLIENT_API_URL,
    withCredentials: true,
    ...config,
  });
};

export const baseAPI = createAPI();

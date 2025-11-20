"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/api/type";
import { moveAPI } from "@/api/moveAPI";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  refetchUser: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [ user, setUser ] = useState<User | null>(null);
  const [ isLoading, setIsLoading ] = useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await moveAPI.getMe();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to fetch user", error);
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    await moveAPI.logout();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <UserContext.Provider value={{ user, logout, isLoading, refetchUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

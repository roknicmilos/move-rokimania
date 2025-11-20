"use client"

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { moveAPI } from "@/api/moveAPI";
import { LoginApiValidationError, RegisterApiValidationError } from "@/core/errors";
import { toast, Toaster } from "react-hot-toast";
import { X } from "lucide-react";

type FormErrors = {
  username?: string;
  password?: string;
  __all__?: string;
}

type AuthMode = "register" | "login";

type AuthFormProps = {
  mode: AuthMode;
  redirectOnSuccess: string;
};

export default function AuthForm({mode, redirectOnSuccess}: AuthFormProps) {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errors, setErrors ] = useState<FormErrors>({});
  const [ isLoading, setIsLoading ] = useState(false);

  const showErrorToast = (message: string) => {
    toast.custom(
      (t) => (
        <div
          className={
            "flex items-center justify-between bg-red-100 border border-red-300" +
            " text-red-900 px-6 py-4 rounded-lg shadow-lg max-w-md w-full animate-slide-down" +
            ` ${t.visible ? 'animate-enter' : 'animate-leave'}`
          }
        >
          <span className="font-medium">{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 text-red-700 hover:text-red-900 transition"
          >
            <X size={20} className="cursor-pointer"/>
          </button>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const apiCall = mode === "register"
      ? moveAPI.register
      : moveAPI.login;
    try {
      await apiCall(username, password);
    } catch (error: any) {
      console.log(error.name);
      if (error instanceof RegisterApiValidationError || error instanceof LoginApiValidationError) {
        // Field-specific errors
        setErrors(error.fields);
        if (error.fields.__all__) {
          // Show general error message as toast
          showErrorToast(error.fields.__all__);
        }
      } else {
        // Fallback: Show generic error message as toast
        showErrorToast("Ops! Something went wrong. Please try again.");
      }
      return;
    } finally {
      setIsLoading(false);
    }

    // On success, redirect to the specified page
    window.location.href = redirectOnSuccess;
  };

  return (
    <>
      <Toaster/>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <p id="username-error" className="mt-1 text-sm text-red-600">
              {errors.username}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end">
          <Button className="cursor-pointer" type="submit" disabled={isLoading}>
            {
              isLoading
                ? (mode === "register" ? "Registering..." : "Signing in...")
                : (mode === "register" ? "Register" : "Sign in")
            }
          </Button>
        </div>
      </form>
    </>
  );
}

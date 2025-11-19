"use client"

import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {useRouter} from "next/navigation";

type FormErrors = {
  username?: string;
  password?: string;
}

type AuthMode = "register" | "login";

type AuthFormProps = {
  mode: AuthMode;
  redirectOnSuccess: string;
};

export default function AuthForm({mode, redirectOnSuccess}: AuthFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const baseURL = process.env.NEXT_PUBLIC_CLIENT_API_URL || "";
      const url = `${baseURL}/users/${mode}`;

      const res = await axios.post(
        url,
        {username, password},
        {validateStatus: () => true}
      );

      if ((mode === "register" && res.status === 201) || (mode === "login" && res.status === 200)) {
        router.push(redirectOnSuccess);
        return;
      }

      if (res.status === 400 && res.data && res.data.errors) {
        const fieldErrors: any = {};
        const errs = res.data.errors;
        if (errs.username && Array.isArray(errs.username)) {
          fieldErrors.username = errs.username.join(" ");
        }
        if (errs.password && Array.isArray(errs.password)) {
          fieldErrors.password = errs.password.join(" ");
        }
        setErrors(fieldErrors);
        return;
      }

      // Generic error
      setErrors({username: `${mode === "register" ? "Registration" : "Login"} failed. Please try again.`});
    } catch (err) {
      setErrors({username: "Network error. Please try again."});
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
          <p id="password-error" className="mt-1 text-sm text-red-600">{errors.password}</p>
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
  );
}

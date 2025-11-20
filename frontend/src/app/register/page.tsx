import AuthForm from "@/components/AuthForm";
import { redirectIfAuthenticated } from "@/core/serverUtils";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Account
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <AuthForm mode="register" redirectOnSuccess="/"/>
        </div>
      </div>
    </main>
  );
}

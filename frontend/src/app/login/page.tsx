import AuthForm from "@/components/AuthForm";
import { redirectIfAuthenticated } from "@/core/serverUtils";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sign In
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <AuthForm mode="login" redirectOnSuccess="/"/>
        </div>
      </div>
    </main>
  );
}

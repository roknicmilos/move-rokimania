import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create Account</h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <AuthForm mode="register" redirectOnSuccess="/"/>
        </div>
      </div>
    </main>
  );
}

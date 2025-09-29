"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Enviamos um link de redefinição para seu e-mail.");
    } catch {
      toast.error("Erro ao enviar link. Verifique o e-mail.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-6">
            Recuperar Senha
          </h2>
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full"
              required
            />
            <button type="submit" className="btn-primary w-full">
              Enviar Link
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            <Link href="/login" className="text-[var(--color-primary)] hover:underline">
              Voltar ao login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

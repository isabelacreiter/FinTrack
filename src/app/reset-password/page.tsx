"use client";
import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Link de recuperação enviado para seu e-mail!");
      router.push("/login");
    } catch (err) {
      toast.error("E-mail não encontrado ou inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-6">Recuperar Senha</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
            required
          />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Link"}
          </button>
        </form>
        <p className="mt-4 text-center">
          <Link href="/login" className="text-[var(--color-primary)] hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
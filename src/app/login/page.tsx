"use client";
import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import SocialLogin from "@/components/SocialLogin";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        toast.error("Verifique seu e-mail antes de fazer login.");
        return;
      }

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-6">Entrar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input w-full"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input w-full"
            required
          />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <SocialLogin />

        <div className="mt-3 text-right">
          <Link href="/reset-password" className="text-sm text-[var(--color-primary)] hover:underline">
            Esqueci minha senha
          </Link>
        </div>

        <p className="mt-4 text-center text-gray-600">
          Não tem conta?{" "}
          <Link href="/register" className="text-[var(--color-primary)] hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
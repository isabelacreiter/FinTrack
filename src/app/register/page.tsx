"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

async function validarCPF(cpf: string): Promise<boolean> {
  if (!/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(cpf)) return false;
  try {
    const res = await fetch(`https://api-digitacao-cpf.vercel.app/api/validate?cpf=${cpf}`);
    const data = await res.json();
    return data.valid === true;
  } catch {
    return false;
  }
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", cpf: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!(await validarCPF(form.cpf))) {
      toast.error("CPF inválido ou inexistente. Use o formato 000.000.000-00");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        cpf: form.cpf,
      });

      await sendEmailVerification(user);
      toast.success("Conta criada! Verifique seu e-mail para ativar.");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("email-already-in-use")) {
          toast.error("Este e-mail já está em uso.");
        } else if (error.message.includes("weak-password")) {
          toast.error("A senha deve ter pelo menos 6 caracteres.");
        } else {
          toast.error("Erro ao cadastrar. Tente novamente.");
        }
      } else {
        toast.error("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-white">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-6">Criar Conta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input w-full"
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input w-full"
            required
          />
          <input
            type="text"
            placeholder="CPF (000.000.000-00)"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            className="input w-full"
            required
          />
          <input
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input w-full"
            minLength={6}
            required
          />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Já tem conta?{" "}
          <Link href="/login" className="text-[var(--color-primary)] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
"use client";
import Link from "next/link";
import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function validarCPF(cpf: string) {
  return /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(cpf);
}

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", cpf: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validarCPF(form.cpf)) {
      setError("CPF inválido. Use o formato 000.000.000-00");
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

      setSuccess("✅ Cadastro realizado com sucesso! Verifique seu e-mail para ativar a conta.");
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este e-mail já está em uso. Faça login ou use outro e-mail.");
      } else if (err.code === "auth/invalid-email") {
        setError("O e-mail informado é inválido.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-100 to-white">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[var(--color-primary)] mb-6">Criar Conta</h2>

        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          <input
            type="text"
            placeholder="CPF (000.000.000-00)"
            value={form.cpf}
            onChange={(e) => setForm({ ...form, cpf: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          <button type="submit" className="btn-primary w-full">Cadastrar</button>
        </form>

        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        {success && <p className="text-green-600 mt-2 text-center">{success}</p>}

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

"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Entrar</h2>
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Senha"
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-gray-500">
          Não tem conta?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Criar Conta
          </Link>
        </p>
      </div>
    </div>
  );
}

// src/app/add-income/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function AddIncomePage() {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");
  const router = useRouter();

  // Proteger rota
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "receitas"), {
        descricao,
        valor: Number(valor),
        categoria,
        data,
      });
      toast.success("Receita adicionada!");
      router.push("/transactions");
    } catch {
      toast.error("Erro ao adicionar receita.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Adicionar Receita</h2>
          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="input w-full"
            required
          />
          <input
            type="number"
            placeholder="Valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="input w-full"
            required
            min="0"
            step="0.01"
          />
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="input w-full"
            required
          />
          <input
            type="text"
            placeholder="Origem"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="input w-full"
          />
          <button type="submit" className="btn-secondary w-full">
            Adicionar Receita
          </button>
        </form>
      </main>
    </div>
  );
}
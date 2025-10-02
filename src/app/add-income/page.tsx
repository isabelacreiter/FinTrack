// src/app/add-income/page.tsx
"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function AddIncomePage() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      toast.error("Usuário não autenticado.");
      return;
    }

    if (!description || !amount || !date) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await addDoc(collection(db, "users", user.uid, "receitas"), {
        descricao: description,
        valor: parseFloat(amount),
        data: date,
        categoria: source || "Outros",
        createdAt: new Date().toISOString(),
      });
      toast.success("Receita adicionada com sucesso!");
      router.push("/transactions");
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      toast.error("Erro ao salvar receita. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-md mx-auto w-full">
        <h1 className="text-xl font-bold mb-4">Adicionar Receita</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
          <input
            type="number"
            placeholder="Valor"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded p-2 w-full"
            required
            min="0"
            step="0.01"
          />
          <input
            type="text"
            placeholder="Origem (ex: Salário)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border rounded p-2 w-full"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            Salvar Receita
          </button>
        </form>
      </main>
    </div>
  );
}
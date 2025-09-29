"use client";
import { useState } from "react";

export default function AddExpensePage() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nova despesa:", { description, amount, category, date });

    // Aqui você pode integrar com sua API/banco
    setDescription("");
    setAmount("");
    setCategory("");
    setDate("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Adicionar Despesa</h1>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
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
        />
        <input
          type="text"
          placeholder="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Salvar Despesa
        </button>
      </form>
    </div>
  );
}

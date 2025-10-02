"use client";

import { useState } from "react";

interface TransactionData {
  descricao: string;
  valor: string;
  data: string; // Corrigido aqui
  categoria: string;
  status?: string;
}

type TransactionFormProps = {
  type: "receita" | "despesa";
  onSubmit: (data: TransactionData) => void;
};

export default function TransactionForm({ type, onSubmit }: TransactionFormProps) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState("Pendente");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ descricao, valor, data, categoria, ...(type === "despesa" && { status }) });
    // Reset opcional — você pode remover se quiser manter os dados
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200">
      <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">
        Cadastrar {type === "receita" ? "Receita" : "Despesa"}
      </h3>

      <div>
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
        />
      </div>

      <div>
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          required
        />
      </div>

      <div>
        <input
          type="text"
          placeholder={type === "receita" ? "Origem (ex: Salário)" : "Categoria (ex: Alimentação)"}
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      {type === "despesa" && (
        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white py-3 rounded-lg font-semibold transition"
      >
        Adicionar {type === "receita" ? "Receita" : "Despesa"}
      </button>
    </form>
  );
}
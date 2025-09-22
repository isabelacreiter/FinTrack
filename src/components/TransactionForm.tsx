"use client";

import { useState } from "react";

type TransactionFormProps = {
  type: "receita" | "despesa";
  onSubmit: (data: any) => void;
};

export default function TransactionForm({ type, onSubmit }: TransactionFormProps) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState("Pendente");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ descricao, valor, data, categoria, status });
    setDescricao("");
    setValor("");
    setData("");
    setCategoria("");
    setStatus("Pendente");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-xl font-bold text-indigo-700 mb-4">
        Cadastrar {type === "receita" ? "Receita" : "Despesa"}
      </h3>

      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-indigo-600"
      />

      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-indigo-600"
      />

      <input
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-indigo-600"
      />

      <input
        type="text"
        placeholder="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="w-full p-3 border rounded-lg focus:outline-indigo-600"
      />

      {type === "despesa" && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-indigo-600"
        >
          <option value="Pago">Pago</option>
          <option value="Pendente">Pendente</option>
        </select>
      )}

      <button className="w-full bg-indigo-700 text-white py-3 rounded-lg font-semibold hover:bg-indigo-800">
        Adicionar
      </button>
    </form>
  );
}

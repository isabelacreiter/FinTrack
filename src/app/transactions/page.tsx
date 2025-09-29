"use client";
import { useState } from "react";

interface Transaction {
  id: number;
  type: "despesa" | "receita";
  description: string;
  amount: number;
  date: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: "despesa", description: "Alimentação", amount: 50, date: "2025-09-01" },
    { id: 2, type: "receita", description: "Salário", amount: 3000, date: "2025-09-05" },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Transações</h1>
      <table className="border-collapse w-full max-w-3xl">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Descrição</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Valor</th>
            <th className="border p-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.description}</td>
              <td className="border p-2">
                {t.type === "despesa" ? "Despesa" : "Receita"}
              </td>
              <td className={`border p-2 ${t.type === "despesa" ? "text-red-500" : "text-green-500"}`}>
                R$ {t.amount.toFixed(2)}
              </td>
              <td className="border p-2">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

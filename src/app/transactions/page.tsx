// src/app/transactions/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Transaction {
  id: string;
  type: "despesa" | "receita";
  descricao: string;
  valor: number;
  data: string; // Corrigido aqui
  categoria: string;
  status?: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadTransactions = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const uid = user.uid;
        const receitasSnap = await getDocs(collection(db, "users", uid, "receitas"));
        const despesasSnap = await getDocs(collection(db, "users", uid, "despesas"));

        const all: Transaction[] = [];

        receitasSnap.forEach((doc) => {
          all.push({ id: doc.id, type: "receita", ...doc.data() } as Transaction);
        });

        despesasSnap.forEach((doc) => {
          all.push({ id: doc.id, type: "despesa", ...doc.data() } as Transaction);
        });

        // Ordenar por data (mais recente primeiro)
        all.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        setTransactions(all);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        toast.error("Erro ao carregar transações.");
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [router]);

  const handleDelete = async (id: string, type: "receita" | "despesa") => {
    if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

    try {
      const col = type === "receita" ? "receitas" : "despesas";
      await deleteDoc(doc(db, "users", auth.currentUser!.uid, col, id));
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transação excluída!");
    } catch (error) {
      toast.error("Erro ao excluir transação.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <p className="text-center mt-10">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Minhas Transações</h1>
          <div className="flex gap-2">
            <Link href="/add-income" className="btn-secondary text-sm px-3 py-1.5">
              + Receita
            </Link>
            <Link href="/add-expense" className="btn-primary text-sm px-3 py-1.5">
              + Despesa
            </Link>
          </div>
        </div>

        {transactions.length === 0 ? (
          <p className="text-gray-500">Nenhuma transação cadastrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Descrição</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Data</th>
                  <th className="p-3 text-right">Valor</th>
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{t.descricao}</td>
                    <td className="p-3 text-gray-600">{t.categoria}</td>
                    <td className="p-3">{new Date(t.data).toLocaleDateString("pt-BR")}</td>
                    <td
                      className={`p-3 text-right font-semibold ${
                        t.type === "despesa" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {t.valor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <Link
                        href={`/edit-transaction/${t.id}?type=${t.type}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(t.id, t.type)}
                        className="text-red-600 hover:underline text-sm ml-2"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
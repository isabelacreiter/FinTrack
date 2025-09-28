"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, getDocs, deleteDoc, doc, QueryDocumentSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        const receitasSnap = await getDocs(collection(db, "users", user.uid, "receitas"));
        const despesasSnap = await getDocs(collection(db, "users", user.uid, "despesas"));

        const allTransactions = [
          ...receitasSnap.docs.map((d: QueryDocumentSnapshot) => ({ ...d.data(), id: d.id, type: "receita" })),
          ...despesasSnap.docs.map((d: QueryDocumentSnapshot) => ({ ...d.data(), id: d.id, type: "despesa" }))
        ];

        setTransactions(allTransactions);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleDelete = async (id: string, type: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      try {
        await deleteDoc(doc(db, "users", auth.currentUser!.uid, type === "receita" ? "receitas" : "despesas", id));
        setTransactions(transactions.filter(t => t.id !== id));
        toast.success("Transação excluída!");
      } catch (err) {
        toast.error("Erro ao excluir.");
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Minhas Transações</h2>
        <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Descrição</th>
                <th className="text-left py-2">Valor</th>
                <th className="text-left py-2">Data</th>
                <th className="text-left py-2">Categoria</th>
                <th className="text-left py-2">Tipo</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="py-2">{t.descricao}</td>
                  <td className="py-2">R$ {t.valor}</td>
                  <td className="py-2">{t.data}</td>
                  <td className="py-2">{t.categoria}</td>
                  <td className="py-2">{t.type === "receita" ? "Receita" : "Despesa"}</td>
                  <td className="py-2">{t.status || "-"}</td>
                  <td className="py-2">
                    <button
                      onClick={() => router.push(`/edit-transaction/${t.id}?type=${t.type}`)}
                      className="text-blue-600 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.type)}
                      className="text-red-600"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

interface TransactionData {
  descricao: string;
  valor: string;
  data: string; // Corrigido aqui
  categoria: string;
  status: string;
}

interface PageProps {
  params: { id: string };
}

export default function EditTransactionPage({ params }: PageProps) {
  const [formData, setFormData] = useState<TransactionData>({
    descricao: "",
    valor: "",
    data: "",
    categoria: "",
    status: "Pendente",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  useEffect(() => {
    const load = async () => {
      if (!type) return;
      try {
        const col = type === "receita" ? "receitas" : "despesas";
        const docRef = doc(db, "users", auth.currentUser!.uid, col, params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(docSnap.data() as TransactionData);
        }
      } catch {
        toast.error("Erro ao carregar.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id, type]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!type) return;
    if (!auth.currentUser) {
      toast.error("Usuário não autenticado.");
      return;
    }
    try {
      const col = type === "receita" ? "receitas" : "despesas";
      // Garante que valor seja número ao salvar
      const dataToSave = { ...formData, valor: Number(formData.valor) };
      await updateDoc(doc(db, "users", auth.currentUser.uid, col, params.id), dataToSave);
      toast.success("Atualizado com sucesso!");
      router.push("/transactions");
    } catch {
      toast.error("Erro ao salvar.");
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-md mx-auto w-full">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">
          Editar {type === "receita" ? "Receita" : "Despesa"}
        </h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <input
            type="text"
            placeholder="Descrição"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          <input
            type="number"
            placeholder="Valor"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          <input
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          <input
            type="text"
            placeholder="Categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
          {type === "despesa" && (
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <option value="Pago">Pago</option>
              <option value="Pendente">Pendente</option>
            </select>
          )}
          <button type="submit" className="btn-primary w-full">
            Salvar Alterações
          </button>
        </form>
      </main>
    </div>
  );
}
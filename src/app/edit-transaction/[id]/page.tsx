"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

interface TransactionData {
  descricao: string;
  valor: string;
  data: string;
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
      if (!type || !auth.currentUser) return;
      try {
        const col = type === "receita" ? "receitas" : "despesas";
        const docRef = doc(db, "users", auth.currentUser.uid, col, params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData({
            descricao: docSnap.data().descricao || "",
            valor: String(docSnap.data().valor ?? ""),
            data: docSnap.data().data || "",
            categoria: docSnap.data().categoria || "",
            status: docSnap.data().status || "Pendente",
          });
        }
      } catch {
        toast.error("Erro ao carregar.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!type || !auth.currentUser) return;
    try {
      const col = type === "receita" ? "receitas" : "despesas";
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="descricao"
            placeholder="Descrição"
            value={formData.descricao}
            onChange={handleChange}
            className="input w-full"
            required
          />
          <input
            type="number"
            name="valor"
            placeholder="Valor"
            value={formData.valor}
            onChange={handleChange}
            className="input w-full"
            required
            min="0"
            step="0.01"
          />
          <input
            type="date"
            name="data"
            value={formData.data}
            onChange={handleChange}
            className="input w-full"
            required
          />
          <input
            type="text"
            name="categoria"
            placeholder={type === "receita" ? "Origem" : "Categoria"}
            value={formData.categoria}
            onChange={handleChange}
            className="input w-full"
          />
          {type === "despesa" && (
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
            </select>
          )}
          <button type="submit" className="btn-primary w-full">
            Salvar
          </button>
        </form>
      </main>
    </div>
  );
}
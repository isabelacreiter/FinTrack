"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || "");
          setEmail(data.email || "");
          setCpf(data.cpf || "");
        }
      } catch (err) {
        toast.error("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser!.uid), { name, cpf });
      toast.success("Perfil atualizado!");
    } catch (err) {
      toast.error("Erro ao salvar.");
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-md mx-auto w-full">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Meu Perfil</h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">CPF</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <button onClick={handleUpdate} className="btn-primary w-full">
            Salvar Alterações
          </button>
        </div>
      </main>
    </div>
  );
}
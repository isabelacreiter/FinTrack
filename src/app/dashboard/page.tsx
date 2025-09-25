"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { collection, getDocs } from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [receitas, setReceitas] = useState<number>(0);
  const [despesas, setDespesas] = useState<number>(0);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [cotacao, setCotacao] = useState<{ dolar: number; ibovespa: number }>({ dolar: 0, ibovespa: 0 });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        carregarDados(user.uid);
        carregarCotacoes();
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // 🔹 Busca dados de receitas e despesas
  const carregarDados = async (uid: string) => {
    const receitasSnap = await getDocs(collection(db, "users", uid, "receitas"));
    const despesasSnap = await getDocs(collection(db, "users", uid, "despesas"));

    let totalReceitas = 0;
    let totalDespesas = 0;
    let vencimentos: any[] = [];

    receitasSnap.forEach((doc) => {
      totalReceitas += Number(doc.data().valor);
    });

    despesasSnap.forEach((doc) => {
      totalDespesas += Number(doc.data().valor);
      if (doc.data().status === "Pendente") {
        vencimentos.push(doc.data());
      }
    });

    setReceitas(totalReceitas);
    setDespesas(totalDespesas);
    setAlertas(vencimentos);
  };

  // 🔹 Busca cotação do dólar e ibovespa
  const carregarCotacoes = async () => {
    try {
      const respDolar = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");
      const dolarData = await respDolar.json();
      const dolar = parseFloat(dolarData.USDBRL.bid);

      const respIbov = await fetch("https://api.hgbrasil.com/finance?format=json-cors&key=demo-key");
      const ibovData = await respIbov.json();
      const ibovespa = ibovData.results.stocks.IBOVESPA.points;

      setCotacao({ dolar, ibovespa });
    } catch (err) {
      console.error("Erro nas cotações", err);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  const saldo = receitas - despesas;

  return (
    <div>
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)]">Dashboard</h2>

        {/* 🔹 Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Receitas" value={`R$ ${receitas.toFixed(2)}`} color="bg-green-100" />
          <Card title="Despesas" value={`R$ ${despesas.toFixed(2)}`} color="bg-red-100" />
          <Card title="Saldo" value={`R$ ${saldo.toFixed(2)}`} color="bg-blue-100" />
        </div>

        {/* 🔹 Gráfico */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Distribuição de Gastos</h3>
          <Pie
            data={{
              labels: ["Receitas", "Despesas"],
              datasets: [
                {
                  data: [receitas, despesas],
                  backgroundColor: ["#22c55e", "#ef4444"],
                },
              ],
            }}
          />
        </div>

        {/* 🔹 Alertas */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Alertas de Vencimentos</h3>
          {alertas.length === 0 ? (
            <p className="text-gray-500">Nenhuma despesa pendente 🎉</p>
          ) : (
            <ul className="list-disc pl-6 space-y-2">
              {alertas.map((item, i) => (
                <li key={i}>
                  {item.descricao} - R$ {item.valor} (Vencimento: {item.data})
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔹 Cotações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Dólar Hoje" value={`R$ ${cotacao.dolar.toFixed(2)}`} color="bg-yellow-100" />
          <Card title="Ibovespa" value={`${cotacao.ibovespa.toFixed(0)} pts`} color="bg-purple-100" />
        </div>
      </div>
    </div>
  );
}

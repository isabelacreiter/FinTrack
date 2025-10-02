"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import toast from "react-hot-toast";

// Tipos
interface DespesaFirestore {
  descricao: string;
  valor: number | string;
  data: string; // Corrigido aqui
  categoria?: string;
  status: string;
}

interface Cotacao {
  dolar: number;
  ibovespa: number;
}

// Funções auxiliares
const formatarMoeda = (valor: number) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatarData = (data: string) =>
  new Date(data).toLocaleDateString("pt-BR");

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [receitas, setReceitas] = useState<number>(0);
  const [despesas, setDespesas] = useState<number>(0);
  const [alertas, setAlertas] = useState<DespesaFirestore[]>([]);
  const [cotacao, setCotacao] = useState<Cotacao>({ dolar: 0, ibovespa: 0 });
  const [categoriasDespesas, setCategoriasDespesas] = useState<{ [key: string]: number }>({});
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

  const carregarDados = async (uid: string) => {
    const receitasSnap = await getDocs(collection(db, "users", uid, "receitas"));
    const despesasSnap = await getDocs(collection(db, "users", uid, "despesas"));

    let totalReceitas = 0;
    let totalDespesas = 0;
    const categorias: { [key: string]: number } = {};
    const vencimentos: DespesaFirestore[] = [];
    const hoje = new Date();
    const limite = new Date();
    limite.setDate(hoje.getDate() + 7);

    receitasSnap.forEach((doc: QueryDocumentSnapshot) => {
      totalReceitas += Number(doc.data().valor);
    });

    despesasSnap.forEach((doc: QueryDocumentSnapshot) => {
      const data = doc.data() as DespesaFirestore;
      const valor = Number(data.valor);
      totalDespesas += valor;

      const cat = data.categoria || "Outros";
      categorias[cat] = (categorias[cat] || 0) + valor;

      if (data.status === "Pendente" && data.data) {
        const dataVenc = new Date(data.data);
        if (dataVenc >= hoje && dataVenc <= limite) {
          vencimentos.push(data);
        }
      }
    });

    setReceitas(totalReceitas);
    setDespesas(totalDespesas);
    setCategoriasDespesas(categorias);
    setAlertas(vencimentos);
  };

  const carregarCotacoes = async () => {
    try {
      const respDolar = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL");
      const dolarData = await respDolar.json();
      const dolar = parseFloat(dolarData.USDBRL?.bid) || 0;

      const respIbov = await fetch("https://brapi.dev/api/quote/^BVSP");
      const ibovData = await respIbov.json();
      const ibovespa = ibovData?.results?.[0]?.regularMarketPrice
        ? parseFloat(ibovData.results[0].regularMarketPrice.toFixed(2))
        : 0;

      setCotacao({ dolar, ibovespa });
    } catch {
      toast.error("Erro ao carregar cotações.");
      setCotacao({ dolar: 0, ibovespa: 0 });
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  const saldo = receitas - despesas;
  const categorias = Object.keys(categoriasDespesas);
  const valores = Object.values(categoriasDespesas);
  const cores = [
    "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6",
    "#8b5cf6", "#ec4899", "#6b7280", "#10b981", "#f43f5e"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)]">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Receitas" value={formatarMoeda(receitas)} color="bg-green-100" />
          <Card title="Despesas" value={formatarMoeda(despesas)} color="bg-red-100" />
          <Card title="Saldo" value={formatarMoeda(saldo)} color="bg-blue-100" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Distribuição de Despesas por Categoria</h3>
          {categorias.length > 0 ? (
            <Pie
              data={{
                labels: categorias,
                datasets: [{ data: valores, backgroundColor: cores.slice(0, categorias.length) }],
              }}
              options={{ plugins: { legend: { position: "bottom" as const } } }}
              aria-label="Gráfico de pizza mostrando a distribuição de despesas por categoria"
            />
          ) : (
            <p className="text-gray-500">Nenhuma despesa cadastrada ainda.</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">Alertas de Vencimento (Próximos 7 Dias)</h3>
          {alertas.length === 0 ? (
            <p className="text-gray-500">Nenhuma despesa vencendo nos próximos dias 🎉</p>
          ) : (
            <ul className="space-y-2">
              {alertas.map((item, i) => {
                const diasRestantes = (new Date(item.data).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
                const destaque = diasRestantes <= 2 ? "border-red-600 bg-red-100" : "border-red-500 bg-red-50";
                return (
                  <li key={i} className={`p-3 rounded-lg border-l-4 ${destaque}`}>
                    <strong>{item.descricao}</strong> - {formatarMoeda(Number(item.valor))}
                    <br />
                    <span className="text-sm text-gray-600">Vencimento: {formatarData(item.data)}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="Dólar Hoje"
            value={cotacao.dolar ? formatarMoeda(cotacao.dolar) : "Indisponível"}
            color="bg-yellow-100"
          />
          <Card
            title="Ibovespa"
            value={cotacao.ibovespa ? `${cotacao.ibovespa.toLocaleString("pt-BR")} pts` : "Indisponível"}
            color="bg-purple-100"
          />
        </div>
      </main>
    </div>
  );
}
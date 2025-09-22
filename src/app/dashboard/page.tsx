export default function Dashboard() {
  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-primary">Meu Dashboard</h1>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="card">
          <h3 className="font-semibold text-gray-600">Receitas</h3>
          <p className="text-2xl font-bold text-green-600">R$ 5.000,00</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-600">Despesas</h3>
          <p className="text-2xl font-bold text-red-600">R$ 3.200,00</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-600">Saldo</h3>
          <p className="text-2xl font-bold text-blue-600">R$ 1.800,00</p>
        </div>
      </section>
    </main>
  );
}

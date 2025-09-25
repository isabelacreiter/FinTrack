export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-100 to-white text-gray-900">
      <section className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold text-[var(--color-primary)]">FinTrack</h1>
        <p className="mt-4 text-lg text-gray-600">
          Sua plataforma inteligente de gestão financeira pessoal.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <a href="/register" className="btn-primary">Criar Conta</a>
          <a href="/login" className="btn-secondary">Entrar</a>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 max-w-6xl pb-20">
        <div className="card">
          <h3 className="text-xl font-semibold">Controle de Gastos</h3>
          <p className="mt-2 text-gray-500">Cadastre despesas e receitas facilmente.</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold">Dashboard Interativo</h3>
          <p className="mt-2 text-gray-500">Veja gráficos e relatórios em tempo real.</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-semibold">Alertas Inteligentes</h3>
          <p className="mt-2 text-gray-500">Receba notificações sobre contas a vencer.</p>
        </div>
      </section>
    </main>
  );
}

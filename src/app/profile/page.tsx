import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Perfil do Usuário</h2>
          <p className="mb-2"><strong>Nome:</strong> Usuário Teste</p>
          <p className="mb-2"><strong>Email:</strong> usuario@email.com</p>
          <p className="mb-6"><strong>CPF:</strong> 000.000.000-00</p>
          <button className="w-full bg-indigo-700 text-white py-3 rounded-lg font-semibold hover:bg-indigo-800">Editar Perfil</button>
        </div>
      </div>
    </div>
  );
}

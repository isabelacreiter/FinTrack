"use client";
import { auth } from "@/lib/firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-primary text-white px-6 py-3 shadow">
      <h1 className="font-bold text-xl">FinTrack</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}

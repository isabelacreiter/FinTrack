"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout realizado com sucesso!");
    } catch {
      toast.error("Erro ao sair.");
    }
  };

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/transactions", label: "Transações" },
    { href: "/profile", label: "Perfil" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur shadow sticky top-0 z-50 border-b">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[var(--color-primary)]">FinTrack</h1>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-[var(--color-primary)] transition ${
                pathname === link.href
                  ? "text-[var(--color-primary)] font-semibold border-b-2 border-[var(--color-primary)] pb-1"
                  : "text-gray-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}

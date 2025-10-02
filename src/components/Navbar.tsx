// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout realizado com sucesso!");
      setMobileMenuOpen(false);
    } catch {
      toast.error("Erro ao sair.");
    }
  };

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/transactions", label: "Transações" },
    { href: "/profile", label: "Perfil" },
  ];

  // Mostrar botões de ação apenas em páginas específicas
  const showActionButtons = ["/dashboard", "/transactions"].includes(pathname);

  return (
    <nav className="bg-white/90 backdrop-blur shadow sticky top-0 z-50 border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/dashboard" className="text-xl font-bold text-[var(--color-primary)]">
            FinTrack
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-[var(--color-primary)] transition ${
                  pathname === link.href
                    ? "text-[var(--color-primary)] font-semibold"
                    : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Botões de ação (só em Dashboard e Transações) */}
            {showActionButtons && (
              <div className="flex gap-2">
                <Link
                  href="/add-income"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                >
                  + Receita
                </Link>
                <Link
                  href="/add-expense"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
                >
                  + Despesa
                </Link>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="bg-[var(--color-secondary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--color-primary)] transition"
            >
              Sair
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg ${
                    pathname === link.href
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Botões mobile (só se estiver em páginas permitidas) */}
              {showActionButtons && (
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <Link
                    href="/add-income"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    + Receita
                  </Link>
                  <Link
                    href="/add-expense"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    + Despesa
                  </Link>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
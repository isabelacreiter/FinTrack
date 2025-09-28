// src/components/Navbar.tsx
"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-bold flex items-center gap-2">
        FinTrack
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/transactions" className="hover:underline">Transações</Link>
          <Link href="/profile" className="hover:underline">Perfil</Link>
          <button
            onClick={handleLogout}
            className="bg-white text-primary px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Sair
          </button>
        </nav>

        {/* Botão Hambúrguer Mobile */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link href="/dashboard" className="hover:underline py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
            <Link href="/transactions" className="hover:underline py-2" onClick={() => setIsOpen(false)}>Transações</Link>
            <Link href="/profile" className="hover:underline py-2" onClick={() => setIsOpen(false)}>Perfil</Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-left w-fit text-white hover:underline py-2"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
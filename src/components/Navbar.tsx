"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-orange-600">
          FinTrack
        </Link>

        <div className="hidden md:flex gap-6">
          <Link href="/dashboard" className="hover:text-orange-600">Dashboard</Link>
          <Link href="/profile" className="hover:text-orange-600">Perfil</Link>
          <Link href="/login" className="hover:text-orange-600">Entrar</Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-orange-600"
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col bg-white border-t p-4 gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Perfil</Link>
          <Link href="/login">Entrar</Link>
        </div>
      )}
    </nav>
  );
}

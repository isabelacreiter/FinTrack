// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logout realizado!");
      router.push("/login");
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
    <nav className="navbar bg-white shadow px-4 py-2 flex justify-between items-center">
      <Link href="/dashboard" className="font-bold text-xl text-[var(--color-primary)]">
        FinTrack
      </Link>
      <div className="flex gap-4 items-center">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-gray-700 hover:text-[var(--color-primary)] font-medium ${
              pathname === link.href ? "underline" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="btn-secondary px-3 py-1 text-sm"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
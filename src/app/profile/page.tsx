"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h2 className="text-3xl font-bold">Bem-vindo ao Dashboard</h2>
      </div>
    </div>
  );
}

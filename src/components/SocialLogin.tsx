"use client";
import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import toast from "react-hot-toast";

export default function SocialLogin() {
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Login com Google realizado!");
    } catch {
      toast.error("Erro ao fazer login com Google.");
    }
  };

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Continuar com Google
      </button>
    </div>
  );
}
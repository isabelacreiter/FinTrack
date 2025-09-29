import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { TransactionsProvider } from "@/context/TransactionsContext"; // 👈 importa o provider

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "FinTrack",
  description: "Gestão financeira pessoal inteligente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        {/* 👇 envolve todo o app no provider */}
        <TransactionsProvider>
          {children}
          <Toaster position="top-right" />
        </TransactionsProvider>
      </body>
    </html>
  );
}

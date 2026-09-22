import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SZ STORE 7 — Tokens Premium",
  description: "Plataforma oficial de tokens premium. Compra segura, entrega imediata.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

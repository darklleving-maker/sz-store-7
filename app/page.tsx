"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao autenticar.");
        return;
      }

      document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`;
      router.push("/vitrine");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-10 text-center">
        <div className="text-6xl font-black tracking-tighter">
          <span className="text-sz7-red">SZ</span>
          <span className="text-white">7</span>
        </div>
        <p className="text-zinc-500 mt-2 text-sm tracking-widest uppercase">
          Store Premium
        </p>
      </div>

      <div className="w-full max-w-md bg-sz7-card border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/50">
        <h1 className="text-xl font-bold mb-6 text-center">
          {mode === "login" ? "Conectar-se" : "Criar conta"}
        </h1>

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
              minLength={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-sz7-red transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
              minLength={4}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-sz7-red transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sz7-red hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors"
          >
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          {mode === "login" ? (
            <>
              Não tem conta?{" "}
              <button onClick={() => setMode("register")} className="text-sz7-red hover:underline font-medium">
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button onClick={() => setMode("login")} className="text-sz7-red hover:underline font-medium">
                Entrar
              </button>
            </>
          )}
        </p>
      </div>

      <div className="flex gap-6 mt-10 text-zinc-600 text-xs items-center">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Compra Protegida
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-sz7-gold" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Conexão Segura
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          Entrega Imediata
        </span>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CARD_LEVELS, CardLevel } from "@/lib/cards-config";

export default function Vitrine() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const cookie = document.cookie;
    if (!cookie.includes("token=")) {
      router.push("/");
      return;
    }
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => router.push("/"));
  }, [router]);

  function handleBuy(level: CardLevel) {
    router.push(`/checkout/${level.id}`);
  }

  function handleLogout() {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/");
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Carregando...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter">
            <span className="text-sz7-red">SZ</span>
            <span className="text-white">7</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">Olá, <strong className="text-white">{user.name}</strong></span>
            <button onClick={() => router.push("/meus-cartoes")} className="text-sm text-sz7-gold hover:underline">
              Meus Tokens
            </button>
            <button onClick={handleLogout} className="text-sm text-zinc-500 hover:text-white transition-colors">
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-black mb-3">
          Escolha seu <span className="text-sz7-red">Token Premium</span>
        </h1>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Tokens de alta compatibilidade para o método de virada de saldo.
          Entrega imediata após confirmação do pagamento.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARD_LEVELS.map((level) => (
            <div
              key={level.id}
              className={`relative bg-sz7-card border rounded-2xl p-6 flex flex-col transition-all hover:scale-[1.02] hover:shadow-xl ${
                level.bestSeller
                  ? "border-sz7-red shadow-lg shadow-red-900/20"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {level.bestSeller && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sz7-red text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  MAIS VENDIDO
                </span>
              )}

              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl font-black"
                style={{ backgroundColor: `${level.color}20`, color: level.color }}
              >
                {level.name[0]}
              </div>

              <h3 className="text-lg font-bold mb-1">{level.name}</h3>
              <p className="text-sm text-zinc-500 mb-4 flex-1">{level.description}</p>

              <div className="text-2xl font-black mb-4">{level.priceLabel}</div>

              <button
                onClick={() => handleBuy(level)}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-colors ${
                  level.bestSeller
                    ? "bg-sz7-red hover:bg-red-700 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
              >
                Comprar agora
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold text-center mb-8 text-zinc-300">
          O que dizem nossos clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: "Carlos M.", text: "Comprei o GOLD e funcionou na hora. Método simples e direto.", stars: 5 },
            { name: "Fernanda R.", text: "O INFINITE é absurdo. Melhor investimento que fiz.", stars: 5 },
            { name: "Lucas A.", text: "Suporte rápido, token chegou em segundos. Recomendo o BUSINESS.", stars: 5 },
          ].map((t, i) => (
            <div key={i} className="bg-sz7-card border border-zinc-800 rounded-xl p-5">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-sz7-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-zinc-400 mb-3">"{t.text}"</p>
              <p className="text-xs text-zinc-600 font-medium">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-800 py-8 text-center text-xs text-zinc-600">
        <p>SZ STORE 7 © 2026 — Todos os direitos reservados</p>
        <p className="mt-1">Pagamentos processados com segurança via GGPIXAPI</p>
      </footer>
    </main>
  );
}

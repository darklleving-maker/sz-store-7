"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface TokenItem {
  id: string;
  level: string;
  price_cents: number;
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  status: "pending" | "paid";
  created_at: string;
}

export default function MeusCartoes() {
  const router = useRouter();
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const cookie = document.cookie;
    if (!cookie.includes("token=")) {
      router.push("/");
      return;
    }

    fetch("/api/cartoes")
      .then((r) => r.json())
      .then((d) => setTokens(d.cards || []))
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [router]);

  function formatCode(num: string): string {
    return num.replace(/(\d{4})/g, "$1 ").trim();
  }

  function copyToken(item: TokenItem) {
    const text = `${item.name}\n${formatCode(item.number)}\n${item.expiry}  ${item.cvv}`;
    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleLogout() {
    document.cookie = "token=; path=/; max-age=0";
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Carregando...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push("/vitrine")} className="text-sm text-zinc-400 hover:text-white">
            ← Vitrine
          </button>
          <div className="text-xl font-black tracking-tighter">
            <span className="text-sz7-red">SZ</span>
            <span className="text-white">7</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-zinc-500 hover:text-white">
            Sair
          </button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black mb-8 text-center">Meus Tokens</h1>

        {tokens.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 mb-4">Você ainda não tem tokens.</p>
            <button
              onClick={() => router.push("/vitrine")}
              className="bg-sz7-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              Ver vitrine
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {tokens.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl p-6 border ${
                  item.status === "paid"
                    ? "bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700"
                    : "bg-zinc-900/50 border-zinc-800 opacity-60"
                }`}
              >
                {item.status === "pending" && (
                  <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-300 text-xs rounded-lg px-3 py-2 mb-4">
                    ⏳ Aguardando confirmação do pagamento...
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-zinc-500 uppercase tracking-wider">{item.level}</p>
                    <p className="text-lg font-mono font-bold tracking-wider mt-1">
                      {formatCode(item.number)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">VALIDADE</p>
                    <p className="font-mono">{item.expiry}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-zinc-500">TITULAR</p>
                    <p className="font-mono text-sm">{item.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">PIN</p>
                    <p className="font-mono text-sm">{item.cvv}</p>
                  </div>
                </div>

                {item.status === "paid" && (
                  <button
                    onClick={() => copyToken(item)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm transition-colors"
                  >
                    {copiedId === item.id ? "✓ Copiado!" : "Copiar dados do token"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

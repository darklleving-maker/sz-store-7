"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCardLevel } from "@/lib/cards-config";

export default function CheckoutPage({ params }: { params: { levelId: string } }) {
  const router = useRouter();
  const level = getCardLevel(params.levelId);

  const [payerName, setPayerName] = useState("");
  const [payerCpf, setPayerCpf] = useState("");
  const [pixCode, setPixCode] = useState("");
  const [pixQr, setPixQr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!level) router.push("/vitrine");
    const cookie = document.cookie;
    if (!cookie.includes("token=")) router.push("/");
  }, [level, router]);

  async function handleGeneratePix(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkout/create-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelId: params.levelId,
          payerName,
          payerDocument: payerCpf.replace(/\D/g, ""),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao gerar cobrança.");
        return;
      }

      setPixCode(data.pixCopyPaste);
      setPixQr(data.qrCodeBase64 || data.qrCode || "");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function copyPix() {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function formatCpf(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})/, "$1.")
      .replace(/^(\d{3})\.(\d{3})/, "$1.$2.")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})/, "$1.$2.$3-");
  }

  if (!level) return null;

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push("/vitrine")} className="text-sm text-zinc-400 hover:text-white">
            ← Voltar à vitrine
          </button>
          <div className="text-xl font-black tracking-tighter">
            <span className="text-sz7-red">SZ</span>
            <span className="text-white">7</span>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black mb-8 text-center">Finalizar Compra</h1>

        <div className="bg-sz7-card border border-zinc-800 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
              style={{ backgroundColor: `${level.color}20`, color: level.color }}
            >
              {level.name[0]}
            </div>
            <div>
              <p className="font-bold">{level.name}</p>
              <p className="text-sm text-zinc-500">{level.description}</p>
            </div>
          </div>
          <p className="text-2xl font-black">{level.priceLabel}</p>
        </div>

        {!pixCode ? (
          <form onSubmit={handleGeneratePix} className="space-y-5 max-w-md mx-auto">
            {error && (
              <div className="bg-red-900/30 border border-red-800 text-red-300 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Nome completo (para o Pix)</label>
              <input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Nome como está no banco"
                required
                minLength={5}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-sz7-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">CPF</label>
              <input
                type="text"
                value={payerCpf}
                onChange={(e) => setPayerCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                required
                minLength={14}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white outline-none focus:border-sz7-red transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sz7-red hover:bg-red-700 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-colors text-lg"
            >
              {loading ? "Gerando cobrança..." : `Gerar Pix — ${level.priceLabel}`}
            </button>

            <p className="text-xs text-zinc-600 text-center">
              Pagamento processado com segurança pela GGPIXAPI.
              O token é liberado imediatamente após a confirmação.
            </p>
          </form>
        ) : (
          <div className="max-w-md mx-auto text-center">
            <div className="bg-green-900/20 border border-green-800 rounded-lg px-4 py-3 mb-6 text-green-300 text-sm">
              ✓ Cobrança gerada! Pague o Pix abaixo para liberar seu token.
            </div>

            {pixQr && (
              <img
                src={`data:image/png;base64,${pixQr}`}
                alt="QR Code Pix"
                className="w-56 h-56 mx-auto mb-6 rounded-xl border border-zinc-700"
              />
            )}

            <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 mb-4 break-all text-sm text-zinc-300 font-mono">
              {pixCode}
            </div>

            <button
              onClick={copyPix}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors mb-4"
            >
              {copied ? "✓ Copiado!" : "Copiar código Pix"}
            </button>

            <button
              onClick={() => router.push("/meus-cartoes")}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Já paguei — ver meus tokens
            </button>

            <p className="text-xs text-zinc-600 mt-4">
              O pagamento é confirmado automaticamente. Seu token aparecerá em "Meus Tokens".
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getCardLevel } from "@/lib/cards-config";
import { createPixCharge } from "@/lib/ggpixapi";
import { generateToken } from "@/lib/token-generator";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { levelId, payerName, payerDocument } = await req.json();

    if (!levelId || !payerName || !payerDocument) {
      return NextResponse.json(
        { error: "levelId, payerName e payerDocument são obrigatórios." },
        { status: 400 }
      );
    }

    const level = getCardLevel(levelId);
    if (!level) {
      return NextResponse.json({ error: "Nível de token inválido." }, { status: 400 });
    }

    // Gera o token de acesso
    const token = generateToken();
    const externalId = `sz7-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const siteUrl = process.env.SITE_URL || "http://localhost:3000";
    const webhookUrl = `${siteUrl}/api/webhooks/pix`;

    // Cria a cobrança Pix
    const pixResponse = await createPixCharge({
      amountCents: level.priceCents,
      description: `SZ STORE 7 — Token ${level.name}`,
      payerName,
      payerDocument,
      externalId,
      webhookUrl,
    });

    // Salva no banco (status: pending até o webhook confirmar)
    const { data: record, error: dbError } = await supabase
      .from("cards")
      .insert({
        user_id: user.sub,
        level: level.id,
        price_cents: level.priceCents,
        number: token.code,
        name: token.holder,
        expiry: token.validUntil,
        cvv: token.pin,
        pix_tx_id: pixResponse.id,
        status: "pending",
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      pixCopyPaste: pixResponse.pixCopyPaste,
      qrCodeBase64: pixResponse.qrCodeBase64 || pixResponse.qrCode || "",
      tokenId: record.id,
    });
  } catch (err: any) {
    console.error("Erro create-pix:", err);
    return NextResponse.json(
      { error: err.message || "Erro ao criar cobrança." },
      { status: 500 }
    );
  }
}

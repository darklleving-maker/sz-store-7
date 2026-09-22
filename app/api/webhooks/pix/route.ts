import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Webhook PIX recebido:", JSON.stringify(body, null, 2));

    const txId = body.id || body.transactionId || body.externalId || "";
    const status = body.status || "";

    const isPaid = ["paid", "confirmed", "success", "PAID", "CONFIRMED", "SUCCESS"].includes(status);

    if (!txId) {
      console.log("Webhook sem txId, ignorando.");
      return NextResponse.json({ ok: true });
    }

    if (isPaid) {
      const { error } = await supabase
        .from("cards")
        .update({ status: "paid" })
        .eq("pix_tx_id", txId);

      if (error) {
        console.error("Erro ao marcar token como pago:", error);
      } else {
        console.log(`Token ${txId} marcado como PAGO.`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Erro no webhook:", err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

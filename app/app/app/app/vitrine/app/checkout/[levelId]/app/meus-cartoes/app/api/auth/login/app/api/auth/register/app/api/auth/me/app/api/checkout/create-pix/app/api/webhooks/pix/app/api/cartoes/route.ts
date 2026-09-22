import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { data: cards, error } = await supabase
      .from("cards")
      .select("*")
      .eq("user_id", user.sub)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ cards: cards || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao buscar tokens." }, { status: 500 });
  }
}

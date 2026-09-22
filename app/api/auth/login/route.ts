import { NextRequest, NextResponse } from "next/server";
import { login, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: "Nome e senha são obrigatórios." }, { status: 400 });
    }

    const user = await login(name, password);
    const token = signToken(user.id, user.name);

    return NextResponse.json({ token, user: { id: user.id, name: user.name } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro no login." }, { status: 401 });
  }
}

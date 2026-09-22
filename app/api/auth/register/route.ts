import { NextRequest, NextResponse } from "next/server";
import { register, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: "Nome e senha são obrigatórios." }, { status: 400 });
    }

    if (name.length < 2) {
      return NextResponse.json({ error: "Nome muito curto." }, { status: 400 });
    }

    if (password.length < 4) {
      return NextResponse.json({ error: "Senha muito curta (mínimo 4 caracteres)." }, { status: 400 });
    }

    const user = await register(name, password);
    const token = signToken(user.id, user.name);

    return NextResponse.json({ token, user: { id: user.id, name: user.name } }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro no cadastro." }, { status: 400 });
  }
}

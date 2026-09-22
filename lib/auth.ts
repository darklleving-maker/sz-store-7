import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase, User } from "./supabase";

const JWT_SECRET = process.env.JWT_SECRET || "sz7_secret_dev";

export async function register(name: string, password: string): Promise<User> {
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .ilike("name", name)
    .single();

  if (existing) {
    throw new Error("Usuário já existe. Faça login.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert({ name, password_hash: passwordHash })
    .select()
    .single();

  if (error) throw error;
  return data as User;
}

export async function login(name: string, password: string): Promise<User> {
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .ilike("name", name)
    .maybeSingle();

  if (!user) throw new Error("Usuário não encontrado.");

  const ok = await bcrypt.compare(password, (user as User).password_hash);
  if (!ok) throw new Error("Senha incorreta.");

  return user as User;
}

export function signToken(userId: string, name: string): string {
  return jwt.sign({ sub: userId, name }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { sub: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; name: string };
  } catch {
    return null;
  }
}

export function getUserFromRequest(req: Request): { sub: string; name: string } | null {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)token=([^;]+)/);
  if (!match) return null;
  return verifyToken(decodeURIComponent(match[1]));
}

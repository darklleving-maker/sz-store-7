import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  name: string;
  password_hash: string;
  created_at: string;
}

export interface Card {
  id: string;
  user_id: string;
  level: string;
  price_cents: number;
  number: string;
  name: string;
  expiry: string;
  cvv: string;
  pix_tx_id: string;
  status: "pending" | "paid";
  created_at: string;
}

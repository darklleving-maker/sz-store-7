const GGPIXAPI_URL = process.env.GGPIXAPI_URL || "https://ggpixapi.com/api/v1";
const GGPIXAPI_KEY = process.env.GGPIXAPI_KEY || "";

export interface PixInResponse {
  id: string;
  status: string;
  pixCopyPaste: string;
  qrCodeBase64?: string;
  qrCode?: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export async function createPixCharge(params: {
  amountCents: number;
  description: string;
  payerName: string;
  payerDocument: string;
  externalId: string;
  webhookUrl?: string;
}): Promise<PixInResponse> {
  const res = await fetch(`${GGPIXAPI_URL}/pix/in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": GGPIXAPI_KEY,
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GGPIXAPI erro ${res.status}: ${text}`);
  }

  return (await res.json()) as PixInResponse;
}

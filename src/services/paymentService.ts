export type PaymentStatus = "waiting" | "paid" | "failed";

export type PixCharge = {
  paymentId: string;
  amount: number;
  qrCodeUrl?: string;
  pixCopyPaste: string;
  status: PaymentStatus;
};

export type CheckoutCustomer = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
};

type CreatePixInput = {
  amount: number;
  customer?: CheckoutCustomer;
};

function mapProviderStatus(status?: string): PaymentStatus {
  if (!status) return "waiting";
  if (["approved", "paid", "confirmed", "completed"].includes(status)) return "paid";
  if (["refused", "failed", "cancelled", "chargeback", "refunded", "expired"].includes(status)) return "failed";
  return "waiting";
}

export async function createPixCharge({ amount, customer }: CreatePixInput): Promise<PixCharge> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Lovable Cloud não configurado no frontend.");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/anubispay-pix`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({
      amountInCents: Math.round(amount * 100),
      customer,
      externalRef: `vakinha_${Date.now()}`,
    }),
  });

  const raw = await response.json();

  if (!response.ok) {
    throw new Error(raw?.error ?? "Erro ao gerar cobrança Pix");
  }

  const pixCode = (raw?.pixCopyPaste ?? raw?.pix?.qrcode ?? raw?.pix?.copyPaste ?? "") as string;
  if (!pixCode) {
    throw new Error("A API não retornou o código Pix.");
  }

  const qrCodeUrl =
    (raw?.qrCodeUrl ?? raw?.pixQrCodeUrl ?? raw?.pix?.receiptUrl ?? raw?.pix?.qrcodeImage ?? undefined) as
      | string
      | undefined;

  return {
    paymentId: String(raw.paymentId ?? raw?.id ?? ""),
    amount,
    qrCodeUrl,
    pixCopyPaste: pixCode,
    status: mapProviderStatus(raw.status),
  };
}

export async function getPaymentStatus(_paymentId: string): Promise<{ status: PaymentStatus }> {
  return { status: "waiting" };
}

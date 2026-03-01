export type PaymentStatus = "waiting" | "paid" | "failed";

export type PixCharge = {
  paymentId: string;
  amount: number;
  qrCodeUrl?: string;
  pixCopyPaste: string;
  status: PaymentStatus;
};

export async function createPixCharge(amount: number): Promise<PixCharge> {
  // Stub (API-ready): substituir por REST depois.
  const paymentId = `pay_${Math.random().toString(16).slice(2)}`;

  // Payload estático placeholder (copia e cola)
  const pixCopyPaste =
    "00020126580014BR.GOV.BCB.PIX0136SUA-CHAVE-PIX-AQUI-PLACEHOLDER520400005303986540510.005802BR5913CAMPANHA DEMO6009SAO PAULO62140510PAYLOADDEMO6304ABCD";

  return {
    paymentId,
    amount,
    qrCodeUrl: undefined,
    pixCopyPaste,
    status: "waiting",
  };
}

export async function getPaymentStatus(_paymentId: string): Promise<{ status: PaymentStatus }> {
  // Stub (API-ready): substituir por polling/webhook depois.
  return { status: "waiting" };
}

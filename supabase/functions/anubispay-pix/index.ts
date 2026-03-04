const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type CreatePixPayload = {
  amountInCents: number;
  externalRef?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const publicKey = Deno.env.get("ANUBISPAY_PUBLIC_KEY");
    const secretKey = Deno.env.get("ANUBISPAY_SECRET_KEY");

    if (!publicKey || !secretKey) {
      return new Response(JSON.stringify({ error: "Secrets da AnubisPay não configurados." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as CreatePixPayload;

    if (!body.amountInCents || body.amountInCents <= 0) {
      return new Response(JSON.stringify({ error: "Informe um valor maior que R$ 0,00." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const auth = `Basic ${btoa(`${publicKey}:${secretKey}`)}`;

    const customer = body.customer
      ? {
          name: body.customer.name,
          email: body.customer.email,
          phone: body.customer.phone,
          document: {
            type: "cpf",
            number: body.customer.cpf,
          },
        }
      : {
          name: "Doador Anônimo",
          email: "anonimo@vakinha.local",
          phone: "11999999999",
          document: {
            type: "cpf",
            number: "00000000000",
          },
        };

    const payload = {
      amount: body.amountInCents,
      paymentMethod: "pix",
      installments: 1,
      externalRef: body.externalRef ?? `vakinha_${Date.now()}`,
      customer,
      items: [
        {
          title: "Doação campanha",
          quantity: 1,
          unitPrice: body.amountInCents,
          tangible: false,
          externalRef: "donation_001",
        },
      ],
    };

    const providerResponse = await fetch("https://api.anubispay.com.br/v1/transactions", {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const providerRawText = await providerResponse.text();
    const providerData = providerRawText ? JSON.parse(providerRawText) : {};

    if (!providerResponse.ok) {
      return new Response(
        JSON.stringify({
          error: providerData?.message ?? providerData?.error ?? "Erro da AnubisPay ao criar cobrança.",
          providerStatus: providerResponse.status,
          providerData,
        }),
        {
          status: providerResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const transaction = providerData?.data ?? providerData;
    const pix = transaction?.pix ?? {};

    const pixCopyPaste = pix?.qrcode ?? pix?.copyPaste ?? pix?.payload ?? null;
    const qrCodeUrl = pix?.receiptUrl ?? pix?.qrcodeImage ?? pix?.qrCodeUrl ?? null;

    return new Response(
      JSON.stringify({
        paymentId: transaction?.id,
        status: transaction?.status,
        pixCopyPaste,
        qrCodeUrl,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erro interno",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

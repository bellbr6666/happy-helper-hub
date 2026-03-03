import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { PixQrCode } from "@/components/payment/PixQrCode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPixCharge, type CheckoutCustomer, type PixCharge } from "@/services/paymentService";

const CURRENCY = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const PRESETS = [30, 100, 200] as const;

type CheckoutView = "form" | "loading" | "pix" | "success" | "error";

const Checkout = () => {
  const [view, setView] = useState<CheckoutView>("form");
  const [selectedPreset, setSelectedPreset] = useState<number>(30);
  const [amountText, setAmountText] = useState("30,00");
  const [charge, setCharge] = useState<PixCharge | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copiar código Pix");
  const [errorMessage, setErrorMessage] = useState("");

  const [customer, setCustomer] = useState<CheckoutCustomer>({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });

  const amount = useMemo(() => {
    const normalized = amountText.replace(/\./g, "").replace(",", ".").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
  }, [amountText]);

  function onPresetClick(value: number) {
    setSelectedPreset(value);
    setAmountText(value.toFixed(2).replace(".", ","));
  }

  function buildCustomerOrUndefined() {
    const hasSomeData = customer.name || customer.email || customer.phone || customer.cpf;
    if (!hasSomeData) return undefined;

    return {
      name: customer.name.trim() || "Doador",
      email: customer.email.trim() || "doador@email.com",
      phone: customer.phone.replace(/\D/g, "") || "11999999999",
      cpf: customer.cpf.replace(/\D/g, "") || "00000000000",
    };
  }

  async function handleGeneratePix() {
    if (amount < 20) {
      setErrorMessage("Valor mínimo da doação é R$ 20,00.");
      return;
    }

    setErrorMessage("");
    setView("loading");

    try {
      const created = await createPixCharge({
        amount,
        customer: buildCustomerOrUndefined(),
      });

      setCharge(created);
      setView("pix");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao gerar Pix");
      setView("error");
    }
  }

  async function handleCopy() {
    if (!charge?.pixCopyPaste) return;
    await navigator.clipboard.writeText(charge.pixCopyPaste);
    setCopyLabel("Copiado!");
    window.setTimeout(() => setCopyLabel("Copiar código Pix"), 1200);
  }

  return (
    <main className="min-h-screen bg-background py-6">
      <div className="mx-auto w-full max-w-[420px] px-4">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Checkout da doação</h1>
          <Link to="/" className="text-sm text-primary underline-offset-2 hover:underline">
            Voltar
          </Link>
        </header>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">🙏 Sua ajuda salva vidas</CardTitle>
            <p className="text-sm text-muted-foreground">ID: 4452341</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <section className="space-y-2">
              <Label htmlFor="amount">Valor da contribuição</Label>
              <div className="flex items-center">
                <span className="rounded-l-md border border-r-0 bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">R$</span>
                <Input
                  id="amount"
                  inputMode="decimal"
                  value={amountText}
                  onChange={(e) => setAmountText(e.target.value)}
                  className="rounded-l-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={selectedPreset === value ? "default" : "outline"}
                    onClick={() => onPresetClick(value)}
                  >
                    {CURRENCY.format(value)}
                  </Button>
                ))}
              </div>
            </section>

            <section className="space-y-3 rounded-lg border bg-muted/20 p-3">
              <p className="text-sm font-medium">Identificação mínima (opcional para recibo)</p>
              <div className="grid gap-3">
                <Input placeholder="Nome" value={customer.name} onChange={(e) => setCustomer((s) => ({ ...s, name: e.target.value }))} />
                <Input placeholder="E-mail" type="email" value={customer.email} onChange={(e) => setCustomer((s) => ({ ...s, email: e.target.value }))} />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Telefone" value={customer.phone} onChange={(e) => setCustomer((s) => ({ ...s, phone: e.target.value }))} />
                  <Input placeholder="CPF" value={customer.cpf} onChange={(e) => setCustomer((s) => ({ ...s, cpf: e.target.value }))} />
                </div>
              </div>
            </section>

            <section className="rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Contribuição</span>
                <span>{CURRENCY.format(amount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>{CURRENCY.format(amount)}</span>
              </div>
            </section>

            {errorMessage ? <p className="text-sm text-error">{errorMessage}</p> : null}

            {view === "loading" ? (
              <Button className="w-full" size="lg" disabled>
                Gerando Pix...
              </Button>
            ) : (
              <Button className="w-full" size="lg" onClick={handleGeneratePix}>
                Gerar Pix
              </Button>
            )}
          </CardContent>
        </Card>

        {view === "pix" && charge && (
          <Card className="mt-4 border-warning/30">
            <CardHeader>
              <CardTitle className="text-base">Aguardando pagamento Pix</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid place-items-center rounded-lg border bg-muted/20 p-4">
                <PixQrCode pixCode={charge.pixCopyPaste} qrCodeUrl={charge.qrCodeUrl} className="h-52 w-52 rounded-md" />
              </div>

              <div className="rounded-lg border bg-background p-3">
                <p className="break-all text-xs text-muted-foreground">{charge.pixCopyPaste}</p>
              </div>

              <Button type="button" variant="secondary" className="w-full" onClick={handleCopy}>
                {copyLabel}
              </Button>

              <Button type="button" className="w-full" onClick={() => setView("success")}>
                Já paguei
              </Button>
            </CardContent>
          </Card>
        )}

        {view === "success" && (
          <Card className="mt-4 border-success/30">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold text-success">Pagamento em análise/confirmado.</p>
              <p className="mt-1 text-sm text-muted-foreground">Obrigado por ajudar esta campanha.</p>
            </CardContent>
          </Card>
        )}

        {view === "error" && (
          <Card className="mt-4 border-error/30">
            <CardContent className="pt-6">
              <p className="text-sm font-semibold text-error">Não foi possível gerar o Pix.</p>
              <Button className="mt-3 w-full" variant="outline" onClick={() => setView("form")}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Checkout;

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { createPixCharge, type PixCharge } from "@/services/paymentService";

type PaymentView = "choose" | "loading" | "waiting" | "success" | "error";

const QUICK_AMOUNTS = [25, 50, 100] as const;

const CURRENCY = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

export function PaymentModal({
  open,
  onOpenChange,
  defaultAmount = 50,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAmount?: number;
}) {
  const [view, setView] = useState<PaymentView>("choose");
  const [amount, setAmount] = useState<number>(defaultAmount);
  const [customAmount, setCustomAmount] = useState<string>(String(defaultAmount));
  const [charge, setCharge] = useState<PixCharge | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const isDev = import.meta.env.DEV;

  useEffect(() => {
    if (!open) {
      setView("choose");
      setCharge(null);
      setCopyState("idle");
      setAmount(defaultAmount);
      setCustomAmount(String(defaultAmount));
    }
  }, [open, defaultAmount]);

  const parsedCustom = useMemo(() => {
    const v = Number(customAmount.replace(",", "."));
    return Number.isFinite(v) ? v : NaN;
  }, [customAmount]);

  const effectiveAmount = useMemo(() => {
    if (Number.isFinite(parsedCustom) && parsedCustom > 0) return parsedCustom;
    return amount;
  }, [amount, parsedCustom]);

  async function handleGenerate() {
    setView("loading");
    setCopyState("idle");

    // simula loading curto
    await new Promise((r) => setTimeout(r, 650));

    try {
      const created = await createPixCharge(effectiveAmount);
      setCharge(created);
      setView("waiting");
    } catch {
      setView("error");
    }
  }

  async function handleCopy() {
    if (!charge?.pixCopyPaste) return;
    await navigator.clipboard.writeText(charge.pixCopyPaste);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1200);
  }

  const statusTone = useMemo(() => {
    if (view === "success") return "success";
    if (view === "waiting") return "warning";
    if (view === "error") return "error";
    return "muted";
  }, [view]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Contribuir via Pix</DialogTitle>
          <DialogDescription>
            Escolha um valor, gere o Pix e pague com QR Code ou “copia e cola”.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Valores rápidos */}
          <section className="grid gap-2">
            <p className="text-sm font-medium">Valores rápidos</p>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_AMOUNTS.map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={amount === v ? "default" : "outline"}
                  className="w-full"
                  onClick={() => {
                    setAmount(v);
                    setCustomAmount(String(v));
                  }}
                >
                  {CURRENCY.format(v)}
                </Button>
              ))}
              <Button
                type="button"
                variant={amount === 0 ? "default" : "outline"}
                className="w-full"
                onClick={() => {
                  setAmount(0);
                  setCustomAmount("");
                }}
              >
                Outro
              </Button>
            </div>
          </section>

          {/* Valor custom */}
          <section className="grid gap-2">
            <Label htmlFor="valor">Valor</Label>
            <Input
              id="valor"
              inputMode="decimal"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Ex: 50"
            />
            <p className="text-xs text-muted-foreground">Você vai gerar um Pix no valor de {CURRENCY.format(effectiveAmount)}.</p>
          </section>

          {/* Área dinâmica (mutuamente exclusiva por enum) */}
          <section>
            {view === "choose" && (
              <div className="grid gap-3">
                <Button size="lg" className="w-full" onClick={handleGenerate}>
                  Gerar Pix
                </Button>
                <p className="text-xs text-muted-foreground">
                  Método Pix (padrão nesta versão). Ao gerar, exibiremos o QR e o “copia e cola”.
                </p>
              </div>
            )}

            {view === "loading" && (
              <Card className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-[180px] w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            )}

            {view === "waiting" && charge && (
              <div className="grid gap-3">
                <div
                  className={cn(
                    "rounded-xl border bg-card p-4 shadow-sm",
                    statusTone === "warning" && "border-warning/30",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">Aguardando pagamento</p>
                    <span className="text-xs text-muted-foreground">Pix</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Pague com QR Code no seu app do banco.</p>

                  <div className="mt-3 overflow-hidden rounded-lg border bg-background">
                    <div className="grid place-items-center p-4">
                      {/* Placeholder do QR */}
                      <div className="grid h-[180px] w-[180px] place-items-center rounded-md bg-muted/40">
                        <span className="text-xs text-muted-foreground">QR Code</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2">
                    <p className="text-sm font-medium">Pix copia e cola</p>
                    <div className="rounded-lg border bg-background p-3">
                      <p className="break-all text-xs text-muted-foreground">{charge.pixCopyPaste}</p>
                    </div>
                    <Button type="button" variant="secondary" className="w-full" onClick={handleCopy}>
                      {copyState === "copied" ? "Copiado!" : "Copiar"}
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Depois do pagamento, o status pode levar alguns instantes para atualizar (nesta versão, é simulado).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {view === "success" && (
              <Card className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="grid gap-2">
                  <p className="text-sm font-semibold text-success">Pagamento confirmado</p>
                  <p className="text-sm">Obrigado por ajudar!</p>
                  <Button className="mt-2 w-full" onClick={() => onOpenChange(false)}>
                    Fechar
                  </Button>
                </div>
              </Card>
            )}

            {view === "error" && (
              <Card className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="grid gap-2">
                  <p className="text-sm font-semibold text-error">Não foi possível gerar o Pix</p>
                  <p className="text-sm text-muted-foreground">Tente novamente em instantes.</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setView("choose")}>
                      Voltar
                    </Button>
                    <Button onClick={handleGenerate}>Tentar novamente</Button>
                  </div>
                </div>
              </Card>
            )}
          </section>

          {/* Dev controls */}
          {isDev && (
            <section className="rounded-xl border bg-muted/20 p-3">
              <p className="text-xs font-semibold text-muted-foreground">DEV: simular estados</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setView("choose")}>
                  choose
                </Button>
                <Button size="sm" variant="outline" onClick={() => setView("loading")}>
                  loading
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setCharge(
                      charge ?? {
                        paymentId: "dev",
                        amount: effectiveAmount,
                        pixCopyPaste:
                          "000201...PAYLOAD...PLACEHOLDER",
                        status: "waiting",
                      },
                    );
                    setView("waiting");
                  }}
                >
                  waiting
                </Button>
                <Button size="sm" variant="outline" onClick={() => setView("success")}>
                  success
                </Button>
                <Button size="sm" variant="outline" onClick={() => setView("error")}>
                  error
                </Button>
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

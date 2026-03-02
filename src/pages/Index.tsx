import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CURRENCY = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const Index = () => {
  const navigate = useNavigate();

  // Dados estáticos (conforme solicitado)
  const campaign = useMemo(
    () => ({
      title: "Ajude a campanha agora",
      subtitle: "Sua doação é segura e fará a diferença.",
      raised: 1041605.6,
      goal: 200000,
      supporters: 18452,
      location: "Brasil",
      organizer: "Organização da campanha",
      bannerSrc: "/placeholder.svg",
      bannerAlt: "Banner da campanha",
    }),
    [],
  );

  const progressValue = useMemo(() => {
    const ratio = campaign.raised / campaign.goal;
    return Math.round(Math.min(ratio, 1) * 100);
  }, [campaign.goal, campaign.raised]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <span className="text-sm font-semibold">V</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Vakinha</p>
              <p className="text-xs text-muted-foreground">Campanhas</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            <a className="hover:text-foreground" href="#sobre">
              Sobre
            </a>
            <a className="hover:text-foreground" href="#novidades">
              Novidades
            </a>
            <a className="hover:text-foreground" href="#quem-ajudou">
              Quem ajudou
            </a>
          </nav>
        </div>
      </header>

      <main className="pb-24 lg:pb-10">
        {/* Canvas mobile-first (fidelidade do print) */}
        <div className="mx-auto w-full max-w-[420px] px-4 pt-4 lg:max-w-[1120px] lg:px-6 lg:pt-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
            {/* Coluna principal */}
            <div className="space-y-4">
              <section aria-label="Hero" className="space-y-3">
                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                  <img
                    src={campaign.bannerSrc}
                    alt={campaign.bannerAlt}
                    loading="eager"
                    className="h-[200px] w-full object-cover lg:h-[260px]"
                  />
                </div>

                <div className="space-y-2">
                  <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight lg:text-3xl">
                    {campaign.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">{campaign.subtitle}</p>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {campaign.location}
                    </Badge>
                    <Badge variant="secondary" className="rounded-full">
                      {campaign.organizer}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-xl border bg-card p-3 shadow-sm">
                  <p className="text-sm font-medium">
                    ✅ Vakinha verificada e confirmada. <span className="text-muted-foreground">Sua doação é segura e fará a diferença!</span>
                  </p>
                </div>
              </section>

              <section aria-label="Tabs" className="rounded-xl border bg-card p-3 shadow-sm">
                <Tabs defaultValue="sobre">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sobre" id="sobre">
                      Sobre
                    </TabsTrigger>
                    <TabsTrigger value="novidades" id="novidades">
                      Novidades
                    </TabsTrigger>
                    <TabsTrigger value="quem" id="quem-ajudou">
                      Quem ajudou
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="sobre" className="mt-4">
                    <article className="campaign-prose">
                      <h2>Sobre a campanha</h2>
                      <p>
                        Este conteúdo estático foi preparado para ficar tipografado (sem markdown cru) e pode ser substituído pelo texto final da campanha a qualquer momento.
                      </p>
                      <h3>Como sua doação ajuda</h3>
                      <ul>
                        <li>Atendimento imediato e suporte emergencial</li>
                        <li>Transporte e insumos essenciais</li>
                        <li>Acompanhamento e reabilitação</li>
                      </ul>
                      <p>
                        Transparência: vamos publicar atualizações na aba <strong>Novidades</strong>.
                      </p>
                    </article>
                  </TabsContent>

                  <TabsContent value="novidades" className="mt-4">
                    <div className="space-y-3">
                      <div className="rounded-lg border bg-background p-3">
                        <p className="text-sm font-semibold">ATUALIZAÇÃO (24/02/2026, 15:00)</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Texto completo da atualização entra aqui (estático nesta fase) — mantendo fidelidade visual acima de dados reais.
                        </p>
                      </div>
                      <div className="rounded-lg border bg-background p-3">
                        <p className="text-sm font-semibold">Atualização anterior</p>
                        <p className="mt-1 text-sm text-muted-foreground">Placeholder de histórico.</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quem" className="mt-4">
                    <div className="space-y-3">
                      {[
                        { name: "Apoiador(a) anônimo(a)", amount: 50 },
                        { name: "Maria S.", amount: 25 },
                        { name: "João P.", amount: 100 },
                      ].map((d, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border bg-background p-3">
                          <div>
                            <p className="text-sm font-medium">{d.name}</p>
                            <p className="text-xs text-muted-foreground">Doação confirmada</p>
                          </div>
                          <p className="text-sm font-semibold">{CURRENCY.format(d.amount)}</p>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground">Lista estática placeholder (fidelidade visual &gt; dados reais nesta fase).</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>

              <section aria-label="Rodapé" className="pt-2">
                <footer className="rounded-xl border bg-card p-4 text-sm text-muted-foreground shadow-sm">
                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                    <p>© {new Date().getFullYear()} Vakinha — Página de campanha (demo)</p>
                    <div className="flex flex-wrap gap-4">
                      <a className="hover:text-foreground" href="#">
                        Termos
                      </a>
                      <a className="hover:text-foreground" href="#">
                        Privacidade
                      </a>
                      <a className="hover:text-foreground" href="#">
                        Contato
                      </a>
                    </div>
                  </div>
                </footer>
              </section>
            </div>

            {/* Coluna lateral (card de arrecadação) */}
            <aside className="lg:sticky lg:top-6">
              <Card className="overflow-hidden rounded-xl">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-xl">Arrecadação</CardTitle>
                  <div className="rounded-lg bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Arrecadado</p>
                    <p className="text-2xl font-semibold tracking-tight">{CURRENCY.format(campaign.raised)}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-muted-foreground">Meta</p>
                      <p className="font-medium">{CURRENCY.format(campaign.goal)}</p>
                    </div>
                    <Progress value={progressValue} className="h-3" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <p>{progressValue}%</p>
                      <p>{campaign.supporters.toLocaleString("pt-BR")} apoiadores</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
                    Quero Ajudar
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Ao clicar em “Quero Ajudar”, você verá as opções de Pix (QR Code + copia e cola).
                  </p>
                </CardContent>

                <CardFooter className="flex-col items-start gap-2">
                  <div className="w-full rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Selo</p>
                    <p className="text-sm font-medium">Campanha verificada</p>
                  </div>
                </CardFooter>
              </Card>
            </aside>
          </div>
        </div>

        {/* Sticky CTA (mobile only) */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 lg:hidden">
          <div className="mx-auto flex w-full max-w-[420px] items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted-foreground">{CURRENCY.format(campaign.raised)} arrecadados</p>
              <p className="text-sm font-semibold">Ajude agora</p>
            </div>
            <Button size="lg" className="shrink-0" onClick={() => navigate("/checkout")}>
              Quero Ajudar
            </Button>
          </div>
        </div>

        
      </main>
    </div>
  );
};

export default Index;

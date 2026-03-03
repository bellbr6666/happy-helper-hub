import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import juizImage from "@/assets/juiz.png";
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

  const campaign = useMemo(
    () => ({
      title: "SOS Enchentes Juiz de Fora e Ubá",
      subtitle: "Doe com rapidez, segurança e transparência para apoiar famílias afetadas.",
      raised: 1041605.6,
      goal: 2000000,
      supporters: 18452,
      location: "Juiz de Fora e Ubá, MG",
      organizer: "Instituto Vakinha",
      bannerSrc: juizImage,
      bannerAlt: "Campanha SOS Enchentes Juiz de Fora e Ubá",
    }),
    [],
  );

  const progressValue = useMemo(() => {
    const ratio = campaign.raised / campaign.goal;
    return Math.round(Math.min(ratio, 1) * 100);
  }, [campaign.goal, campaign.raised]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
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
          <Button variant="secondary" size="sm" onClick={() => navigate("/checkout")}>
            Quero Ajudar
          </Button>
        </div>
      </header>

      <main className="pb-28 lg:pb-10">
        <div className="mx-auto w-full max-w-[420px] px-4 pt-4 lg:max-w-[1120px] lg:px-6 lg:pt-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
            <section aria-label="Conteúdo da campanha" className="space-y-4 lg:order-1">
              <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <img src={campaign.bannerSrc} alt={campaign.bannerAlt} loading="eager" className="h-[220px] w-full object-cover lg:h-[320px]" />
              </section>

              <section className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
                <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight">{campaign.title}</h1>
                <p className="text-sm text-muted-foreground">{campaign.subtitle}</p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {campaign.location}
                  </Badge>
                  <Badge variant="secondary" className="rounded-full">
                    {campaign.organizer}
                  </Badge>
                  <Badge className="rounded-full">Campanha verificada</Badge>
                </div>
              </section>

              <section className="rounded-xl border bg-card p-4 shadow-sm">
                <p className="text-sm font-medium">
                  ✅ Doação protegida por pagamento Pix com confirmação. <span className="text-muted-foreground">Ambiente seguro e validado.</span>
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
                  <div className="rounded-md bg-muted/40 px-2 py-2">Verificada</div>
                  <div className="rounded-md bg-muted/40 px-2 py-2">Sem taxas ocultas</div>
                  <div className="rounded-md bg-muted/40 px-2 py-2">Transparente</div>
                </div>
              </section>

              <section className="rounded-xl border bg-card p-3 shadow-sm">
                <Tabs defaultValue="sobre">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sobre">Sobre</TabsTrigger>
                    <TabsTrigger value="novidades">Novidades</TabsTrigger>
                    <TabsTrigger value="quem">Quem ajudou</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sobre" className="mt-4">
                    <article className="campaign-prose">
                      <h2>Sobre a campanha</h2>
                      <p>
                        Juiz de Fora e Ubá enfrentam impacto severo das chuvas, com famílias desalojadas e regiões isoladas.
                        Esta campanha arrecada recursos para resposta emergencial e apoio à reconstrução.
                      </p>
                      <h3>Como sua doação vira ajuda</h3>
                      <ul>
                        <li>Água potável, higiene e limpeza</li>
                        <li>Cestas básicas e refeições prontas</li>
                        <li>Cobertores, colchões e apoio logístico</li>
                      </ul>
                      <p>
                        Atualizações frequentes serão publicadas na aba <strong>Novidades</strong>.
                      </p>
                    </article>
                  </TabsContent>

                  <TabsContent value="novidades" className="mt-4">
                    <div className="space-y-3">
                      <div className="rounded-lg border bg-background p-3">
                        <p className="text-sm font-semibold">Atualização (24/02/2026, 15:00)</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Equipes locais iniciaram distribuição de kits de emergência em áreas prioritárias.
                        </p>
                      </div>
                      <div className="rounded-lg border bg-background p-3">
                        <p className="text-sm font-semibold">Atualização anterior</p>
                        <p className="mt-1 text-sm text-muted-foreground">Mapeamento das famílias e logística de entrega em andamento.</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quem" className="mt-4">
                    <div className="space-y-3">
                      {[
                        { name: "Apoiador(a) anônimo(a)", amount: 50 },
                        { name: "Maria S.", amount: 25 },
                        { name: "João P.", amount: 100 },
                      ].map((donor, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border bg-background p-3">
                          <div>
                            <p className="text-sm font-medium">{donor.name}</p>
                            <p className="text-xs text-muted-foreground">Doação confirmada</p>
                          </div>
                          <p className="text-sm font-semibold">{CURRENCY.format(donor.amount)}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </section>
            </section>

            <aside className="order-first lg:order-2 lg:sticky lg:top-6">
              <Card className="overflow-hidden rounded-xl">
                <CardHeader className="space-y-3">
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
                      <p>{progressValue}% da meta</p>
                      <p>{campaign.supporters.toLocaleString("pt-BR")} apoiadores</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <Button className="w-full" size="lg" onClick={() => navigate("/checkout")}>
                    Quero Ajudar
                  </Button>
                  <p className="text-xs text-muted-foreground">Pagamento via Pix com QR Code e código copia e cola.</p>
                </CardContent>

                <CardFooter className="flex-col items-start gap-2">
                  <div className="w-full rounded-lg border bg-background p-3">
                    <p className="text-xs text-muted-foreground">Selos de confiança</p>
                    <p className="text-sm font-medium">Campanha verificada e monitorada</p>
                  </div>
                </CardFooter>
              </Card>
            </aside>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
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

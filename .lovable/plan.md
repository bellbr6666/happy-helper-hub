
1) Referência visual (print → layout)
- Importar os 2 prints enviados como referência direta (hero/banner e espaçamentos)
- Ajustar o layout para mobile-first com “canvas” de leitura: max-w-[420px] mx-auto no mobile; liberar 2 colunas só ≥1024px

2) Página única da campanha (rota “/”)
- Substituir totalmente `src/pages/Index.tsx` por uma landing de campanha fiel ao Vakinha
- Estrutura: Header simples → Hero/banner + título + selos → Card de arrecadação → Tabs (Sobre/Novidades/Quem ajudou) → Rodapé

3) Design tokens (HSL) + utilitários de estilo
- Ajustar `src/index.css` para paleta verde Vakinha + cinzas claros
- Criar tokens adicionais para o modal: `--success`, `--warning`, `--error`
- Garantir tipografia (tamanhos/line-height) confortável em 360–430px e sombras/bordas suaves em cards

4) Hero + selo de confiança (fidelidade máxima)
- Usar o print como banner do topo (imagem acima do título, como no original)
- Renderizar o selo: “✅ Vakinha verificada e confirmada. Sua doação é segura e fará a diferença!” com peso visual real (badge/card)

5) Card de arrecadação (conversão)
- Mostrar: valor arrecadado (estático), meta (R$ 200.000,00), apoiadores (estático)
- Barra de progresso emocional usando `Progress` com clamp: `Math.min(arrecadado/meta, 1)` (não exceder 100%)
- CTA principal “Quero Ajudar” (abre modal)
- CTAs secundários onde fizer sentido (ex: dentro de seções), apontando para o mesmo modal

6) Tabs (ordem idêntica ao site)
- Tabs: “Sobre”, “Novidades”, “Quem ajudou” usando shadcn `Tabs`
- “Sobre”: renderização tipografada (HTML estático) do texto fornecido (sem markdown cru)
- “Novidades”: primeiro item com “ATUALIZAÇÃO (24/02/2026, 15:00)” e texto completo
- “Quem ajudou”: lista estática placeholder (fidelidade visual > dados reais nesta fase)

7) Sticky CTA (mobile absoluto)
- Criar barra fixa no rodapé apenas no mobile com:
  - Botão grande “Quero Ajudar”
  - Mini-resumo opcional e discreto: “R$ 1,04M arrecadados” (sem poluir)
- Garantir padding inferior no conteúdo para não ser coberto

8) Modal Pix estilo Vakinha (ponto crítico)
- Criar `PaymentModal` (shadcn `Dialog`) com layout fiel:
  - Valores rápidos (25/50/100 + “Outro”)
  - Campo valor personalizado
  - Método Pix como padrão
  - Área reservada do QR Code (somente container + placeholder `qrCodeUrl`)
  - Área “Pix copia e cola” com campo grande + botão “Copiar” (nesta fase: copiar um payload estático placeholder)
  - Instruções claras de pagamento (texto curto, visual limpo)
- Estados mutuamente exclusivos via enum:
  - `loading` → skeleton/spinner
  - `waiting` → mostra QR container + copia e cola
  - `success` → confirmação visual (token success)
  - `error` → mensagem + botão “Tentar novamente”

9) Simulação de estados (sem API)
- Incluir controles de simulação de estado dentro do modal (visíveis só em development)
- Fluxo: abrir modal → selecionar valor → “Gerar Pix” (simula loading → waiting) → simular success/error manualmente

10) Código preparado para API Pix (sem implementar)
- Criar `paymentService.ts` com funções stub e contratos:
  - `createPixCharge(amount)` retorna `{ paymentId, qrCodeUrl?, pixCopyPaste, status }`
  - `getPaymentStatus(paymentId)` retorna `{ status }`
- Manter UI desacoplada do service para futura troca por REST/polling/webhook

11) Rodapé institucional
- Rodapé simples, limpo, com tom institucional (sem competir com CTA)

12) Checklist “nível produção”
- Mobile (360/390/414/430): sticky CTA não cobre conteúdo; botões com área de toque; modal scrollável; fonte legível
- Desktop: 2 colunas “ok”, sem quebrar layout
- Modal: copiar “Pix copia e cola” funciona; estados não se misturam; fechar/reabrir reseta estado corretamente
- Comparar lado a lado com o print e ajustar: espaçamentos, tamanhos, sombras, bordas e hierarquia visual

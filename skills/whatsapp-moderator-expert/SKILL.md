---
name: whatsapp-moderator-expert
description: Regras de integração do Next.js com N8N e Evolution API para o moderador de WhatsApp.
---

# Skill WhatsApp Moderator (N8N)

O aplicativo possui uma camada de automação para moderar o grupo oficial do WhatsApp. Essa moderação utiliza webhooks, n8n, Evolution API e LLMs externos (OpenRouter).

## A Arquitetura do Moderador
O fluxo é orientado a eventos:
1. O usuário entra no app e clica em "Entrar no Grupo de WhatsApp".
2. Em casos específicos, o Next.js precisa se comunicar com o N8N para injetar ou consultar dados.
3. O N8N cuida de escutar a Evolution API (via Webhook) e gerenciar quem entra, quem sai e analisa as mensagens com IA.

## Criando Webhooks no Next.js (Para receber pings do n8n)
Se o N8N precisar notificar o painel administrativo do Motoboot (ex: "Alerta de Fraude" ou "Nova mensagem agressiva detectada"), você deve criar um Route Handler no Next.js no formato App Router.

**Arquivo:** `app/api/n8n-webhook/route.ts`
```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Rota POST para receber webhooks do N8N
export async function POST(request: Request) {
  try {
    // 1. Validar Header de Segurança (O n8n deve mandar um secret)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    
    // O payload terá os dados definidos no seu workflow N8N
    const { action, userWhatsapp, message } = payload;

    // Conectar via Service Role para contornar RLS em background
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Salvar alerta no banco
    if (action === 'alert') {
      await supabaseAdmin.from('alerts').insert({
        title: 'Alerta Moderador',
        message: `Mensagem suspeita de ${userWhatsapp}: ${message}`,
        type: 'warning'
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

## Diretrizes para a IA:
- Se precisar fazer o app mandar dados para o fluxo do n8n, use fetch(`YOUR_N8N_WEBHOOK_URL`, { method: 'POST' }).
- Se for criar uma API que RECEBE dados do N8N, **sempre utilize o Service Role Key do Supabase**, pois a API não tem a sessão do usuário no momento do webhook.
- O campo WhatsApp do usuário nunca deve ser mascarado ou modificado sem consentimento do banco de dados (que está bloqueado por Triggers).

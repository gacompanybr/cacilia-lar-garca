# MIGRATION.md — Diagnóstico para migração do projeto

> Documento gerado para planejar a migração deste projeto para outro servidor.
> **Não contém senhas, tokens, chaves secretas ou dados de clientes.**
> Data do diagnóstico: 2026-10-28

---

## 1. Tipo do projeto

**Sistema completo com banco de dados** — site institucional de imobiliária (landing pages + listagem/detalhes de imóveis) **+ painel administrativo** (cadastro/edição de imóveis, upload de imagens, gestão de usuários) com autenticação e banco de dados remotos.

Arquitetura: SPA React com pré-renderização estática (SSG) das rotas públicas (`/`, `/imoveis`, `/sobre`, `/contato`) e rotas administrativas renderizadas apenas no cliente.

## 2. Stack

| Item | Versão |
|---|---|
| Framework front-end | React 18.3 + React Router 6.30 |
| Bundler | Vite 5.4 (plugin SWC) |
| Linguagem | TypeScript 5.8 |
| CSS | Tailwind CSS 3.4 + tailwindcss-animate + shadcn/ui (Radix) |
| Estado/dados | @tanstack/react-query 5, @supabase/supabase-js 2.104 |
| Testes | Vitest 3 + Testing Library |
| Node.js (testado) | v22.23.4 (recomendado Node 18+) |
| Gerenciador de pacotes | npm 10.9.9 |

## 3. Comandos

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (porta 8080)
npm run dev

# Build de produção (cliente + servidor SSR + pré-renderização estática)
npm run build
# equivale a:
#   npm run build:client    -> vite build
#   npm run build:server    -> vite build --ssr src/entry-server.tsx --outDir dist/server
#   npm run build:prerender -> node prerender

# Rodar testes
npm run test

# Lint
npm run lint
```

Artefatos de build ficam em `dist/` (cliente) e `dist/server/` (entry-server usado pelo `prerender.js`).

## 4. Banco de dados

Backend remoto (PostgreSQL gerenciado). **Sem dados de linhas — apenas contagens.**

| Tabela | Linhas |
|---|---|
| `profiles` | 5 |
| `properties` | 117 |
| `property_images` | 2.074 |
| `user_roles` | 5 |

Tabelas de apoio à migração (sem linhas de dados relevantes, contagens incluídas acima):
- `profiles` — perfil do usuário (id, full_name, phone, avatar_url), FK para `auth.users`.
- `user_roles` — papéis (`app_role`: `corretor`, `comprador`), FK para `auth.users`.
- `properties` — imóveis (título, tipo, status venda/aluguel, preço, cidade, bairro, quartos, banheiros, vagas, área, descrição, features, destaque, created_by).
- `property_images` — galeria dos imóveis (property_id, url, position).

**Enums:** `app_role` (corretor, comprador), `property_status` (venda, aluguel), `property_type` (casa, apartamento, terreno, comercial).

**Funções:**
- `handle_new_user()` — trigger em `auth.users` INSERT; cria `profile` e papel padrão `comprador` no cadastro. ⚠️ Precisa ser recriada como trigger no novo servidor.
- `has_role(_user_id, _role)` — verifica papel (SECURITY DEFINER), usada nas políticas RLS.
- `set_updated_at()` — trigger `updated_at` (profiles, properties).

**RLS:** todas as tabelas públicas têm Row Level Security habilitada com políticas (leitura pública de imóveis/imagens; escrita apenas para `corretor`; perfis e papéis restritos ao próprio usuário / corretores). As políticas precisam ser recriadas idênticas na migração.

## 5. Autenticação

- **Auth padrão do Supabase** (e-mail + senha), gerenciado via `@supabase/supabase-js` no cliente.
- Sem provedores sociais configurados no código.
- **Total de usuários: 5.**
- Conta pré-registrada de corretor criada pela Edge Function (ver seção 7) — e-mail de administrador definido no código da função.
- Sessão persistida em `localStorage` do cliente (chave `sb-<project-ref>-auth-token`).

## 6. Storage

| Bucket | Público | Arquivos |
|---|---|---|
| `property-images` | Sim | 2.127 |

Imagens dos imóveis; as URLs são gravadas na tabela `property_images`. Na migração, **as URLs gravadas precisam continuar válidas** (mesma base de Storage ou reescrita das URLs).

## 7. Edge Functions

| Função | O que faz |
|---|---|
| `bootstrap-admin` | Sem JWT (endpoint público). Cria, de forma idempotente, uma conta de corretor pré-registrada (e-mail/senha fixos no código) e garante o papel `corretor` em `user_roles`. Chamada uma vez pelo front-end no primeiro carregamento. Usa `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (injetadas no runtime). |

Local: `supabase/functions/bootstrap-admin/index.ts`. Depende do runtime Deno do Supabase (import via `esm.sh/@supabase/supabase-js@2.45.0`).

## 8. Secrets (apenas nomes)

| Secret | Serviço de origem |
|---|---|
| `LOVABLE_API_KEY` | Lovable (gateway de IA da plataforma) |
| `SUPABASE_URL` | Supabase / Lovable Cloud |
| `SUPABASE_ANON_KEY` | Supabase / Lovable Cloud |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase / Lovable Cloud |
| `SUPABASE_DB_URL` | Supabase / Lovable Cloud |

> Valores **não** incluídos neste arquivo. No servidor de destino, recrie os equivalentes manualmente (URL + chaves do projeto Supabase de destino).

## 9. Integrações externas

- **WhatsApp** — apenas links profundos (`https://wa.me/5514997944908?text=...`) e botão flutuante. Sem API.
- **Facebook** — apenas links externos (perfil e página). Sem API, sem scraping.
- **Google Search Console** — meta tag de verificação no HTML.
- **E-mail / pagamento / IA no código:** nenhuma. Não há SDK de pagamento, serviço de e-mail nem chamadas de IA no front-end ou nas funções.
- **Gateway de IA da Lovable:** **não é usado pelo código do aplicativo**. O secret `LOVABLE_API_KEY` existe no projeto, mas nenhuma chamada ao gateway aparece no código. Fora da plataforma, ele pode ser descartado.

## 10. Variáveis de ambiente (apenas nomes)

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Nenhuma outra variável é lida pelo código (`import.meta.env` aparece somente no cliente Supabase e no check de PROD do `main.tsx`).

## 11. Tipo de backend

**Lovable Cloud** (Supabase gerenciado pela Lovable — backend único que serve preview e produção).

- **Project ID / Project Ref:** `oyzekjsqkzpbmwxrwxtf`
- URL do projeto: `https://oyzekjsqkzpbmwxrwxtf.supabase.co`

## 12. O que depende da plataforma Lovable e quebraria fora dela

1. **Hospedagem/preview/publicação** — o domínio publicado (`caciliaaredesimoveis.com.br`) e o preview são servidos pela Lovable; fora dela é preciso hospedar o build (`dist/`) em provedor próprio (Vercel, Netlify, VPS etc.) e configurar DNS/SSL.
2. **Lovable Cloud (Supabase gerenciado)** — credenciais de service role e senha do banco não são acessíveis via Lovable; para migrar o banco é preciso exportar os dados (CSV/dump via ferramentas de exportação) e importar em um projeto Supabase próprio, recriando enums, funções, triggers e políticas RLS.
3. **Edge Functions e secrets gerenciados** — `bootstrap-admin` e os secrets da seção 8 são gerenciados pela Lovable; no destino, faça deploy com Supabase CLI e configure as variáveis de ambiente manualmente.
4. **`lovable-tagger`** (devDependency) — plugin de Vite exclusivo da plataforma (marcação de componentes no modo desenvolvimento). Removível sem impacto em produção.
5. **Arquivos auto-gerados pela Lovable** — `src/integrations/supabase/client.ts`, `src/integrations/supabase/types.ts`, `previewAuthStorage.ts`, `.env` e `supabase/config.toml`; ao migrar, substituam os valores pelo novo projeto Supabase.
6. **Domínio e SSL** — o domínio personalizado precisa ser reconfigurado no novo host.
7. **Pré-renderização (SSG)** — `prerender.js` e `entry-server.tsx` são Node puro e funcionam fora da Lovable, desde que o host sirva os HTMLs estáticos gerados (ou rode um servidor que os use).

---

## 13. Valores

Variáveis de ambiente **visíveis** no código/arquivo `.env` (valores públicos, seguras para o cliente):

```env
VITE_SUPABASE_PROJECT_ID="oyzekjsqkzpbmwxrwxtf"
VITE_SUPABASE_URL="https://oyzekjsqkzpbmwxrwxtf.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95emVranNxa3pwYm13eHJ3eHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3MDg4ODUsImV4cCI6MjA5MjI4NDg4NX0.b7_cwmGUJCGikdsvZIinD5jVFwsNqEs8KyF-6dqiPt4"
```

Valores **não acessíveis** (nunca incluídos neste arquivo): `LOVABLE_API_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, senha do banco de dados.

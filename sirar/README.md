# سرار | SIRAR

نظام ذكي لإدارة وحماية البيانات — Smart Data Privacy Management System

**Team CyberRally — CR-15** | STC Hackathon

## Tech Stack

- **Next.js 16** + React 19 + TypeScript
- **Tailwind CSS v4** + shadcn/ui
- **Supabase** (Postgres + Auth + RLS)
- **OpenAI gpt-4o-mini** via Vercel AI SDK
- **Recharts** for data visualization

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Fill in your Supabase and OpenAI keys

# Run the database migration
# Apply supabase/migrations/0001_init.sql to your Supabase project
# Then apply supabase/seed.sql for sample data

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|---|---|
| `/` | Marketing landing page |
| `/login` | Authentication |
| `/app` | Dashboard with KPIs and charts |
| `/app/chat` | AI chatbot for data entry |
| `/app/classification` | Data classification (A/B/C) |
| `/app/classification/[cat]` | Category detail with records |
| `/app/integrations` | API key management |
| `/app/data` | Data management |
| `/app/permissions` | Role-based access control |
| `/app/reports` | Reports |
| `/app/alerts` | Security alerts |
| `/app/audit` | Audit logs |
| `/app/settings` | User settings |

## API

- `POST /api/chat` — Streaming AI chat
- `POST /api/v1/data` — External data ingestion (Bearer auth)
- `POST /api/v1/classify` — Classify text and detect sensitive fields

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

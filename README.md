# Miguel Giles — Portfolio & CV

Personal portfolio and interactive CV for Miguel Giles: electromechanic with 13 years of field experience, self-taught developer since 2023.

Built with Next.js 16, React 19, TypeScript, and next-intl for ES/EN bilingual support. Deployed on Vercel.

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy env template and fill in your Gmail App Password
cp .env.local.example .env.local

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server locally |
| `pnpm lint` | Run ESLint |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GMAIL_APP_PASSWORD` | Yes (contact form) | Gmail App Password for nodemailer SMTP |

Set this in `.env.local` (never commit this file). See `.env.local.example` for setup instructions.

## Architecture

```
src/
  app/[locale]/       # Next.js App Router with i18n routing (es/en)
    cv/               # Printable CV page (window.print → PDF)
    opengraph-image.tsx  # Dynamic OG image via Next.js ImageResponse
  actions/
    contact.ts        # Server Action: email via nodemailer + Gmail SMTP
  components/
    sections/         # Page sections: Hero, About, Projects, Experience, Contact
    layout/           # Header, Footer
  messages/           # i18n strings (es.json, en.json)
  i18n/               # next-intl configuration
public/
  images/             # Static assets (case-sensitive on Linux/Vercel)
```

**Key decisions:** see [docs/decisions/](docs/decisions/) for ADRs.

## Deployment

Deployed to Vercel. Set `GMAIL_APP_PASSWORD` in Vercel project environment variables (Production + Preview scopes).

CI runs on every push/PR to `main` via GitHub Actions: lint → typecheck → build → audit.

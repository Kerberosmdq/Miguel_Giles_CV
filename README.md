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
    cv/               # Single-column CV page, source for the static PDFs in public/cv/
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

## Regenerar el CV después de cambiar textos

Los PDFs descargables (`public/cv/Miguel_Giles_CV_ES.pdf` y `_EN.pdf`) son archivos estáticos generados desde `/es/cv` y `/en/cv`. Hay que regenerarlos cada vez que cambie el contenido del CV.

```powershell
pnpm build; pnpm start   # en una terminal

# en otra terminal (usar rutas absolutas)
$c = "C:\Program Files\Google\Chrome\Application\chrome.exe"
& $c --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 "--print-to-pdf=C:\AppsMiga\NexCV\public\cv\Miguel_Giles_CV_ES.pdf" http://localhost:3000/es/cv
& $c --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 "--print-to-pdf=C:\AppsMiga\NexCV\public\cv\Miguel_Giles_CV_EN.pdf" http://localhost:3000/en/cv
```

Después hay que reiniciar `pnpm start` para que sirva los archivos nuevos. Verificá que cada PDF tenga como máximo 2 páginas y texto seleccionable.

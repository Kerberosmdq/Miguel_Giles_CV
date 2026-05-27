# ADR-002: next-intl for Bilingual ES/EN Support

## Status
Accepted

## Date
2026-05-27

## Context
Portfolio needs Spanish (default) and English versions. Audience is primarily local (Argentina) but international opportunities matter.

## Decision
Use next-intl v4 with App Router integration. Default locale: `es`. Locales: `['es', 'en']`. All strings in `src/messages/{es,en}.json`.

## Alternatives Considered

### i18next / react-i18next
- Pros: Widely used, large ecosystem
- Cons: Extra setup for App Router, no built-in Next.js plugin
- Rejected: next-intl has first-class Next.js App Router support

### Manual locale routing
- Pros: No dependency
- Cons: Significant boilerplate for routing, pluralization, formatting
- Rejected: Not worth maintaining from scratch

## Consequences
- Locale prefix in URL: `/es/...` and `/en/...`
- `proxy.ts` replaces `middleware.ts` (Next.js 16 breaking change) for locale detection
- All user-visible text must go through `useTranslations()` — no hardcoded strings

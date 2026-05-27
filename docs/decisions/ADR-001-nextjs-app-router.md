# ADR-001: Next.js 16 with App Router

## Status
Accepted

## Date
2026-05-27

## Context
Portfolio site needs SSR for SEO, static generation for performance, and server-side logic for the contact form — all without a separate backend.

## Decision
Use Next.js 16 with App Router and React Server Components.

## Alternatives Considered

### Astro
- Pros: Minimal JS, excellent for content sites
- Cons: Less familiar, React components need explicit islands
- Rejected: next-intl and framer-motion integration is smoother in Next.js

### Vite + React SPA
- Pros: Simple, fast dev
- Cons: No SSR, no server actions — contact form would need a separate API
- Rejected: SEO and server-side email sending ruled it out

## Consequences
- Server Actions (`'use server'`) handle contact form email without a separate API route
- `proxy.ts` (renamed from `middleware.ts` in Next.js 16) handles i18n locale detection
- Dynamic OG image generated via `ImageResponse` at the edge

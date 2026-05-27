# ADR-003: nodemailer + Gmail SMTP for Contact Form

## Status
Accepted

## Date
2026-05-27

## Context
Contact form needs to deliver messages to miga.gls246@gmail.com. Options: transactional email SaaS (Resend, SendGrid) or direct SMTP.

## Decision
Use nodemailer v8 with Gmail SMTP and a Gmail App Password.

## Alternatives Considered

### Resend
- Pros: Modern API, good DX, free tier
- Cons: Requires a verified custom domain for production; the existing Resend account is tied to a different domain (NexIndu). Persistent 401 validation errors when trying to use it without a matching domain.
- Rejected: Domain restriction made it non-viable for this project without buying another domain

### SendGrid
- Pros: High deliverability, generous free tier
- Cons: Account setup overhead, same domain verification requirement at scale
- Rejected: Gmail SMTP is simpler given the single-recipient use case

## Consequences
- Requires `GMAIL_APP_PASSWORD` env var (16-char Google App Password, not the Gmail login password)
- Must be set in Vercel project env vars and in `.env.local` for local dev
- Email injection prevented by stripping `\r\n` from all user-supplied fields before use in headers
- Rate limited by Gmail SMTP (~500 emails/day) — acceptable for a personal portfolio

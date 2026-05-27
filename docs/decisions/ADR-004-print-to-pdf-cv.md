# ADR-004: Print-to-PDF for CV Download

## Status
Accepted

## Date
2026-05-27

## Context
Portfolio includes a downloadable CV. Options: static PDF file, server-side PDF generation, or browser print-to-PDF.

## Decision
Dedicated CV page at `/[locale]/cv/` with `window.print()` triggered by a download button. `@media print` CSS hides the button and formats the layout for A4.

## Alternatives Considered

### Static PDF file
- Pros: Simple, no logic
- Cons: Manual update required every time content changes; two sources of truth (page + PDF)
- Rejected: Content would drift out of sync

### Puppeteer / server-side PDF generation
- Pros: Pixel-perfect, consistent across browsers
- Cons: Significant server overhead, cold start time, complexity
- Rejected: Overkill for a personal portfolio; no budget for a dedicated render server

## Consequences
- CV content is always in sync with the site (single source of truth in i18n message files)
- Print output quality depends on the user's browser — Chrome produces the best results
- `@media print` CSS must be maintained carefully: removing `justify-content: space-between` and reducing padding/margins was necessary to prevent content overflow on A4

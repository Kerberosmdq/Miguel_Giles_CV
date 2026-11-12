# ADR-005: CV como PDF estático de una columna

## Status
Accepted (reemplaza a ADR-004)

## Date
2026-10-20

## Context
Los reclutadores y los sistemas ATS necesitan un archivo real, de una columna y con texto seleccionable. ADR-004 resolvía la descarga con `window.print()`, lo que obligaba al visitante a un paso extra (diálogo de impresión) y dependía de su navegador.

## Decision
- `/[locale]/cv` pasa a ser una página de una sola columna (A4, márgenes de 14 mm, máximo 2 páginas), sin animaciones ni íconos en el texto de contacto.
- Los PDFs `public/cv/Miguel_Giles_CV_{ES,EN}.pdf` se generan con Chrome headless desde esa página y se versionan en el repo.
- Los botones "Descargar CV" apuntan directo al PDF (`<a download>`).

## Alternatives Considered
- **`window.print()` (ADR-004):** una sola fuente de verdad, pero un paso extra y resultado variable según el navegador.
- **Puppeteer en el servidor:** demasiada infraestructura para un portfolio.

## Consequences
- La página y los PDFs comparten textos (archivos i18n), pero el PDF hay que regenerarlo a mano cuando cambia el contenido (comandos en el README).
- El PDF se ve igual en cualquier dispositivo y los ATS lo leen bien.

# ADR-006: Demos de proyectos con Tailwind acotado a `.nexdemo`

## Status
Accepted

## Date
2026-10-20

## Context
Las demos de los proyectos replican la interfaz de cada app con datos ficticios, como la landing de NexIndu. Esas escenas están escritas con Tailwind v4, lucide y componentes shadcn. El resto del sitio usa CSS Modules y no tiene Tailwind. Reescribir ~2.000 líneas de escenas a CSS Modules era caro y propenso a errores.

## Decision
- El código de la demo vive en `src/demo/` y se copia casi sin cambios (motor en `src/demo/engine`, escenas por app en `src/demo/<app>`).
- Tailwind se carga sólo con `theme` + `utilities` (sin preflight) y con `source(none)` + `@source "./"` para escanear únicamente `src/demo`.
- Los tokens de diseño de NexIndu y un reset mínimo se acotan a `.nexdemo`.
- Las capas se declaran `theme, base, components, utilities` y `globals.css` va dentro de `@layer base`, para que las utilidades ganen a los selectores globales del sitio.
- Cada demo tiene su propio `NextIntlClientProvider` con los textos de la app original (`src/demo/messages`).
- ESLint relaja tres reglas del React Compiler sólo en `src/demo/**`.

## Consequences
- Si cambia el diseño de una app hay que actualizar su demo a mano.
- Dependencias nuevas: tailwindcss, lucide-react, recharts, class-variance-authority, clsx, tailwind-merge, radix (avatar, slot).
- El CSS de la demo sólo se descarga junto con el chunk de la demo.

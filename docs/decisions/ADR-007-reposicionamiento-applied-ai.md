# ADR-007: Reposicionamiento a Applied AI Engineer (diseño "documento técnico")

## Status
Accepted

## Date
2026-11-12

## Context
El sitio presentaba a Miguel como "Full Stack Developer". El objetivo pasó a ser Applied AI Engineer especializado en software para manufactura regulada (GxP, 21 CFR Part 11), con NexIndu como caso de estudio principal. El diseño anterior (hero dividido, ruido, cursor, glassmorphism, acento cian) no transmitía rigor ni trazabilidad. El plan completo está en `docs/plan-applied-ai-portfolio.md`.

## Decision
- **Diseño A, "documento técnico":** fondo papel, IBM Plex Sans y Mono, un solo acento azul tinta, secciones numeradas con §, filetes finos y sin sombras ni degradados. Tokens en `src/app/globals.css`, con modo oscuro por `prefers-color-scheme`.
- **Diagramas en HTML/CSS**, no SVG ni imágenes: una `<ol>` de nodos con flechas en CSS (`src/components/diagrams/Flow.tsx`). El texto es real, se traduce, lo leen los lectores de pantalla y se adapta de horizontal a vertical sin trabajo extra.
- **Server Components por defecto** con `getTranslations`. `'use client'` solo en Header (menú móvil), Contact (formulario) y el wrapper de la demo.
- La demo animada de NexIndu se carga con `next/dynamic` (`ssr: false`) y solo cuando está cerca del viewport (IntersectionObserver), para no afectar el LCP.
- Sin scroll suave global ni animaciones de entrada; solo transiciones de hover/focus y la demo.
- Reglas de contenido: sin métricas ni clientes inventados; el empleador aparece solo en la trayectoria y en la experiencia del CV; NexIndu está en pre-lanzamiento y no se dice que use Python.

## Consequences
- Los textos viven en `src/messages/{es,en}.json` y cualquier cambio de posicionamiento se hace ahí.
- Los PDFs del CV hay que regenerarlos a mano cuando cambie el contenido (ver README y ADR-005).
- Los diagramas nuevos se arman con `Flow`; no hace falta una librería de gráficos para ellos.
- Se eliminaron `react-icons`, los componentes del diseño anterior y los scripts de edición de logo.

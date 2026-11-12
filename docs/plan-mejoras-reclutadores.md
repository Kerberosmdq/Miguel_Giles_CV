# Plan: portfolio orientado a reclutadores

> **Para quien ejecuta (Sonnet):** este plan lo armó Opus el 2026-10-20 a partir de un análisis
> del sitio, de lo que buscan los reclutadores y de las respuestas de Miguel. Las decisiones ya
> están tomadas: ejecutá, no las vuelvas a discutir. Si algo del plan choca con el código real,
> o falta un dato marcado como **[DATO PENDIENTE]**, frená y preguntale a Miguel; **nunca
> inventes números, métricas ni tecnologías**.
>
> Antes de escribir código de Next.js leé la guía correspondiente en `node_modules/next/dist/docs/`
> (esta versión, 16.x, tiene cambios respecto a lo que conocés; ver `AGENTS.md`).

---

## 0. Contexto y objetivo

**Objetivo de Miguel:** entrar a trabajar en desarrollo de software. Prefiere **remoto**; acepta
**part-time** (para seguir en su trabajo actual) o **full-time**. No se publica nada sobre sueldo.

**Qué buscan los reclutadores (la base de cada cambio):**
- La primera revisión de un CV dura unos **7 segundos**. Lo que más miran son el **puesto**, la **empresa** y los
  títulos de sección. Penalizan los diseños recargados, las **varias columnas** y las frases largas (Ladders, 2018).
- Prefieren pocos proyectos **terminados, con demo en vivo y con resultados medibles** antes que muchos a medio hacer.
- Desconfían del código hecho con IA; valoran que el candidato **entienda y decida** sobre el
  código. Por eso se habla de "desarrollo asistido por IA" y se muestran pruebas de criterio
  (tests, CI, seguridad, ADRs), nunca de "vibe coding".

**Posicionamiento:** *Desarrollador Full Stack (Next.js · TypeScript · Supabase) con 13 años en
la industria, 9 en farma regulada GxP.* El diferencial es industria + software, y el argumento
más fuerte es que **hay gente usando sus apps todos los días**.

### Decisiones tomadas

| Tema | Decisión |
|---|---|
| Dominio | `https://miguel-giles-cv.vercel.app` (no se compra `miguelgiles.dev`) |
| Proyectos principales (con demo) | **NexIndu** (destacado), **NexKio**, **NexQuipu** |
| "Otros proyectos" (tarjeta chica + links) | **NexPulse**, **NexPlay** |
| Se eliminan del sitio | NexWod, NexGrid |
| Estado de NexIndu | Online, **sin uso oficial todavía** → "Pre-lanzamiento". Prohibido decir "en producción" o "en uso". |
| Uso real | NexKio: **4 kioscos**. NexQuipu: **3 familias**. |
| Puesto en B.Braun | **Técnico Electromecánico y de Automatización** (EN: *Electromechanical & Automation Technician*) |
| Demos | Mini demo animada estilo nexindu.com.ar, hecha con **capturas reales y un cursor animado** (ver Fase 2) |
| CV descargable | PDF real de **una columna**, en ES y EN, con descarga directa |
| Forma de trabajo | Rama `feat/perfil-reclutadores`, **un commit por fase**. No pushear ni mergear sin el OK de Miguel. |

### Stack real verificado (sacado de los `package.json` de cada repo en `C:\AppsMiga\`)

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend y datos:** Supabase (PostgreSQL, Auth, Realtime), Zod, React Hook Form, Resend
- **Calidad y DevOps:** Playwright (E2E), Vitest, GitHub Actions (NexIndu tiene CodeQL, OWASP ZAP,
  backups de base de datos y prueba de restauración: confirmalo leyendo `C:\AppsMiga\NexIndu\.github\workflows\`), Vercel, Git
- **IA:** Gemini API (NexIndu: asistente "Nexi" y mejora de textos), RAG con embeddings
  (`@huggingface/transformers` en NexIndu). En NexQuipu, **verificá** si `src/app/api/analyze-statement/route.ts`
  usa IA o solo parsea el PDF (`pdf2json`). Si no usa IA, no digas "IA" para NexQuipu.
- **Web avanzada:** PWA offline-first (NexKio, NexPulse), WebRTC P2P con PeerJS (NexPulse),
  Passkeys/WebAuthn (NexIndu), notificaciones push (NexQuipu)
- **Industrial:** PLC / automatización, GxP y FDA 21 CFR Part 11, Lean/5S, neumática, electricidad,
  refrigeración industrial

**Python, Firebase y "NoSQL" no aparecen en ningún proyecto.** Se quitan del sitio, salvo que Miguel diga que los usa (ver D6).

---

## Datos pendientes de Miguel

Pedilos al empezar. Las fases 1 y 3 se pueden hacer sin ellos: dejá un `TODO(dato)` donde haga falta.

| # | Dato | Lo necesita |
|---|---|---|
| D1 | **Capturas** de NexIndu, NexKio y NexQuipu según la especificación de la Fase 2.1, **con datos ficticios** | Fase 2 |
| D2 | URL pública de NexKio (si tiene) y de NexQuipu (¿`nexquipu.vercel.app`?) | Fase 2 |
| D3 | Desde cuándo se usa NexKio y NexQuipu (mes/año), y algún número opcional (ventas registradas, productos, etc.) | Fases 2 y 3 |
| D4 | ¿Quitar el cursor personalizado (`CustomCursor`)? Recomendación: **sí** | Fase 1 |
| D5 | Confirmar el LinkedIn `linkedin.com/in/miguel-giles` | Fase 1 |
| D6 | ¿Usa Python o Firebase en algo? Si no, se quitan | Fase 3 |

---

## Fase 1: arreglos críticos (no necesita datos)

**Commit:** `fix: url real, sin preloader, experiencia con empresas y metadata del CV`

### 1.1 Centralizar la URL y los contactos
- Crear `src/lib/site.ts` con: `SITE_URL = 'https://miguel-giles-cv.vercel.app'`, `EMAIL`, `PHONE_DISPLAY`
  (`+54 9 223 455-6968`), `WHATSAPP_URL` (`https://wa.me/5492234556968`), `LINKEDIN_URL`, `GITHUB_URL`
  (`https://github.com/kerberosmdq`) y `NEXINDU_URL` (`https://www.nexindu.com.ar`).
- Reemplazar **todos** los valores escritos a mano por estas constantes: `src/app/[locale]/layout.tsx`
  (metadataBase, openGraph.url, canonical, alternates y JSON-LD), `src/app/sitemap.ts`, `src/app/robots.ts`,
  `src/app/[locale]/opengraph-image.tsx`, `src/app/[locale]/cv/page.tsx`, `src/components/sections/Contact.tsx`
  y el `Footer` si tiene links.
- Quitar el bloque del QR en el CV y borrar `public/images/qr-miguelgiles.svg` (apunta al dominio muerto; el CV nuevo no lleva QR).
- Quitar `'vibe coding'` de `keywords` en el layout.
- **Comprobación:** `grep -rn "miguelgiles.dev" src public` no devuelve nada.

### 1.2 Contenido visible de inmediato
- Eliminar `Preloader` (componente, CSS y su uso en el layout).
- En `Hero.tsx`, que el `h1`, el puesto y la descripción **se rendericen visibles desde el servidor**:
  nada de `initial` con opacity 0 o clip-path en esos elementos. Se puede dejar una entrada sutil
  en elementos secundarios (foto, botones), pero que termine en **≤ 0,6 s** y sin delays de más de 0,3 s.
- Si D4 = sí: eliminar `CustomCursor` (componente, CSS, uso en el layout) y los atributos `data-cursor-text` en todo `src/`.

### 1.3 Experiencia: empresas visibles y orden inverso
Reemplazar el diseño de dos columnas de `Experience.tsx` por **una sola línea de tiempo vertical**,
de lo más reciente a lo más viejo. Cada entrada tiene: puesto (h3), **empresa visible**, período, modalidad o ubicación y 2–3 viñetas.
Mantener el estilo visual actual (sección clara, acento cyan) y una animación de entrada simple.

Orden y contenido (los textos van en la Fase 3; acá solo la estructura y las claves i18n):
1. Desarrollador Full Stack, Proyectos propios (NEX Apps), 2023 – Presente, Remoto, *en paralelo a B.Braun*
2. Técnico Electromecánico y de Automatización, **B.Braun Medical Argentina**, 2017 – Presente, Mar del Plata
3. Técnico Frigorista Industrial, **Coiron**, 2013 – 2017

En `messages/*.json`, `experience.*` pasa a tener `company` y `bullets` (array) por entrada, igual que `cv.*`.

### 1.4 Metadata propia para /cv
`cv/page.tsx` es `'use client'` y no puede exportar metadata. Crear `src/app/[locale]/cv/layout.tsx`
con `generateMetadata` (antes, revisá en `node_modules/next/dist/docs/` cómo se hace en esta versión):
- ES: título `CV — Miguel Giles · Desarrollador Full Stack`, descripción `CV de Miguel Giles: desarrollador Full Stack (Next.js, TypeScript, Supabase) con 13 años en la industria farmacéutica e industrial.`
- EN: título `Resume — Miguel Giles · Full Stack Developer`, con la descripción equivalente.
- canonical `${SITE_URL}/${locale}/cv`.

---

## Fase 2: proyectos con mini demo (necesita D1, D2 y D3)

**Commit:** `feat: proyectos con demo animada, solo apps online`

### 2.1 Capturas: especificación para Miguel
Pasale este texto tal cual:

> Para cada app (NexIndu, NexKio, NexQuipu) necesito **4 capturas PNG** con **datos ficticios**.
> NexQuipu muestra finanzas de familias reales y NexKio nombres de clientes del fiado: usá una
> cuenta demo, nunca datos reales.
> Cómo sacarlas: Chrome → F12 → ícono de dispositivo (Ctrl+Shift+M) → "Responsive" con **1440 × 900**
> → menú ⋮ → **"Capture screenshot"**. Si la app se usa sobre todo en el celular, hacelas en **390 × 844**.
> Guardalas en `C:\AppsMiga\NexCV\capturas\<app>\01.png … 04.png` y anotá en una línea qué muestra cada una.
>
> Escenas sugeridas:
> - **NexIndu** (podés usar la "Planta Demo" de la landing): Panel de control · Órdenes de trabajo · Registro de auditoría con firma electrónica · Asistente Nexi
> - **NexKio:** Venta con escáner (POS) · Inventario · Fiado (cuentas de clientes) · Reportes
> - **NexQuipu:** Resumen del mes · Carga del resumen de tarjeta · Suscripciones detectadas · Alertas o recomendaciones

Procesamiento (lo hacés vos): convertir a **WebP** (calidad ~80, ≤ 150 KB cada una) y guardar en
`public/images/Projects/<app>/01.webp …`. **Respetá la "P" mayúscula de `Projects`**: Vercel corre en Linux y distingue mayúsculas.
La carpeta `capturas/` se agrega a `.gitignore`.

### 2.2 Componente de demo (inspirado en la landing de NexIndu)
Referencia: `C:\AppsMiga\NexIndu\components\landing\demo\`. La demo de NexIndu dibuja la app entera
en HTML (~3.300 líneas, 5 escenas hechas a mano); replicar eso para 3 apps es demasiado. Acá se
reutiliza **el motor** y cada escena es una **captura real con un cursor animado encima**.
Visualmente se ve igual: marco de navegador, cursor que hace clic, leyenda, pestañas y pausa.

Archivos nuevos en `src/components/demo/` (con **CSS Modules**; este repo no usa Tailwind, ni `cn`, ni lucide):
- `useDemoDirector.ts`: copia de `NexIndu/components/landing/demo/useDemoDirector.ts` (es genérico).
  Conservá sus modos `auto` / `user` / `paused`, que solo corra si está a la vista (IntersectionObserver)
  y con la pestaña visible, y que con *reduced motion* arranque en pausa.
- `DemoCursor.tsx`: adaptación de `DemoCursor.tsx` de NexIndu a CSS Modules. Se mueve a un "hotspot" (x %, y %) y hace un círculo de clic.
- `ProjectDemo.tsx`. Props:
  ```ts
  type DemoScene = { id: string; src: string; width: number; height: number;
                     caption: string; hotspot: { x: number; y: number }; duration: number };
  type Props = { scenes: DemoScene[]; frame: 'browser' | 'phone'; urlLabel: string; appName: string };
  ```
  Renderiza:
  - El marco: barra con 3 puntos y la URL de la app, o un marco de celular.
  - La captura con `next/image` (lazy, `sizes` correcto, `alt` descriptivo) y fundido entre escenas con `AnimatePresence`.
  - El cursor yendo al hotspot de cada escena.
  - Una leyenda debajo, que cambia con la escena.
  - Pestañas para saltar entre escenas (`<button aria-pressed>`).
  - Un botón **Pausar/Reanudar** (WCAG 2.2.2) y una barra de progreso por escena.
- Los textos de la demo (leyendas, pausar, reanudar) van en `messages/*.json`, en ES y EN.

### 2.3 Datos y layout de la sección
- Crear `src/data/projects.ts` con los proyectos: id, nombre, URL, repo (solo NexPulse y NexPlay
  son públicos; NexIndu, NexKio y NexQuipu son privados, así que no llevan link a código), stack
  (chips), escenas de la demo y tipo de marco.
- Reescribir `Projects.tsx`:
  - **Sacar el scroll horizontal "secuestrado"** (`useScroll`/`useTransform`, contenedor sticky de 3600 px).
  - Lista vertical de **3 proyectos principales**, alternando la demo a izquierda y derecha en escritorio;
    en celular la demo va arriba del texto. NexIndu primero y más grande.
  - Cada tarjeta lleva: nombre · **insignia de uso** · una línea de valor · 2–3 viñetas · chips de
    stack · botón "Ver online" (si tiene URL).
  - Debajo, **"Otros proyectos online"**: dos tarjetas chicas (logo, una línea, links "Ver online" y "Código") para NexPulse y NexPlay.
- Copiar el logo de NexPlay (`C:\AppsMiga\NexPlay\public\NexPlay_Logo.png`) a `public/images/Projects/nexplay.png`.
- Borrar `public/images/Projects/nexwod.png` y `nexgrid.png`, y sus claves en `messages/*.json`.
- **Comprobación:** `grep -rni "próximamente\|coming soon" src` no devuelve nada.

---

## Fase 3: textos (ES y EN, no necesita capturas)

**Commit:** `feat: textos orientados a reclutadores en ES y EN`

Usá estos textos tal cual. Los que tienen `TODO(dato)` se completan cuando lleguen D3/D6.

### 3.1 Orden de secciones y navegación
- `page.tsx`: **Hero → Proyectos → Experiencia → Stack → Sobre mí → Contacto**.
- Navbar con links en ese orden + un botón **"CV"** que descarga el PDF (Fase 4; mientras tanto, link a `/cv`).
  El CTA "Hablemos" sigue apuntando a `#contact`.

### 3.2 Hero
| Clave | ES | EN |
|---|---|---|
| greeting | Hola, soy | Hi, I'm |
| role | Desarrollador Full Stack | Full Stack Developer |
| stackLine *(nueva)* | Next.js · TypeScript · Supabase | Next.js · TypeScript · Supabase |
| tagline | Construyo apps que se usan todos los días: un sistema de ventas en 4 kioscos, un gestor de finanzas para 3 familias y un software de mantenimiento para plantas farmacéuticas. Antes de programar, pasé 13 años en la industria, 9 de ellos en farma regulada (GxP). | I build apps people use every day: a point-of-sale system running in 4 shops, a finance tracker used by 3 families, and maintenance software for pharmaceutical plants. Before coding, I spent 13 years in industry, 9 of them in regulated pharma (GxP). |
| availability *(nueva, como chip)* | Disponible para trabajo remoto · part-time o full-time | Open to remote roles · part-time or full-time |
| cta_primary | Ver proyectos | See projects |
| cta_secondary | Descargar CV (PDF) | Download resume (PDF) |

### 3.3 Proyectos
| | ES | EN |
|---|---|---|
| title / subtitle | Proyectos · Apps reales, con usuarios reales | Projects · Real apps, real users |
| **NexIndu** insignia | Pre-lanzamiento | Pre-launch |
| NexIndu línea | Software de mantenimiento (CMMS) para plantas farmacéuticas reguladas. | Maintenance management software (CMMS) for regulated pharmaceutical plants. |
| NexIndu viñetas | Órdenes de trabajo, mantenimiento preventivo e inventario de repuestos · Registro de auditoría inmutable con firma electrónica (FDA 21 CFR Part 11, ALCOA+) · Asistente de IA (Gemini) con RAG sobre la documentación de planta | Work orders, preventive maintenance and spare-parts inventory · Immutable audit trail with e-signatures (FDA 21 CFR Part 11, ALCOA+) · AI assistant (Gemini) with RAG over plant documentation |
| NexIndu calidad *(viñeta 4, si se confirma en los workflows)* | Tests E2E con Playwright y CI con análisis de seguridad (CodeQL, OWASP ZAP) | Playwright E2E tests and CI with security scanning (CodeQL, OWASP ZAP) |
| **NexKio** insignia | En uso en 4 kioscos | Used daily in 4 shops |
| NexKio línea | Sistema de ventas para kioscos que funciona sin conexión. | Offline-first point-of-sale system for small shops. |
| NexKio viñetas | Venta con lector de códigos de barras · Inventario, fiado y reportes · PWA: sigue vendiendo aunque se corte internet | Barcode-scanner checkout · Inventory, store credit and reports · PWA: keeps selling when the internet goes down |
| **NexQuipu** insignia | Usada por 3 familias | Used by 3 families |
| NexQuipu línea | Finanzas familiares a partir de los resúmenes de tarjeta. | Family finances built from credit-card statements. |
| NexQuipu viñetas | Lee el resumen en PDF y categoriza los gastos · Detecta suscripciones y gastos ocultos · Alertas con notificaciones push. *(Agregar "con IA" solo si se confirma en el código.)* | Reads the PDF statement and categorizes spending · Detects subscriptions and hidden charges · Push-notification alerts |
| Otros: título | Otros proyectos online | Other live projects |
| NexPulse | Reloj de ciegas para torneos de póker caseros, con control remoto P2P por WebRTC. | Blind timer for home poker tournaments, with P2P remote control over WebRTC. |
| NexPlay | Juegos de mesa online en tiempo real para jugar en familia (Supabase Realtime). | Real-time online board games for family play (Supabase Realtime). |
| Botones | Ver online · Código | Live demo · Code |

Si llega D3, sumar el dato al lado de la insignia (por ejemplo "En uso en 4 kioscos desde TODO(dato)").

### 3.4 Experiencia
| Entrada | ES | EN |
|---|---|---|
| Dev: puesto / empresa | Desarrollador Full Stack · Proyectos propios (NEX Apps) | Full Stack Developer · Independent projects (NEX Apps) |
| Dev: período | 2023 – Presente · Remoto, en paralelo a B.Braun | 2023 – Present · Remote, alongside B.Braun |
| Dev: viñetas | Diseño, desarrollo y despliegue de apps web completas con Next.js, TypeScript y Supabase · Dos apps en uso diario: NexKio (4 kioscos) y NexQuipu (3 familias) · Desarrollo asistido por IA con tests (Playwright, Vitest), CI en GitHub Actions y decisiones documentadas | Design, build and deploy full web apps with Next.js, TypeScript and Supabase · Two apps in daily use: NexKio (4 shops) and NexQuipu (3 families) · AI-assisted development backed by tests (Playwright, Vitest), GitHub Actions CI and documented decisions |
| B.Braun: puesto | Técnico Electromecánico y de Automatización | Electromechanical & Automation Technician |
| B.Braun: viñetas | Mantenimiento y automatización (PLC) de líneas de producción farmacéutica en entorno regulado GxP · Diagnóstico y resolución de fallas críticas en tiempo real · Mejora continua con Lean/5S | Maintenance and PLC automation of pharmaceutical production lines in a GxP-regulated plant · Real-time diagnosis and resolution of critical failures · Continuous improvement with Lean/5S |
| Coiron: puesto | Técnico Frigorista Industrial | Industrial Refrigeration Technician |
| Coiron: viñetas | Lideré equipos de montaje de cámaras frigoríficas industriales desde cero · Responsabilidad sobre refrigeración, electricidad y neumática | Led installation teams building industrial cold rooms from scratch · Responsible for refrigeration, electrical and pneumatic systems |

Usar los mismos textos en `cv.*` para que la home, el CV y LinkedIn digan lo mismo.

### 3.5 Stack
Cambiar el bento de logos sueltos por **5 tarjetas por categoría**, cada una con chips de texto.
Se puede mantener el ícono en las tecnologías principales y el estilo oscuro actual.
Las categorías y su contenido son los del bloque "Stack real verificado" de la sección 0.
Títulos: Frontend · Backend y datos · Calidad y DevOps · IA · Industria (EN: Frontend · Backend & data · Quality & DevOps · AI · Industry).
Borrar las claves sin uso (`stack.categories.ai = "IA & Vibe Coding"`, etc.).

### 3.6 Sobre mí (de 3 pantallas a 1)
Eliminar los tres "capítulos" con sus visuales (SCADA, circuito y terminal) y reemplazarlos por un párrafo y una fila de 4 datos.
- ES: *Soy técnico electromecánico y trabajo en la industria desde 2013: primero en refrigeración industrial y desde 2017 en B.Braun, en una planta farmacéutica regulada. En 2023 empecé a programar por mi cuenta y hoy construyo apps completas, usando la IA como herramienta de trabajo. De la industria traigo método para diagnosticar fallas, la costumbre de documentar y trabajar bajo normas estrictas, y el foco en que las cosas funcionen todos los días.*
- EN: *I'm an electromechanical technician and have worked in industry since 2013: first in industrial refrigeration and, since 2017, at B.Braun in a regulated pharmaceutical plant. In 2023 I started teaching myself to code, and today I build full apps, using AI as a working tool. From industry I bring a methodical approach to troubleshooting, a habit of documenting and working under strict standards, and a focus on things working every single day.*
- Datos: **13 años** en la industria · **9 años** en farma GxP · **2 apps** en uso diario · **2 idiomas** (ES nativo / EN intermedio). EN: years in industry · years in GxP pharma · apps in daily use · languages.

### 3.7 Contacto
| Clave | ES | EN |
|---|---|---|
| title | Hablemos | Let's talk |
| subtitle | ¿Buscás sumar un desarrollador a tu equipo? Estoy disponible para roles remotos, part-time o full-time. | Looking to add a developer to your team? I'm open to remote roles, part-time or full-time. |
| messagePlaceholder | Contame sobre el puesto o el proyecto… | Tell me about the role or project… |
| connectText | Respondo en menos de 24 h. | I reply within 24 h. |

Mostrar el **email como texto visible y seleccionable** (no solo el ícono), con un botón "Copiar".

### 3.8 Metadata (layout)
- Título ES: `Miguel Giles — Desarrollador Full Stack | Next.js · TypeScript`; EN: `Miguel Giles — Full Stack Developer | Next.js · TypeScript`
- Descripción ES: `Desarrollador Full Stack con 13 años en la industria (9 en farma GxP). Apps en uso real con Next.js, TypeScript y Supabase. Disponible para trabajo remoto.` (EN equivalente)
- JSON-LD `jobTitle`: `Full Stack Developer`. Agregar `knowsAbout` con las tecnologías principales.
- `opengraph-image.tsx`: nombre, "Desarrollador Full Stack", "Next.js · TypeScript · Supabase" y la URL nueva.

**Comprobación:** `grep -rni "vibe" src` no devuelve nada.

---

## Fase 4: CV en PDF de una columna

**Commit:** `feat: CV de una columna y PDFs descargables`

### 4.1 Rediseño de `/cv`
- Pasar de barra lateral + contenido a **una sola columna**. Orden:
  1. **Encabezado:** nombre · "Desarrollador Full Stack | Técnico Electromecánico y de Automatización" ·
     una línea de contacto (email · teléfono · Mar del Plata, Argentina · sitio · LinkedIn · GitHub) ·
     "Disponible: remoto, part-time o full-time". Foto chica opcional a la derecha (es habitual en LATAM).
  2. **Perfil:** *Desarrollador Full Stack (Next.js, TypeScript, Supabase) con 13 años de experiencia
     en la industria, 9 de ellos en una planta farmacéutica regulada GxP. Construyo y mantengo apps web
     que se usan a diario —un sistema de ventas en 4 kioscos y un gestor de finanzas para 3 familias— y
     un software de mantenimiento para plantas farmacéuticas alineado con FDA 21 CFR Part 11. Busco
     sumarme a un equipo de desarrollo, en remoto.* (y su versión EN)
  3. **Proyectos de software:** NexIndu, NexKio y NexQuipu con los textos de la Fase 3.3. **Sacar "En producción" de NexIndu.**
  4. **Experiencia laboral:** B.Braun y Coiron (textos de la Fase 3.4)
  5. **Habilidades técnicas** (texto plano agrupado, no chips) · 6. **Formación** · 7. **Idiomas**
- Sin íconos SVG metidos en el texto de contacto (los ATS los leen mal), sin tablas para maquetar,
  títulos de sección como `<h2>` reales.
- Sacar la animación de Framer Motion de `resumePaper`: si el PDF se genera mientras está en opacity 0, sale en blanco.
- CSS de impresión: A4, márgenes de 14 mm, **2 páginas como máximo**, ocultar los botones.

### 4.2 Generar y servir los PDFs
- Con el servidor corriendo (`pnpm build && pnpm start`), generar:
  ```powershell
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf="public\cv\Miguel_Giles_CV_ES.pdf" http://localhost:3000/es/cv
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-pdf-header-footer --virtual-time-budget=5000 --print-to-pdf="public\cv\Miguel_Giles_CV_EN.pdf" http://localhost:3000/en/cv
  ```
- Documentar estos comandos en el README ("Regenerar el CV después de cambiar textos").
- Botones "Descargar CV" del hero y de la navbar, y "Descargar PDF" en `/cv`: `<a href="/cv/Miguel_Giles_CV_{ES|EN}.pdf" download>` según el idioma. Quitar `window.print()`.
- Abrir cada PDF y verificar: **se puede seleccionar el texto**, no hay contenido cortado, son 1–2 páginas y no hay links a `miguelgiles.dev`.
- Reemplazar `CV/CV_Miguel_Giles.pdf` por una copia del PDF nuevo en español, o borrarlo (preguntar a Miguel).
- Escribir `docs/decisions/ADR-005-cv-pdf-estatico.md`, que reemplaza a ADR-004. Contexto: los reclutadores y los ATS necesitan un archivo real de una columna; imprimir el HTML agregaba un paso.

---

## Fase 5: GitHub (lo hace Miguel; fuera de este repo)

Checklist para pasarle a Miguel. No forma parte de los commits de este repo.
- [ ] Fijar (pin) en el perfil: **Miguel_Giles_CV**, **PokerPulse**, **NexPlay** (los repos públicos con demo).
- [ ] Ponerle descripción y link a todos los repos públicos.
- [ ] Arreglar o quitar los links muertos: **Vitaria** (`vitaria-vert.vercel.app`) y **OptioGrid** (`optio-grid.vercel.app`) dan 404. Si no se usan, archivar o hacer privados esos repos.
- [ ] README de PokerPulse y NexPlay con: qué es, captura o GIF, stack, link a la demo y cómo correrlo.
- [ ] README del perfil (`Kerberosmdq/Kerberosmdq`) con el mismo posicionamiento del hero y link al portfolio.
- [ ] Revisar que la URL del perfil sea `https://miguel-giles-cv.vercel.app` (hoy ya lo es).

---

## Fase 6: verificación final (antes de pedir el OK para mergear)

- [ ] `pnpm lint`, `npx tsc --noEmit` y `pnpm build` sin errores (son los mismos chequeos del CI).
- [ ] `grep -rn "miguelgiles.dev\|vibe\|Próximamente\|Coming soon" src public` → nada.
- [ ] Recorrer `/es`, `/en`, `/es/cv` y `/en/cv` en el navegador integrado a **1440×900** y a **375×812**:
  sin scroll horizontal, nombre y puesto visibles al instante, demos que avanzan solas y se pueden pausar,
  y con *reduced motion* arrancan en pausa.
- [ ] Llegar a los proyectos: deberían estar a **≤ 1 pantalla** debajo del hero.
- [ ] Los PDFs descargan y su texto se puede seleccionar.
- [ ] Los links externos (NexIndu, NexPulse, NexPlay, LinkedIn, GitHub y WhatsApp) responden.
- [ ] Mostrarle a Miguel un resumen con capturas y pedir el OK para pushear. El push genera un *preview* en Vercel.
- [ ] Después del deploy (lo hace Miguel): pegar la URL en el [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) para refrescar la vista previa.

## Orden de ejecución sugerido

**Fase 1 → Fase 3 → (cuando llegue D1) Fase 2 → Fase 4 → Fase 6.** La Fase 5 la hace Miguel en paralelo.
La Fase 4 va después de la 3 porque el CV reutiliza esos textos.

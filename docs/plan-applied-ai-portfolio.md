# Plan: reposicionamiento a Applied AI Engineer (diseño A · "Documento técnico")

> Plan escrito por Opus el 2026-11-12 para que lo ejecute otra sesión (Sonnet) **sin el contexto de la conversación original**.
> Las decisiones ya están tomadas: no las vuelvas a discutir. Si falta un dato, frená y preguntá; **nunca inventes**.
> Los ítems marcados **[CONFIRMAR]** se le preguntan a Miguel antes de publicarlos.
> Este plan reemplaza a `docs/plan-mejoras-reclutadores.md`, que queda solo como historial.

---

## 0. Reglas que no se negocian

1. **No inventar métricas ni clientes.** Las únicas cifras permitidas son las de este plan: 13+ años en la industria, 4 kioscos (NexKio), 3 familias (NexQuipu), ~40 intenciones, 384 dimensiones, 144 h, 100/100 y 6 idiomas.
2. **El empleador (B.Braun) aparece SOLO en la trayectoria laboral.** Nunca junto a un proyecto, ni con frases como "en paralelo a B.Braun". Los proyectos son de Miguel y los hizo en su tiempo libre.
3. No mencionar documentos internos de ninguna empresa.
4. No mostrar DNI ni otros datos sensibles. El teléfono y el WhatsApp **sí** se muestran (decisión de Miguel).
5. **Nunca decir que NexIndu usa Python.** Python aparece solo en el diplomado.
6. NexIndu está en **pre-lanzamiento**: nunca decir "en producción" ni "usado por plantas".
7. Trabajar en la rama `feat/applied-ai-portfolio`. Nunca commitear en `main`.
8. Leé `node_modules/next/dist/docs/` antes de usar cualquier API de Next (Next 16: `middleware.ts` ahora se llama `proxy.ts`, `params` es una Promise, etc.).

---

## 1. Qué se queda y qué se va

| Se queda | Se rehace | Se va |
|---|---|---|
| Next 16 + next-intl (`/es`, `/en`), `proxy.ts`, server action de contacto (`src/actions/contact.ts`), cabeceras de seguridad, CI | Todas las secciones, el layout, los estilos globales, la metadata, el JSON-LD, la imagen OG, la página `/cv` y los PDFs | Hero dividido con morph por scroll, capa de ruido, cursor, glassmorphism, `SectionTransition`, `ScrollProgress`, sección TechStack como grilla de logos, el acento cian `#00E5FF`, las fuentes Space Grotesk e Inter |
| La demo animada `src/demo/**`, que se reutiliza dentro del caso NexIndu | `src/data/projects.ts` | `edit_logo.py`, `remove_bg.js` y `public/logo_original.jpeg`, si no los usa nada (verificar con grep) |

Dependencias: `framer-motion`, `recharts`, `lucide-react` y `@radix-ui/*` las usa la demo, así que se quedan. `react-icons` se borra si después del rediseño no lo usa ningún archivo.

---

## 2. Sistema visual (opción A)

Concepto: el sitio se lee como un **documento técnico controlado**. Tiene un código de documento (DOC-001), número de revisión, secciones numeradas (§1, §2…), filetes finos, un solo acento azul tinta y nada de efectos.

### Tokens (en `src/app/globals.css`, sobre `:root`)

```css
:root {
  --bg: #F7F6F2;          /* papel */
  --surface: #FFFFFF;
  --ink: #1B1F27;         /* texto principal */
  --ink-2: #4A5060;       /* texto secundario (AA sobre --bg) */
  --ink-3: #5A6070;       /* metadatos, mono */
  --rule: #DDDAD0;        /* filetes y bordes */
  --rule-strong: #9AA0AC;
  --accent: #1F4E8C;      /* azul tinta: links, CTA principal, nodos clave */
  --accent-ink: #FFFFFF;
  --accent-soft: #E7EEF7;
  --ok: #2E7D4F;          /* solo para marcar "verificado" en diagramas */
  --radius: 3px;
  --maxw: 1080px;
  --gutter: 16px;         /* mínimo en celular */
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #12151B; --surface: #191D25; --ink: #E6E8EC; --ink-2: #A6ADBA;
    --ink-3: #8E96A4; --rule: #2A303B; --rule-strong: #4A5262;
    --accent: #7FA8E0; --accent-ink: #0E1420; --accent-soft: #1C2636; --ok: #6CC08B;
  }
}
```

- Todas las combinaciones de texto tienen que pasar **WCAG AA** (verificar con DevTools). Si alguna no pasa, ajustá el valor y anotalo.
- **Tipografía** con `next/font/google`: `IBM_Plex_Sans` (400, 500, 600) como `--font-sans` e `IBM_Plex_Mono` (400, 500) como `--font-mono`. No usar más familias ni pesos.
- Escala: h1 `clamp(2rem, 5vw, 3.25rem)` en 600; h2 `clamp(1.5rem, 3vw, 2rem)`; texto 1rem / 1.65; los metadatos en mono a 0.8125rem con `--ink-3`.
- **Etiquetas de sección** en mono: `§1 · CASO DE ESTUDIO`, siempre arriba del h2.
- Bordes de 1px con `--rule`; radio de 3px. Sin sombras, sin degradados, sin blur.
- **Movimiento:** solo transiciones de hover/focus (150 ms) y la demo existente. Nada de scroll-jacking ni reveals. Respetar `prefers-reduced-motion`.
- **Layout:** una columna en celular con 16px de margen lateral y sin scroll horizontal. Desde 900px, contenido a 2 columnas donde tenga sentido (texto + diagrama). El ancho máximo es `--maxw`.
- **Cabecera fija y fina:** `M. GILES` en mono a la izquierda; a la derecha, los links de sección y el selector ES/EN. En celular, un botón de menú con `aria-expanded` y la etiqueta traducida.

---

## 3. Arquitectura de componentes

```
src/app/[locale]/page.tsx          → Server Component; arma las secciones
src/components/layout/Header.tsx   → cliente (solo por el menú móvil)
src/components/layout/Footer.tsx   → servidor
src/components/sections/
  Hero.tsx                (servidor)
  CaseNexindu.tsx         (servidor; incluye <NexinduDemo/> con dynamic ssr:false desde un wrapper cliente)
  HowIWork.tsx            (servidor)
  OtherProjects.tsx       (servidor)
  Career.tsx              (servidor)
  Education.tsx           (servidor)
  Contact.tsx             (cliente, por el formulario)
src/components/diagrams/
  Flow.tsx                → componente genérico de flujo en HTML/CSS (ver abajo)
  RagFlow.tsx, RoutingFlow.tsx, AgentFlow.tsx
src/components/ui/SectionLabel.tsx, Tag.tsx, Button.tsx (estilos con CSS Modules)
```

- Por defecto, todo es **Server Component**, con `getTranslations`. `'use client'` va solo en Header, Contact y el wrapper de la demo.
- **Los diagramas se hacen en HTML/CSS, no en SVG ni en imagen:** una `<ol>` de nodos con flechas en CSS. Son horizontales desde 900px y verticales en celular. Así el texto es real, se traduce, lo leen los lectores de pantalla y se adapta solo. Cada diagrama lleva un `<figure>` con un `<figcaption>` que lo resume en una frase.
- Los nodos "clave" (entrada y salida) usan borde `--accent`; el resto, `--rule-strong`. Las ramas (routing) se hacen con una grilla de 2 columnas debajo del clasificador.
- Los CTA son `<a href="#nexindu">`, no `<button>` con JS.

---

## 4. Estructura y textos finales (ES / EN)

> Los textos van en `src/messages/es.json` y `en.json`. Borrá las claves viejas que ya no se usen.
> Tono: sobrio, técnico, en primera persona, sin adjetivos de marketing ("innovador", "potente", "de vanguardia", "seamless").

### Header
- Links: `Caso NexIndu` / `NexIndu case` · `Método` / `How I work` · `Trayectoria` / `Career` · `Contacto` / `Contact` · `CV` (descarga el PDF del idioma)

### Hero (`#top`)
- Metadato (mono): `DOC-001 · Applied AI Engineer · Rev. 2026-11` (igual en los dos idiomas)
- H1: ES **IA que se puede auditar, para manufactura regulada.** · EN **Auditable AI for regulated manufacturing.**
- Bajada:
  - ES: "Diseño y construyo software con IA para plantas reguladas: RAG con fuentes citadas, trazabilidad completa y firma electrónica según 21 CFR Part 11. Lo respaldan más de 13 años trabajando dentro de plantas industriales."
  - EN: "I design and build AI software for regulated plants: RAG with cited sources, full traceability and electronic signatures under 21 CFR Part 11 — backed by 13+ years working inside industrial plants."
- Etiquetas (mono, separadas por ·): `RAG · LLMs · Orquestación multiagente · GxP · 21 CFR Part 11` / `RAG · LLMs · Multi-agent orchestration · GxP · 21 CFR Part 11`
- CTAs: principal `Ver caso NexIndu` / `See the NexIndu case` (→ `#nexindu`); secundario `Descargar CV (PDF)` / `Download CV (PDF)`; link de texto `LinkedIn`.
- Disponibilidad (mono, chica): ES "Disponible para trabajo remoto · part-time o full-time" · EN "Open to remote work · part-time or full-time"
- Debajo, una **línea RAG resumida** (versión mini de `RagFlow`): `documento → embeddings locales → pgvector + RLS → Gemini → respuesta con citas` / `document → local embeddings → pgvector + RLS → Gemini → answer with citations`
- **Sin foto en el hero.** La foto va chica en Contacto.

### §1 · Caso de estudio: NexIndu (`#nexindu`)
- Etiqueta: `§1 · CASO DE ESTUDIO` / `§1 · CASE STUDY`
- H2: `NexIndu — CMMS/EAM con IA para plantas reguladas` / `NexIndu — AI-powered CMMS/EAM for regulated plants`
- Metadatos (mono): `Estado: pre-lanzamiento · Proyecto propio, desarrollado en mi tiempo libre · nexindu.com.ar` / `Status: pre-launch · Personal project, built in my own time · nexindu.com.ar` (con link a https://www.nexindu.com.ar)
- **Problema**
  - ES: "En una planta regulada, cada intervención de mantenimiento genera registros que tienen que ser trazables, firmados y consultables durante años. Un asistente de IA genérico no sirve en ese contexto: no cita de dónde saca la respuesta, no deja un registro auditable y obliga a mandar la documentación a servicios externos."
  - EN: "In a regulated plant, every maintenance task produces records that must be traceable, signed and searchable for years. A generic AI assistant doesn't fit that context: it doesn't cite where its answers come from, leaves no auditable trail and requires sending documentation to external services."
- **Enfoque** (4 líneas, cada una con su etiqueta en mono):
  - `RAG` — ES "Búsqueda semántica sobre pgvector con embeddings multilingües calculados localmente (ONNX, 384 dimensiones)." · EN "Semantic search on pgvector with multilingual embeddings computed locally (ONNX, 384 dimensions)."
  - `ROUTING` — ES "Unas 40 intenciones se resuelven de forma determinista; el resto va al LLM (Gemini), que responde citando fuentes." · EN "About 40 intents are resolved deterministically; everything else goes to the LLM (Gemini), which answers with cited sources."
  - `PART 11` — ES "Firma electrónica con reautenticación y passkeys, auditoría inmutable con cadena de hash y bajas solo lógicas." · EN "Electronic signatures with re-authentication and passkeys, an immutable hash-chained audit trail and soft deletes only."
  - `LLMOPS` — ES "Evaluaciones automáticas de prompts, modelo de respaldo, registro de uso y presupuesto de IA por empresa." · EN "Automated prompt evaluations, a fallback model, usage logging and a per-company AI budget."

- **Diagrama 1 · Flujo RAG** (`RagFlow`)
  - Fila "Indexación" / "Indexing": `Documento de planta` → `Fragmentación` → `Embeddings locales · ONNX · 384 dim` → `pgvector · aislado por empresa (RLS)`
  - EN: `Plant document` → `Chunking` → `Local embeddings · ONNX · 384-dim` → `pgvector · per-company isolation (RLS)`
  - Fila "Consulta" / "Query": `Pregunta` → `Embedding local` → `Búsqueda por similitud` → `Gemini + fragmentos recuperados` → `Respuesta con citas`
  - EN: `Question` → `Local embedding` → `Similarity search` → `Gemini + retrieved chunks` → `Answer with citations`
  - Pie de figura:
    - ES: "La indexación es local: los documentos no salen del sistema para generar embeddings. Al modelo solo llegan los fragmentos necesarios para responder, y cada respuesta indica su fuente."
    - EN: "Indexing runs locally: documents never leave the system to be embedded. The model only receives the chunks needed to answer, and every answer cites its source."
  - Redacción confirmada por Miguel (2026-11-12). Los fragmentos recuperados **sí** se envían a Gemini: nunca escribas "los documentos nunca salen del sistema" sin este matiz.

- **Diagrama 2 · Enrutamiento híbrido** (`RoutingFlow`)
  - `Consulta del usuario` → `Clasificador de intención` → dos ramas:
    - Rama A: `~40 intenciones conocidas` → `Resolución determinista · consulta directa a datos, sin LLM`
    - Rama B: `Resto de las consultas` → `LLM (Gemini) + RAG · responde citando fuentes` → `Modelo de respaldo si falla`
  - Barra transversal abajo (mono): `Registro de uso · Presupuesto de IA por empresa · Evaluaciones automáticas de prompts`
  - EN: `User query` → `Intent classifier` → A: `~40 known intents` → `Deterministic handling · direct data query, no LLM`; B: `All other queries` → `LLM (Gemini) + RAG · answers with cited sources` → `Fallback model on failure`; barra: `Usage logging · Per-company AI budget · Automated prompt evaluations`
  - Pie de figura:
    - ES: "Lo predecible se resuelve sin LLM: es más rápido, más barato y da siempre el mismo resultado. El LLM queda para lo que de verdad necesita lenguaje."
    - EN: "Predictable requests skip the LLM: faster, cheaper and always reproducible. The LLM is reserved for what actually needs language."

- **Tres bloques** (grilla de 3 columnas en escritorio, 1 en celular; cada uno con un título en mono y una lista):
  - `CUMPLIMIENTO · 21 CFR PART 11` / `COMPLIANCE · 21 CFR PART 11`: firma electrónica con reautenticación y passkeys · auditoría inmutable con cadena de hash · bajas solo lógicas, nada se borra físicamente / electronic signatures with re-authentication and passkeys · immutable, hash-chained audit trail · soft deletes only, nothing is physically erased
  - `SEGURIDAD` / `SECURITY`: multi-tenant con Row Level Security en PostgreSQL · permisos por columna · Content Security Policy estricta · SSDLC documentado · preparado para pentest / multi-tenant with PostgreSQL Row Level Security · column-level permissions · strict Content Security Policy · documented SSDLC · pentest-ready
  - `LLMOPS`: evaluaciones automáticas de prompts · modelo de respaldo · registro de uso · presupuesto de IA por empresa / automated prompt evaluations · fallback model · usage logging · per-company AI budget
- **Demo:** `<NexinduDemo />` dentro de un marco con borde `--rule` y el pie "Demo animada con datos ficticios." / "Animated demo with sample data." Verificá que la demo se vea bien sobre el fondo claro; si choca, enmarcala con fondo `--surface`.
- **Stack** (etiquetas en mono): `Next.js · React · TypeScript · Supabase / PostgreSQL · pgvector · Gemini API · Vercel · GitHub Actions · 6 idiomas` (EN: `6 languages`). **Sin Python.**
- CTA: `Visitar nexindu.com.ar` / `Visit nexindu.com.ar`

### §2 · Cómo trabajo (`#metodo`)
- Etiqueta: `§2 · MÉTODO` / `§2 · HOW I WORK`
- H2: `Agentes de IA en paralelo, con controles de ingeniería` / `Parallel AI agents, with engineering controls`
- Intro:
  - ES: "Uso varios agentes de IA a la vez, pero con las mismas reglas que en una planta regulada: cada uno trabaja aislado, nada se integra sin revisión y la aprobación final la da una persona."
  - EN: "I run several AI agents at once, under the same rules as a regulated plant: each one works in isolation, nothing merges without review, and final approval comes from a person."
- Diagrama `AgentFlow` (4 pasos numerados; el último con borde `--ok`):
  1. `Ejecución en paralelo` — "Cada agente trabaja en su propia rama aislada." / `Parallel execution` — "Each agent works on its own isolated branch."
  2. `Revisión cruzada` — "El trabajo de un agente lo revisa otro." / `Cross-review` — "One agent's work is reviewed by another."
  3. `Verificación adversarial` — "Un agente intenta refutar o romper el cambio antes de aceptarlo." / `Adversarial verification` — "An agent tries to refute or break the change before it's accepted."
  4. `Aprobación humana` — "Reviso y apruebo yo. Nada se integra sin esa firma." / `Human approval` — "I review and sign off. Nothing merges without it."
- Pie de figura:
  - ES: "Es el principio de doble verificación de las BPF, aplicado al desarrollo de software."
  - EN: "It's the GMP four-eyes principle, applied to software development."

### §3 · Otros proyectos (`#proyectos`)
- Etiqueta: `§3 · OTROS PROYECTOS` / `§3 · OTHER PROJECTS`. Aclaración (mono): "Proyectos propios" / "Personal projects".
- **NexKio**, con la etiqueta `En uso en 4 kioscos` / `In use at 4 kiosks`:
  - ES: "Punto de venta offline-first para kioscos: sigue vendiendo aunque se corte internet." · viñetas: venta con lector de códigos de barras · inventario, fiado y reportes · PWA que sincroniza al volver la conexión
  - EN: "Offline-first point of sale for kiosks: keeps selling even when the internet drops." · barcode-scanner checkout · inventory, store credit and reports · PWA that syncs when the connection returns
- **NexQuipu**, con la etiqueta `Usada por 3 familias` / `Used by 3 families`:
  - ES: "Finanzas personales con análisis por IA de los resúmenes de tarjeta." · lee el resumen en PDF y categoriza los gastos · detecta suscripciones y gastos ocultos · alertas con notificaciones push
  - EN: "Personal finance with AI analysis of credit-card statements." · reads the PDF statement and categorizes spending · detects subscriptions and hidden charges · push-notification alerts
- **NexPulse** y **NexPlay** en una fila compacta, de una línea cada uno:
  - NexPulse: ES "Reloj de ciegas para torneos de póker caseros, con control remoto P2P por WebRTC." / EN "Blind timer for home poker tournaments, with P2P remote control over WebRTC."
  - NexPlay: ES "Juegos de mesa online en tiempo real para jugar en familia (Supabase Realtime)." / EN "Real-time online board games for family play (Supabase Realtime)."
- Links: NexPulse → `https://pokerpulse.vercel.app` (repo: `https://github.com/Kerberosmdq/PokerPulse`), NexPlay → `https://nex-play-one.vercel.app` (repo: `https://github.com/Kerberosmdq/NexPlay`). URLs confirmadas por Miguel (2026-11-12). NexKio y NexQuipu no tienen URL pública: no inventes ninguna.
- Logos: usar los de `public/images/Projects/` a 48px, optimizados con `next/image`.

### §4 · Trayectoria: de planta a IA (`#trayectoria`)
- Etiqueta: `§4 · TRAYECTORIA` / `§4 · CAREER`
- H2: `De planta a IA` / `From the plant floor to AI`
- Párrafo:
  - ES: "Trece años diagnosticando fallas en planta me enseñaron a trabajar con evidencia, a documentar cada intervención y a respetar procedimientos validados. Hoy aplico ese mismo criterio al software con IA: que cada respuesta tenga una fuente, cada cambio quede registrado y cada decisión crítica la firme una persona."
  - EN: "Thirteen years troubleshooting on the plant floor taught me to work from evidence, document every intervention and follow validated procedures. I apply the same standard to AI software: every answer has a source, every change is recorded, and every critical decision is signed off by a person."
- Línea de tiempo (vertical; años en mono a la izquierda):
  - `2013 – 2017` · **Técnico Frigorista Industrial** / Industrial Refrigeration Technician · Coiron — "Lideré equipos de montaje de cámaras frigoríficas industriales; refrigeración, electricidad y neumática." / "Led installation crews for industrial cold rooms; refrigeration, electrical and pneumatic systems."
  - `2017 – hoy` / `2017 – present` · **Técnico de Mantenimiento y Automatización** / Maintenance & Automation Technician · B.Braun Medical Argentina, Mar del Plata — "Mantenimiento y automatización (PLC) de líneas de producción en una planta farmacéutica regulada (GxP). Diagnóstico y resolución de fallas críticas. Mejora continua con Lean/5S." / "Maintenance and PLC automation of production lines in a GxP-regulated pharmaceutical plant. Diagnosis and resolution of critical failures. Continuous improvement with Lean/5S."
  - `2023 – hoy` / `2023 – present` · **Desarrollo de software propio** / Independent software development — "En mi tiempo libre: NexIndu, NexKio, NexQuipu, NexPulse y NexPlay." / "In my own time: NexIndu, NexKio, NexQuipu, NexPulse and NexPlay." (**Esta entrada NO menciona a B.Braun.**)
  - `2026` · **Diplomado Python & Inteligencia Artificial** / Diploma in Python & Artificial Intelligence · UTN FRD + Instituto Linux
- El orden visual es de lo más antiguo a lo más nuevo, para que se lea como un recorrido.

### §5 · Formación (`#formacion`)
- Etiqueta: `§5 · FORMACIÓN` / `§5 · EDUCATION`
- Tarjeta destacada (borde `--accent`):
  - **Diplomado Python & Inteligencia Artificial** — UTN Facultad Regional Delta + Instituto Linux · 144 h · Calificación 100/100 · Noviembre 2026
  - EN: **Diploma in Python & Artificial Intelligence** — UTN Facultad Regional Delta + Instituto Linux · 144 hours · Grade 100/100 · November 2026
  - No hay URL de verificación (Miguel solo tiene el PDF que le llegó por mail). **No pongas link y no publiques el PDF del certificado**: puede contener el DNI u otros datos personales.
- **Técnico Electromecánico** / Electromechanical Technician — Instituto Industrial Pablo Tavelli · 2009
- Idiomas: Español (nativo) · Inglés (intermedio) / Spanish (native) · English (intermediate)

### §6 · Contacto (`#contacto`)
- Etiqueta: `§6 · CONTACTO` / `§6 · CONTACT`
- H2: `Hablemos` / `Let's talk`
- ES: "Busco roles de Applied AI o de software para manufactura regulada, en remoto." · EN: "I'm looking for Applied AI or regulated-manufacturing software roles, remote."
- Foto chica (`/images/miguel-profile.png`, 72px, redondeada) junto al nombre.
- Lista en mono: email con botón "Copiar" / "Copy" · LinkedIn · GitHub · WhatsApp · teléfono (`PHONE_DISPLAY`). **Cada link de ícono lleva `aria-label`.**
- Formulario: el mismo server action. Labels visibles (no solo placeholder), mensajes de estado en `aria-live="polite"`.
- Se quita "Respondo en menos de 24 h" (es una promesa que nadie verificó).

### Footer
- `© 2026 Miguel Giles · DOC-001 Rev. 2026-11` y los links de contacto. Sin "Forjado con…".

---

## 5. Metadata, SEO y CV

- **`layout.tsx`, `generateMetadata`:**
  - title ES: `Miguel Giles — Applied AI Engineer · Software para manufactura regulada (GxP)`
  - title EN: `Miguel Giles — Applied AI Engineer · Software for regulated manufacturing (GxP)`
  - description ES: "Applied AI Engineer: RAG, LLMs y orquestación multiagente para manufactura regulada (GxP, 21 CFR Part 11). Creador de NexIndu. 13+ años en mantenimiento y automatización industrial."
  - description EN: "Applied AI Engineer: RAG, LLMs and multi-agent orchestration for regulated manufacturing (GxP, 21 CFR Part 11). Creator of NexIndu. 13+ years in industrial maintenance and automation."
  - keywords: Applied AI Engineer, RAG, LLM, pgvector, multi-agent, GxP, 21 CFR Part 11, CMMS, NexIndu, Mar del Plata
  - `alternates.languages`: agregar `'x-default': ${SITE_URL}/es`
  - `<html lang>` según el locale (ya está así).
- **JSON-LD:** `jobTitle: 'Applied AI Engineer'`, `knowsAbout: ['Retrieval-Augmented Generation', 'Large Language Models', 'pgvector', 'Multi-agent orchestration', 'GxP', '21 CFR Part 11', 'CMMS', 'PLC automation', 'Next.js', 'TypeScript', 'PostgreSQL']`. Agregar `hasCredential` con el diplomado. No incluir el teléfono en el JSON-LD.
- **`opengraph-image.tsx`:** usar el estilo A (fondo papel, título en tinta, metadato mono en azul), localizado con `params.locale`. Texto: "Miguel Giles" + el H1 del hero en el idioma que corresponda.
- **`sitemap.ts`:** `lastModified` = fecha del deploy. `robots.ts` queda como está.
- **`/[locale]/cv` + PDFs:** rehacer el contenido con el mismo posicionamiento.
  - Rol: "Applied AI Engineer · Software para manufactura regulada (GxP · 21 CFR Part 11)"
  - Perfil:
    - ES: "Applied AI Engineer con más de 13 años en mantenimiento y automatización industrial, 9 de ellos en una planta farmacéutica regulada (GxP). Creador de NexIndu, un CMMS/EAM con IA para plantas reguladas: RAG sobre pgvector con embeddings locales, enrutamiento híbrido determinista/LLM, LLMOps y controles de 21 CFR Part 11. Busco roles remotos de Applied AI o de software para manufactura regulada."
    - EN: "Applied AI Engineer with 13+ years in industrial maintenance and automation, 9 of them in a GxP-regulated pharmaceutical plant. Creator of NexIndu, an AI-powered CMMS/EAM for regulated plants: RAG on pgvector with local embeddings, hybrid deterministic/LLM routing, LLMOps and 21 CFR Part 11 controls. Looking for remote Applied AI or regulated-manufacturing software roles."
  - Las mismas secciones que la web, en una columna A4 de hasta 2 páginas. El teléfono queda.
  - Habilidades: IA (RAG, pgvector, embeddings ONNX, Gemini API, LLMOps, orquestación multiagente) · Desarrollo (Next.js, React, TypeScript, Supabase/PostgreSQL, Vercel, GitHub Actions) · Regulado (GxP, 21 CFR Part 11, ALCOA+, auditoría, firma electrónica) · Industria (PLC/automatización, Lean/5S, neumática, electricidad, refrigeración). Python se menciona **solo** en Formación.
  - Regenerar `public/cv/Miguel_Giles_CV_{ES,EN}.pdf` con Chrome headless, según el README y ADR-005. Revisar que el texto se pueda seleccionar y que entre en 2 páginas.
- Actualizar `README.md` y `package.json` (`description`) con el nuevo posicionamiento.

---

## 6. Accesibilidad y rendimiento (criterios de aceptación)

- Un solo `h1`; jerarquía h2 → h3 sin saltos. Las secciones usan `<section aria-labelledby>`.
- Contraste AA en los dos modos. Foco visible (outline de 2px con `--accent`) en todo lo interactivo.
- Los íconos-link tienen `aria-label`. El menú móvil tiene `aria-expanded`, `aria-controls`, cierra con Esc y devuelve el foco.
- Las etiquetas de interfaz se traducen (`skip link`, menú, logo).
- Sin scroll horizontal a 320px. Los objetivos táctiles miden al menos 44px.
- Lighthouse en celular: Performance ≥ 90, Accessibility 100, SEO 100. La demo se carga con `dynamic` y solo cuando está cerca del viewport (IntersectionObserver), para no afectar el LCP.
- Optimizar `public/demo/nexindu/logo.png` y `public/images/Projects/nexindu.png` (1,5 MB cada uno) a WebP de menos de 100 KB, o al tamaño real que se muestra.

---

## 7. Orden de trabajo (un commit por fase, en español, formato `tipo: descripción`)

1. `chore: base visual de documento técnico` — tokens, fuentes, reset, Header, Footer, `SectionLabel`, `Tag`, `Button`; borrar los componentes viejos.
2. `feat: hero y caso de estudio NexIndu` — Hero, CaseNexindu, `Flow`, RagFlow, RoutingFlow, la demo enmarcada.
3. `feat: método multiagente, proyectos, trayectoria y formación`
4. `feat: contacto accesible`
5. `feat: metadata, JSON-LD, OG y sitemap del nuevo posicionamiento`
6. `feat: CV y PDFs como Applied AI Engineer`
7. `chore: limpieza de dependencias, assets y documentación` — incluye un ADR nuevo `docs/decisions/ADR-007-reposicionamiento-applied-ai.md` (diseño A, diagramas en HTML/CSS, Server Components).

**Verificación después de cada fase:** `pnpm lint`, `npx tsc --noEmit` y `pnpm build` sin errores. Además, preview en `/es` y `/en` a 375px y a 1280px, en modo claro y oscuro. Al final: Lighthouse en celular, grep de `B.Braun` (tiene que aparecer **solo** en trayectoria y CV), grep de `Python` (solo en formación y diplomado), grep de `Full Stack` (no tiene que quedar ninguno).

**No hacer:** push, abrir PR ni mergear a `main` sin que Miguel lo pida.

---

## 8. Pendientes

No hay pendientes: los tres [CONFIRMAR] se resolvieron el 2026-11-12. Si aparece un dato que falte, frená y preguntá.

## 9. Puntos de control con Opus

Al terminar las fases **2** (hero + caso NexIndu), **6** (CV y PDFs) y **7** (cierre), frená y reportá:
- los commits hechos, con su hash
- el resultado de lint, tsc y build
- capturas a 375px y 1280px, en claro y en oscuro
- cualquier desvío del plan y su motivo

Opus revisa el diff, lo cuestiona si hace falta y da el OK para seguir. No avances de un punto de control sin ese OK, ya sea de Opus o de Miguel.

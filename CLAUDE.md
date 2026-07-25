@AGENTS.md

# Boda Gustavo & Patricia — Landing Page

## Stack
- Next.js 16.2.11 + TypeScript + Tailwind v4 (`@import "tailwindcss"`)
- React 19, App Router, `"use client"` en page.tsx
- Fuentes: Montaga (headings via `var(--font-montaga)`), Inter (botones)
- Sin base de datos, sin autenticación

## Comandos
```bash
npm run dev    # localhost:3000
npm run build  # verificar antes de pushear
```

## Despliegue
- GitHub: https://github.com/aandreskss/bodagustavoypatricia
- Vercel: https://bodagustavoypatricia.vercel.app
- Rama producción: `master`

## Arquitectura clave

### Componente C (desktop only)
`C` es el wrapper que centra el contenido Figma (1440px) en pantallas anchas:
- Outer: `hidden lg:flex absolute inset-0 justify-center`
- Inner: `relative flex-shrink-0 h-full` con `width: 1440`
- Incluye fade-in con IntersectionObserver
- **NUNCA usar `mx-auto` dentro de `absolute inset-0`** — no funciona. Usar `flex justify-center` + `flex-shrink-0`.

### Layouts responsive
Cada sección tiene dos layouts:
- **Desktop** (`hidden lg:flex/block`): dentro del componente C, posicionado con píxeles absolutos del Figma
- **Mobile** (`lg:hidden`): layout flexbox normal centrado

### Secciones y alturas
| Sección | Mobile | Desktop |
|---|---|---|
| Hero | `h-[100svh]` | `h-[1070px]` |
| Invitación | auto (bg-white) | `lg:h-[900px]` |
| Ceremonia | `h-[540px]` | `h-[900px]` |
| Hacienda + Countdown | `h-[760px]` | `h-[1147px]` |
| Hospedaje | `h-[760px]` | `h-[1094px]` |
| Dress Code | `h-[720px]` | `h-[1079px]` |
| RSVP | `h-[860px]` | `h-[2160px]` |

### Botones
Clase CSS `.btn-elegant` en `globals.css`:
- Fondo blanco, borde y texto `#8a415d`, hover rellena de `#8a415d`
- Padding via `style={{ padding: "..." }}` inline (Tailwind v4 no purga bien clases dinámicas de padding)

### Efectos
- **FallingPetals**: pétalos fijos con `@keyframes petal-fall`, posiciones hardcodeadas (sin `Math.random` para evitar hidratación)
- **FadeIn**: IntersectionObserver, usado en secciones mobile

## Imágenes
Todas en `/public/images/`. Descargadas de Figma (expiran cada 7 días).

## Pendiente
- `whatsappNumber` en page.tsx línea ~145 (variable vacía)
- `mapsUrl` en page.tsx línea ~146 (variable vacía)
- Fotos reales de hoteles (reemplazar los 2 rectángulos grises en Hospedaje)
- Re-descargar imágenes de Figma si expiran

## Fecha de boda
`2026-11-07T17:00:00` — hardcoded en `WEDDING_DATE` (línea ~6 de page.tsx)

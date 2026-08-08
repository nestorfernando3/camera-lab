# CameraLab

Laboratorio virtual de fotografía — aprende exposición, movimiento, profundidad de campo, focal, distancia y compromisos fotográficos manipulando una cámara virtual, no con quizzes.

## What it teaches / Qué enseña

- **Movimiento**: obturación como tiempo de registro (M1)
- **Apertura**: luz + profundidad de campo (M2)
- **ISO y límites tonales**: ruido, clipping de altas/bajas (M3)
- **Exposición como sistema**: stops y combinaciones equivalentes (M4)
- **Óptica y decisiones espaciales**: focal, distancia, plano de enfoque (M5)
- **Transferencia**: retos editoriales, poca luz y panning (Sandbox + C1-C3)

Cada misión evalúa *acciones fotográficas y resultados* (métricas de blur, exposición, ruido, FOV), no tests de opción múltiple, estrellas o notas.

## Architecture

- **SPA estática**: React + TypeScript + Vite, sin backend
- **3D procedural**: Three.js + React Three Fiber + drei + postprocessing — tres escenas (runner, portrait, depth) hechas solo con primitivas
- **Física determinista**: `src/domain/camera/*` (exposure, optics, motion, imageEffects, simulate) pura TS, testeable sin WebGL
- **Evaluación**: `src/domain/learning/evaluateMission.ts` sobre métricas de captura, soporta 6 tipos de regla
- **Estado**: Zustand (appStore, labStore, progressStore)
- **Persistencia**: localStorage `cameralab:v1:progress` + IndexedDB `cameralab/learning-events`
- **PWA**: vite-plugin-pwa, precache de JS/CSS/icons, offline-first
- **i18n**: es (default) + en, paridad de claves testeada

```
src/domain/camera/  # física determinista
src/domain/learning/# misiones, evaluación, hints, mastery
src/content/        # curriculum, misiones (15 core + 3 transfer), presets, locales
src/scenes/         # SceneCanvas, sceneRegistry, 3 escenas procedurales
src/features/lab/   # controles progresivos, captura, comparación, feedback
src/features/capture/# histogram, export
src/features/progress/# persistencia + mastery
src/features/telemetry/# IndexedDB local
src/app/            # SPA, hash routing
```

## Local development

```bash
npm ci
npm run dev        # vite en http://localhost:5173
npm run typecheck
npm run lint
npm run test:run
npm run build
npm run preview    # sirve dist en 4173
```

Requiere Node LTS (22+).

## Testing

```bash
npm run test          # vitest watch
npm run test:run      # single run (usado en CI)
npm run test:e2e      # playwright (requiere npx playwright install chromium y build)
```

- Unitarias de dominio: exposure, optics, motion, imageEffects, simulate, evaluateMission, mastery, histogram, locales parity, sceneRegistry
- Componentes: App renders CameraLab
- E2E: navegación libre, misión (shutter→metrics→capture→feedback), persistencia tras reload, pages-build base path

## Production build

```bash
npm run build              # dist/ estático
VITE_BASE_PATH=/camera-lab/ npm run build  # para GitHub Pages project site
```

`dist/` es el único artefacto desplegable. Sin fetch remoto, sin fuentes remotas, sin GLB.

## GitHub Pages deployment

- Repo slug: `camera-lab`
- URL: `https://{owner}.github.io/camera-lab/`
- Workflows:
  - `.github/workflows/ci.yml` — lint + typecheck + test + build en PR/push main
  - `.github/workflows/deploy-pages.yml` — build con `VITE_BASE_PATH=/repo-name/` → upload `dist` → deploy con `actions/deploy-pages@v5`

En GitHub: Settings → Pages → Source → **GitHub Actions**.

Dominio custom: `VITE_BASE_PATH=/ npm run build` (sin cambios de código).

No hay rutas con browser history; hash `#lab/mision` evita 404 en Pages.

## Offline behavior

- Service worker (Workbox) precachea 12 entradas (~1.1 MiB) generadas por VitePWA
- Tras primera visita y cache, recargar sin red mantiene escena, controles, evaluación y progreso
- Progreso sobrevive reload vía localStorage; telemetría en IndexedDB

Prueba manual offline:
1. `npm run build && npm run preview`
2. Abrir app, completar M1.1
3. DevTools → Network → Offline → recargar
4. Abrir misión cacheada, ajustar controles, capturar → feedback y comparación siguen funcionando
5. Recargar → progreso permanece

## Privacy

- Sin backend, sin login, sin nombre/email/IP/fingerprint
- Progreso solo local (`cameralab:v1:progress`)
- Telemetría solo local (`IndexedDB cameralab/learning-events`), exporta JSON solo tras acción explícita “Exportar datos de aprendizaje”
- Imágenes exportadas son PNG locales con footer opcional, sin identidad

## Project scope / v1 exclusions

**Incluido**: 5 módulos ×3 misiones (15) + 3 desafíos transferencia + Sandbox + referencia + resumen + mastery `Sólido/En desarrollo/Por explorar` + PWA + i18n.

**Excluido** (rechazar si se pide sin revisión de scope):
backend, Supabase/Firebase, login, cloud sync, teacher dashboard, LMS, AI tutor, RAW, balance de blancos, flash, IBIS, hyperfocal, third-stop, zoom continuo, distancia continua, orientación vertical, UX móvil, feed social, portfolio, certificados, leaderboards, puntos/estrellas, analytics remoto, fuentes/3D remotos.

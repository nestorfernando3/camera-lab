# Architecture — CameraLab v1

## Principio
CameraLab es una SPA estática sin servidor. Todo ocurre en el navegador: física, evaluación, progreso, telemetría, render, export, i18n y PWA.

## Stack
- React 19 + TypeScript 5 + Vite 8
- Three.js 0.180 + @react-three/fiber 9 + @react-three/drei 10 + @react-three/postprocessing 3
- Zustand 5 (estado), i18next + react-i18next (es/en)
- Vitest 4 + @testing-library/react + jsdom + Playwright
- vite-plugin-pwa 1 (Workbox generateSW)

## Estructura
```
camera-lab/
├─ .github/workflows/ci.yml, deploy-pages.yml
├─ docs/architecture.md, pedagogy.md, simulation-model.md
├─ public/favicon.svg, icons/icon-*.png
├─ src/app/App.tsx, appStore.ts, routes.ts, styles.css
├─ src/content/curriculum.ts, missions.ts (15+3), presets.ts, locales/*.json
├─ src/domain/camera/{constants,types,exposure,optics,motion,imageEffects,simulate}
├─ src/domain/learning/{types,evaluateMission,hints,mastery}
├─ src/scenes/{SceneCanvas, sceneRegistry, shared/*, portrait/*, runner/*, depth/*}
├─ src/features/lab/*, capture/*, progress/*, telemetry/*, onboarding/*, sandbox/*, reference/*, summary/*, settings/*
├─ src/shared/{components,hooks/utils}
└─ tests/e2e/*
```

## Flujo de datos
```
CameraSettings → simulateCapture() → {exposure, optics, motion, effects, metrics}
                                          ↓
MissionDefinition + CaptureSnapshot[] → evaluateMission() → MissionEvaluation {passed, ruleResults}
                                          ↓
LabScreen (controles progresivos) + SceneCanvas (R3F) + FeedbackPanel (Conseguiste/Observa/Compromiso)
```

`simulateCapture` es el único punto de integración entre render y evaluación; los componentes no recalculan física.

## Estado y rutas
- `appStore` (Zustand) guarda `screen: ScreenId` + `currentMissionId`; navega con `navigate()` / `openMission()`
- Sin React Router. Hash `#lab/missionId` para deep link sin 404 en GitHub Pages (`routes.ts` sincroniza `location.hash`)
- Top bar + currículum con módulos libres (ninguno disabled, recomendado visual, nota no bloqueante si se salta prerequisito)

## Escenas
- Procedurales, sin GLB/texturas remotas
- `runner`: humano low-poly (sphere/capsule/cylinder) + pista + 3 bloques, movimiento sinusoidal (disable con reducedMotion)
- `portrait`: busto + foreground box + background box, fondo fijo 10m
- `depth`: objetos en 1m, 2m, 4m, plano 10m; único con múltiples focus targets
- `SceneCanvas` usa `<Canvas gl={{preserveDrawingBuffer:true}}>` para captura fiable, + `render-metrics` hidden div para E2E

## Persistencia y telemetría
- `localStorage cameralab:v1:progress` (ProgressState v1): completedMissionIds, completedModuleIds, mastery, lastScreen, locale, reducedMotion, soundEnabled
- `IndexedDB cameralab/learning-events v1`: eventos {mission_started, settings_changed, capture_taken, hint_opened, mission_completed, mission_repeated}
- Inserción IndexedDB nunca bloquea misión; export solo vía `exportTelemetry()` + descarga JSON tras acción explícita
- Reset: `resetModule()` filtra por módulo, `resetAll()` limpia localStorage + deleteDatabase con confirmación

## i18n
- `es` default, `en` fallback; `i18n.ts` registra ambos JSON
- Test de paridad recursivo en `locales.test.ts`
- Componentes usan `t(key)`; términos técnicos pueden mostrar micro-etiqueta bilingüe

## PWA
- `vite.config.ts` base = `process.env.VITE_BASE_PATH ?? "/"` (inyectado por deploy-pages.yml)
- `VitePWA({registerType:"autoUpdate", manifest:{name:"CameraLab", start_url:".", scope:".", icons:[192,512]}, workbox:{globPatterns:["**/*.{js,css,html,svg,png,ico,webmanifest}"]}})`
- `dist/` contiene `sw.js` + `workbox-*.js` + `manifest.webmanifest`; scope respeta base path

## Accesibilidad
- Controles no-WebGL alcanzables por teclado, focus visible, aria-label/pressed, no solo color
- “Reducir movimiento” quita animación runner y transiciones
- Sonido sintetizado vía Web Audio (click corto), desactivable
- Canvas tiene descripción textual adyacente del estado fotográfico; feedback describe visualmente (movimiento alto, fondo muy desenfocado)
- Zoom 200% usable; `<768px` muestra aviso no soportado antes de cargar WebGL

## Build y deploy
- `npm run build` → `tsc -b && vite build` → `dist/`
- CI: `npm ci && npm run lint && npm run typecheck && npm run test:run && npm run build`
- Pages: `VITE_BASE_PATH=/repo/ npm run build` → `actions/upload-pages-artifact` path `./dist` → `actions/deploy-pages@v5`

## Reglas de archivo
- Archivos <250 líneas; >300 se divide por responsabilidad
- Sin `fetch`/`https` en `src` (excepto web search); assets locales

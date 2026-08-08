# CameraLab v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Every task is independently reviewable and uses checkbox (`- [ ]`) tracking.

**Goal:** Build CameraLab v1 as a fully static, bilingual, offline-capable virtual photography laboratory that teaches exposure, motion, depth of field, focal length, distance, and photographic trade-offs through direct manipulation rather than quizzes.

**Architecture:** CameraLab is a single-page React application built with Vite and TypeScript. All camera physics, mission evaluation, progression, feedback, persistence, telemetry, rendering, export, and localization run entirely in the browser. Three.js/React Three Fiber renders three procedural 3D scenes; deterministic domain functions calculate exposure, field of view, depth-of-field blur, motion blur, noise, and clipping. There is no application server, database, authentication system, remote API, or runtime AI dependency.

**Tech Stack:** React + TypeScript + Vite + Three.js + React Three Fiber + `@react-three/drei` + `@react-three/postprocessing` + Zustand + i18next/react-i18next + Vitest + React Testing Library + Playwright + vite-plugin-pwa + ESLint.

---

## 0. Non-negotiable product constraints

These requirements override convenience decisions made during implementation.

1. CameraLab v1 must build to static files in `dist/`.
2. The complete production application must deploy to GitHub Pages from GitHub Actions.
3. No backend, serverless function, database, authentication provider, API key, remote AI call, analytics SDK, or runtime cloud dependency is allowed.
4. Once installed/cached, all essential learning activities must run offline.
5. Student progress is local only.
6. Pedagogical telemetry is local only and is exported only after an explicit user action.
7. No personally identifying data is requested or stored.
8. The student can navigate freely. The application recommends a path but never hard-locks a module.
9. Assessment is based on photographic actions and outcomes, not multiple-choice tests, grades, stars, or numeric scores.
10. CameraLab uses progressive disclosure. A control is introduced only when the learner needs it.
11. The visual language is a simplified professional creative tool, not a game.
12. CameraLab v1 is designed primarily for desktop/laptop. Tablet is best-effort. Mobile is not a v1 target.
13. CameraLab must support Spanish and English from the first production release.
14. CameraLab teaches trade-offs rather than absolute photographic rules.
15. The simulation target is pedagogical realism, not full optical or sensor simulation.
16. The internal simulation/evaluation layer must be deterministic and fully testable without WebGL.
17. CameraLab uses one fixed virtual full-frame sensor: 36 mm × 24 mm.
18. Exposure mode is Manual only.
19. Camera controls use real, discrete photographic values and full stops only.
20. Apertures: `f/1.4, f/2, f/2.8, f/4, f/5.6, f/8, f/11, f/16`.
21. Shutter speeds: `1/15, 1/30, 1/60, 1/125, 1/250, 1/500, 1/1000, 1/2000`.
22. ISO values: `100, 200, 400, 800, 1600, 3200`.
23. Focal lengths: `24, 35, 50, 85, 135 mm`.
24. Subject distances are discrete: `1, 2, 4, 8 m`; individual scenes may expose only a subset.
25. Background distance is fixed per scene.
26. White balance, flash, RAW/JPEG processing, editing, sensor-size switching, image stabilization, hyperfocal distance, camera shake, and portrait/landscape orientation switching are outside v1.
27. Panning is allowed only as an advanced optional challenge.
28. Preview is live; taking a photo is a deliberate action.
29. Comparison complexity increases progressively: one capture → guided A/B → up to three attempts → up to five in advanced challenges.
30. Progressive hints never reveal an exact setting on the first hint.
31. A mission can have multiple valid solutions.
32. Final feedback explains consequences and trade-offs; it does not label a photographic decision as universally “wrong.”
33. Each module ends with a concise evidence-based summary.
34. CameraLab ends with transfer challenges and a domain profile such as `Sólido / En desarrollo / Por explorar`, not an exam or certificate.
35. Images can be exported optionally. CameraLab does not maintain an internal student portfolio.
36. A compact reference/cheat sheet is available outside the main learning flow.
37. Presets exist only in Sandbox/comparison, never as mission-solving shortcuts.
38. The histogram is an advanced optional tool and is computed from a capture, not shown as a required beginner control.
39. Shutter sound is optional and synthesized locally; the experience never depends on sound.
40. A presentation/demo display option may exist, but there is no teacher dashboard, gradebook, LMS, or class-management system.

---

## 1. Repository contract

Use one repository with slug:

```text
camera-lab
```

Expected production URL when hosted as a project site:

```text
https://{github-owner}.github.io/camera-lab/
```

Do not hard-code the GitHub owner. The build workflow injects the repository base path.

### Required top-level structure

```text
camera-lab/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy-pages.yml
├── docs/
│   ├── architecture.md
│   ├── pedagogy.md
│   └── simulation-model.md
├── public/
│   ├── favicon.svg
│   └── icons/
│       ├── icon-192.png
│       └── icon-512.png
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── appStore.ts
│   │   ├── routes.ts
│   │   └── styles.css
│   ├── content/
│   │   ├── curriculum.ts
│   │   ├── missions.ts
│   │   ├── presets.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── es.json
│   ├── domain/
│   │   ├── camera/
│   │   │   ├── constants.ts
│   │   │   ├── types.ts
│   │   │   ├── exposure.ts
│   │   │   ├── optics.ts
│   │   │   ├── motion.ts
│   │   │   ├── imageEffects.ts
│   │   │   └── index.ts
│   │   └── learning/
│   │       ├── types.ts
│   │       ├── evaluateMission.ts
│   │       ├── hints.ts
│   │       ├── mastery.ts
│   │       └── index.ts
│   ├── features/
│   │   ├── lab/
│   │   │   ├── LabScreen.tsx
│   │   │   ├── CameraControls.tsx
│   │   │   ├── CaptureButton.tsx
│   │   │   ├── MissionPanel.tsx
│   │   │   ├── HintPanel.tsx
│   │   │   ├── FeedbackPanel.tsx
│   │   │   ├── ComparisonTray.tsx
│   │   │   └── labStore.ts
│   │   ├── onboarding/
│   │   │   ├── Onboarding.tsx
│   │   │   └── diagnostic.ts
│   │   ├── progress/
│   │   │   ├── progressStore.ts
│   │   │   ├── persistence.ts
│   │   │   └── ProgressOverview.tsx
│   │   ├── telemetry/
│   │   │   ├── db.ts
│   │   │   ├── telemetry.ts
│   │   │   └── exportTelemetry.ts
│   │   ├── capture/
│   │   │   ├── captureCanvas.ts
│   │   │   ├── histogram.ts
│   │   │   └── exportImage.ts
│   │   ├── reference/
│   │   │   └── ReferenceSheet.tsx
│   │   ├── sandbox/
│   │   │   └── SandboxScreen.tsx
│   │   ├── summary/
│   │   │   ├── ModuleSummary.tsx
│   │   │   └── FinalMastery.tsx
│   │   └── settings/
│   │       └── SettingsPanel.tsx
│   ├── scenes/
│   │   ├── SceneCanvas.tsx
│   │   ├── sceneRegistry.ts
│   │   ├── shared/
│   │   │   ├── Environment.tsx
│   │   │   ├── PedagogicalCamera.tsx
│   │   │   ├── FocusMarker.tsx
│   │   │   ├── NoiseOverlay.tsx
│   │   │   └── MotionTrail.tsx
│   │   ├── portrait/
│   │   │   └── PortraitScene.tsx
│   │   ├── runner/
│   │   │   └── RunnerScene.tsx
│   │   └── depth/
│   │       └── DepthScene.tsx
│   ├── shared/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   ├── test/
│   │   ├── setup.ts
│   │   └── fixtures.ts
│   └── main.tsx
├── tests/
│   └── e2e/
│       ├── navigation.spec.ts
│       ├── mission.spec.ts
│       ├── persistence.spec.ts
│       └── pages-build.spec.ts
├── index.html
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### File-size rule for agents

A source file should normally stay below 250 lines. If a component or domain file exceeds 300 lines, split by responsibility before adding more behavior. Avoid “god components” and “god stores.”

---

## 2. Domain model

### `src/domain/camera/types.ts`

Use these exact public types:

```ts
export type Aperture = 1.4 | 2 | 2.8 | 4 | 5.6 | 8 | 11 | 16;
export type ShutterDenominator = 15 | 30 | 60 | 125 | 250 | 500 | 1000 | 2000;
export type ISO = 100 | 200 | 400 | 800 | 1600 | 3200;
export type FocalLength = 24 | 35 | 50 | 85 | 135;
export type SubjectDistanceM = 1 | 2 | 4 | 8;

export type FocusMode = "auto-subject" | "target";

export interface CameraSettings {
  aperture: Aperture;
  shutterDenominator: ShutterDenominator;
  iso: ISO;
  focalLengthMm: FocalLength;
  subjectDistanceM: SubjectDistanceM;
  focusMode: FocusMode;
  focusTargetId: string;
  panningEnabled: boolean;
}

export interface SceneExposure {
  ev100: number;
}

export interface MotionModel {
  direction: [number, number];
  speedMps: number;
  subjectDistanceM: number;
}

export interface ExposureResult {
  cameraEv100: number;
  deltaStops: number;
  exposureMultiplier: number;
  highlightClippingRisk: number;
  shadowLossRisk: number;
}

export interface OpticsResult {
  verticalFovDeg: number;
  horizontalFovDeg: number;
  focusDistanceM: number;
  foregroundBlurPx: number;
  backgroundBlurPx: number;
}

export interface MotionResult {
  blurPx: number;
  normalizedBlur: number;
  direction: [number, number];
}

export interface ImageEffectResult {
  noiseStrength: number;
  clipping: {
    highlights: number;
    shadows: number;
  };
}
```

### `src/domain/learning/types.ts`

```ts
import type { CameraSettings } from "../camera/types";

export type MasteryLevel = "unexplored" | "developing" | "solid";
export type MissionPhase =
  | "brief"
  | "predict-by-action"
  | "explore"
  | "capture"
  | "feedback"
  | "complete";

export type MetricName =
  | "exposureDeltaAbs"
  | "motionBlurPx"
  | "backgroundMotionBlurPx"
  | "foregroundBlurPx"
  | "backgroundBlurPx"
  | "noiseStrength"
  | "highlightClippingRisk"
  | "shadowLossRisk"
  | "horizontalFovDeg"
  | "framingScale";

export interface CaptureSnapshot {
  settings: CameraSettings;
  metrics: Record<MetricName, number>;
}

export type CameraSettingName =
  | "aperture"
  | "shutterDenominator"
  | "iso"
  | "focalLengthMm"
  | "subjectDistanceM";

export type MissionRule =
  | {
      kind: "metric";
      metric: MetricName;
      operator: "<=" | ">=";
      value: number;
      weight: number;
    }
  | {
      kind: "all-retained-captures-metric";
      metric: MetricName;
      operator: "<=" | ">=";
      value: number;
      minCaptures: number;
      weight: number;
    }
  | {
      kind: "pair-metric-delta";
      metric: MetricName;
      operator: "<=" | ">=";
      value: number;
      weight: number;
    }
  | {
      kind: "setting-stop-delta";
      setting: "aperture" | "shutterDenominator" | "iso";
      minStops: number;
      weight: number;
    }
  | {
      kind: "distinct-setting-count";
      setting: CameraSettingName;
      minDistinct: number;
      weight: number;
    }
  | {
      kind: "framing-similarity";
      maxRelativeDifference: number;
      minCaptures: 2;
      weight: number;
    };

export interface MissionDefinition {
  id: string;
  moduleId: string;
  sceneId: "runner" | "portrait" | "depth";
  titleKey: string;
  briefKey: string;
  intentKey: string;
  enabledControls: Array<
    | "aperture"
    | "shutter"
    | "iso"
    | "focalLength"
    | "subjectDistance"
    | "focusTarget"
    | "panning"
  >;
  initialSettings: CameraSettings;
  sceneEv100: number;
  rules: MissionRule[];
  hintKeys: [string, string, string];
  maxVisibleCaptures: 1 | 2 | 3 | 5;
  concepts: Array<
    "shutter" | "aperture" | "iso" | "stops" | "focal-length" | "distance" | "focus" | "trade-offs"
  >;
}

export interface RuleEvaluation {
  ruleIndex: number;
  actual: number | number[];
  passed: boolean;
  weight: number;
}

export interface MissionEvaluation {
  passed: boolean;
  ruleResults: RuleEvaluation[];
  strengths: string[];
  tradeOffs: string[];
  nextHintKey?: string;
}
```

No mission may contain an exact “correct camera settings” answer. Missions define outcome constraints only.

---

## 3. Simulation formulas

All formulas below live in pure TypeScript and must not import React or Three.js.

### 3.1 Exposure

Use:

```ts
cameraEv100 = log2((aperture ** 2) / shutterSeconds) - log2(iso / 100)
deltaStops = sceneEv100 - cameraEv100
exposureMultiplier = 2 ** deltaStops
```

Interpretation:

- `deltaStops ≈ 0`: nominal exposure.
- positive `deltaStops`: image trends brighter / overexposed.
- negative `deltaStops`: image trends darker / underexposed.

Clamp the rendering exposure multiplier to `[0.125, 8]`, but do not clamp the domain `deltaStops`.

Initial clipping-risk approximation:

```ts
highlightClippingRisk = clamp01((deltaStops - 0.5) / 2.5)
shadowLossRisk = clamp01((-deltaStops - 0.5) / 2.5)
```

Mission evaluation should usually treat `abs(deltaStops) <= 0.75` as broadly usable exposure unless a mission intentionally asks for another result.

### 3.2 Field of view

Fixed sensor:

```ts
SENSOR_WIDTH_MM = 36
SENSOR_HEIGHT_MM = 24
```

Formula:

```ts
fovRad = 2 * atan(sensorDimensionMm / (2 * focalLengthMm))
```

Expose horizontal and vertical FOV in degrees.

### 3.3 Depth-of-field pedagogical model

Use a thin-lens-derived blur-circle approximation to calculate relative blur for known object distances.

For focal length `f` in millimetres and focus/object distances converted to millimetres:

```ts
imageDistance = (f * objectDistance) / (objectDistance - f)
apertureDiameter = f / fNumber
blurCircleMm =
  apertureDiameter *
  abs(objectImageDistance - focusImageDistance) /
  objectImageDistance
blurPx = (blurCircleMm / SENSOR_WIDTH_MM) * renderWidthPx
```

The render effect does not need to be a physically exact lens simulation. The domain metric must preserve these monotonic relationships:

1. smaller f-number → greater out-of-focus blur;
2. longer focal length at fixed position → greater blur;
3. closer focus distance → shallower effective depth of field;
4. object at focus distance → approximately zero blur.

The Three.js post-processing layer maps the domain blur magnitude to `DepthOfField`/bokeh parameters.

### 3.4 Motion blur

For lateral movement:

```ts
angularVelocityRadPerSec = speedMps / subjectDistanceM
angularTravel = angularVelocityRadPerSec * shutterSeconds
sensorTravelMm = focalLengthMm * angularTravel
blurPx = (sensorTravelMm / SENSOR_WIDTH_MM) * renderWidthPx
```

Clamp the visual trail length, not the domain `blurPx`.

This is sufficient for v1 because the learning target is the causal relationship:

```text
subject speed ↑ + shutter time ↑ + focal length ↑ + subject distance ↓
→ recorded movement blur ↑
```

### 3.5 ISO noise

Use a deterministic strength function:

```ts
isoStops = log2(iso / 100)
noiseStrength = clamp01(isoStops / 5)
```

Render noise through a shader/overlay with a stable seeded pseudo-random pattern while the student is comparing captures. Do not use rapidly changing full-strength television-like noise; it makes comparison harder.

### 3.6 Tone clipping

Use Three.js linear rendering and map `exposureMultiplier` to tone-mapping exposure. The capture itself is the source for the optional histogram.

Do not simulate RAW recovery. Once a captured rendered region reaches the high/low clamp, the displayed image should visibly lose tonal detail.

---

## 4. Scene specification

All v1 scenes must be procedural. Do not require Blender, downloaded GLB assets, remote textures, CDN images, or licensed photography.

### Scene A — `runner`

Purpose: shutter speed, motion blur, ISO/exposure trade-offs, advanced panning.

Geometry:

- simple low-poly human assembled from sphere/capsule/cylinder primitives;
- horizontal track plane;
- three simple background blocks;
- fixed camera-facing movement path;
- neutral materials;
- no detailed facial model.

Parameters:

```ts
sceneEv100: 11
subjectDistanceM: 4
backgroundDistanceM: 12
subjectSpeedMps: 4
motionDirection: [1, 0]
```

Allowed variations by mission:

```ts
sceneEv100: 7 | 9 | 11
subjectSpeedMps: 2 | 4 | 6
```

### Scene B — `portrait`

Purpose: aperture, focal length, distance, separation from background, exposure/noise trade-offs.

Geometry:

- stylized bust/full-body subject;
- fixed environmental background at 8 m behind subject;
- foreground reference object;
- enough surface detail to perceive blur.

Defaults:

```ts
sceneEv100: 10
subjectDistanceM: 2
backgroundDistanceM: 10
focusTargetId: "portrait-subject"
```

Allowed subject distance options in this scene:

```ts
1 | 2 | 4
```

### Scene C — `depth`

Purpose: focus target, depth, focal length, multiple-plane reasoning.

Geometry:

- foreground object at 1 m;
- primary object at 2 m;
- background object at 4 m;
- architecture/background plane at 10 m.

Use this scene only after basic exposure controls have already been introduced. It is the sole v1 scene allowed to expose multiple selectable focus targets.

---

## 5. Curriculum specification

CameraLab has five core modules, three missions per module, plus Sandbox and a final transfer sequence. Modules are freely navigable; the UI visually recommends the next module.

### Module 1 — Movement / Movimiento

Learning target: understand shutter time as recorded motion.

#### M1.1 `freeze-runner`

- Scene: runner.
- Visible controls: shutter only.
- Initial: `f/4, 1/30, ISO 100, 50 mm, 4 m`.
- Camera auto-compensates exposure only for this first isolated experiment so visual brightness does not obscure motion learning.
- Success: `motionBlurPx <= 4`.
- Captures visible: 1.
- Hint 1: point attention to how long movement is being recorded.
- Hint 2: invite a shorter shutter time.
- Hint 3: name shutter speed but do not provide a specific denominator.

#### M1.2 `motion-and-light`

- Scene: runner.
- Visible controls: shutter + ISO.
- `sceneEv100 = 9`.
- Success:
  - `motionBlurPx <= 6`, weight 0.6;
  - `abs(exposureDelta) <= 0.75`, weight 0.4.
- Captures: guided A/B, maximum 2.
- Purpose: show that freezing motion can cost light.

#### M1.3 `low-light-runner`

- Scene: runner.
- Visible controls: shutter + aperture + ISO.
- `sceneEv100 = 7`.
- Success:
  - `motionBlurPx <= 7`;
  - `abs(exposureDelta) <= 0.75`;
  - `noiseStrength <= 0.8`.
- Captures: 3.
- Purpose: first genuine trade-off mission.

### Module 2 — Aperture / Apertura

Learning target: understand aperture as both light control and depth-of-field control.

#### M2.1 `separate-subject`

- Scene: portrait.
- Visible control: aperture.
- Exposure normalized for this isolated experiment.
- Success: `backgroundBlurPx >= 5`.
- Captures: 1.

#### M2.2 `keep-context`

- Scene: portrait.
- Visible controls: aperture + ISO.
- Success:
  - `backgroundBlurPx <= 5`;
  - `abs(exposureDelta) <= 0.75`;
  - `noiseStrength <= 0.8`.
- Captures: 2.
- Intent: keep subject and environment legible.

#### M2.3 `portrait-tradeoff`

- Scene: portrait.
- Visible controls: aperture + shutter + ISO.
- Success:
  - `backgroundBlurPx >= 4`;
  - `abs(exposureDelta) <= 0.75`;
  - `noiseStrength <= 0.6`.
- Captures: 3.

### Module 3 — ISO and tonal limits / ISO y límites tonales

Learning target: use ISO as a trade-off, not a “brightness slider.”

#### M3.1 `recover-exposure`

- Scene: portrait.
- Visible control: ISO.
- Initial settings deliberately underexpose by at least 2 stops.
- Success: `abs(exposureDelta) <= 0.75`.
- Captures: 1.

#### M3.2 `avoid-noise`

- Scene: portrait.
- Visible controls: aperture + ISO.
- Success:
  - `abs(exposureDelta) <= 0.75`;
  - `noiseStrength <= 0.6`.
- Captures: 2.

#### M3.3 `protect-tones`

- Scene: portrait.
- Visible controls: shutter + aperture + ISO.
- Use a scene with bright background highlights.
- Success:
  - `highlightClippingRisk <= 0.35`;
  - `shadowLossRisk <= 0.35`;
  - `noiseStrength <= 0.8`.
- Histogram becomes available after the first capture, not before it.
- Captures: 3.

### Module 4 — Exposure as a system / La exposición como sistema

Learning target: understand full stops and equivalent exposure combinations.

#### M4.1 `one-stop-exchange`

- Scene: portrait.
- Visible controls: aperture + shutter.
- UI highlights changes in stops after a capture.
- Success: maintain `abs(exposureDelta) <= 0.5` after changing aperture by at least two full-stop positions.
- Captures: 2.

#### M4.2 `same-exposure-different-image`

- Scene: runner.
- Visible controls: aperture + shutter + ISO.
- Student must produce two captures within `0.5` stop of each other but with motion difference `>= 6 px`.
- Captures: 2 required.
- Evaluator compares capture pair.

#### M4.3 `choose-the-compromise`

- Scene: runner.
- `sceneEv100 = 7`.
- All exposure controls visible.
- Success:
  - `motionBlurPx <= 7`;
  - `abs(exposureDelta) <= 0.75`;
  - `noiseStrength <= 0.7`.
- Captures: 3.
- Feedback names what the student gained and sacrificed.

### Module 5 — Optics and spatial decisions / Óptica y decisiones espaciales

Learning target: distinguish focal length, camera-to-subject distance, focus target, and depth-of-field effects.

#### M5.1 `change-field-of-view`

- Scene: portrait.
- Visible control: focal length.
- Distance fixed at 2 m.
- Student captures at least two focal lengths.
- Success is comparison-based: horizontal FOV difference `>= 20°`.
- Camera labels focal category only after first comparison:
  - 24 mm `angular`;
  - 35 mm `angular moderado`;
  - 50 mm `normal`;
  - 85 mm `tele corto`;
  - 135 mm `tele`.

#### M5.2 `distance-and-background`

- Scene: portrait.
- Visible controls: focal length + subject distance.
- Distances exposed: `1 | 2 | 4 m`.
- Student must maintain a broadly similar subject framing using a discrete focal/distance combination while producing a measurable background-blur difference.
- Success: evaluator validates framing tolerance and blur difference.
- Captures: 3.

#### M5.3 `choose-focus`

- Scene: depth.
- Visible controls: aperture + focal length + focus target.
- Focus target options correspond only to actual scene objects.
- Success: satisfy mission-specific sharp/blur intent without an exact settings answer.
- Captures: 3.

### Advanced transfer challenges

These are not a sixth module.

#### C1 `editorial-portrait`

Goal: isolate a portrait while retaining some environmental context and avoiding excessive ISO noise.

Maximum captures: 5.

#### C2 `runner-at-dusk`

Goal: freeze the subject at low light while balancing exposure and noise.

Maximum captures: 5.

#### C3 `intentional-panning`

Goal: use a slow shutter plus synchronized virtual camera follow to keep the runner more legible than the background.

Maximum captures: 5.

Panning UI exists only inside C3 and Sandbox.

---

## 6. Learning-flow state machine

Every mission follows:

```text
brief
→ predict-by-action
→ explore
→ capture
→ feedback
→ complete
```

`predict-by-action` must not become a quiz. The learner makes an initial camera decision before feedback is revealed. Example: the learner chooses a shutter speed before pressing Preview/Capture. The system records the first configuration as the prediction.

Progressive hints:

```text
Hint 1 = direct attention to the visual phenomenon.
Hint 2 = identify the controlling concept.
Hint 3 = identify the relevant control and direction of change.
```

Never put an exact target setting in Hint 1 or Hint 2.

A learner may repeat a mission indefinitely.

After completion:

1. show visual evidence from their final capture;
2. name the successful causal relationships;
3. state one trade-off;
4. recommend the next activity;
5. allow free navigation elsewhere.

---

## 7. Navigation and UI contract

CameraLab is a SPA without server-side routes.

Do not use React Router with browser-history URLs. Use application state for screens and optionally URL hash fragments for shareable internal state.

Allowed screen IDs:

```ts
export type ScreenId =
  | "home"
  | "onboarding"
  | "curriculum"
  | "lab"
  | "sandbox"
  | "reference"
  | "progress"
  | "settings"
  | "final-mastery";
```

`src/app/routes.ts` may serialize a screen to `#lab/m1-1`, but must never require GitHub Pages to resolve `/lab/m1-1` as a physical path.

Desktop layout:

```text
┌───────────────────────────────────────────────────────┐
│ Top bar: CameraLab | module | settings | progress     │
├───────────────────────────────┬───────────────────────┤
│                               │ Mission / feedback     │
│       3D CAMERA VIEW          │ panel                 │
│                               │                       │
├───────────────────────────────┴───────────────────────┤
│ Contextual camera controls + capture                  │
└───────────────────────────────────────────────────────┘
```

Minimum supported primary viewport: `1024×700`.

For widths `< 768px`, show a concise unsupported-device notice before loading WebGL. Do not spend v1 engineering time on mobile-specific interaction design.

---

## 8. Persistence and privacy

### Progress

Use localStorage key:

```text
cameralab:v1:progress
```

Schema:

```ts
export interface ProgressState {
  schemaVersion: 1;
  completedMissionIds: string[];
  completedModuleIds: string[];
  mastery: Record<string, "unexplored" | "developing" | "solid">;
  lastScreen: string;
  lastMissionId: string | null;
  locale: "es" | "en";
  reducedMotion: boolean;
  soundEnabled: boolean;
}
```

Support:

- reset current module;
- reset all CameraLab data after explicit confirmation.

### Telemetry

Use native IndexedDB database:

```text
database: cameralab
store: learning-events
version: 1
```

Event shape:

```ts
export interface LearningEvent {
  id: string;
  occurredAt: string;
  sessionId: string;
  missionId: string;
  type:
    | "mission_started"
    | "settings_changed"
    | "capture_taken"
    | "hint_opened"
    | "mission_completed"
    | "mission_repeated";
  payload: Record<string, string | number | boolean | null>;
}
```

Do not include:

- name;
- email;
- IP;
- school;
- device fingerprint;
- remote identifier.

Export telemetry only through an explicit “Exportar datos de aprendizaje” action. Export JSON. Do not upload automatically.

---

## 9. Localization

`es` is the default locale.

All visible text must use translation keys. No mission copy may be hard-coded inside React components.

Test that `es.json` and `en.json` contain exactly the same set of keys.

Technical terms may display bilingual micro-labels where educationally useful, for example:

```text
Velocidad de obturación
Shutter speed
```

Do not duplicate full instructions in both languages simultaneously.

---

## 10. Accessibility

Required v1 behaviors:

1. All non-WebGL controls reachable by keyboard.
2. Visible focus indication.
3. Sliders/dials expose accessible names and current values.
4. No state communicated by color alone.
5. “Reduce motion” setting removes decorative transitions and suppresses unnecessary scene animation.
6. Sound can be disabled.
7. Font sizing remains usable at browser zoom 200%.
8. WebGL canvas has a concise textual description of the current scene and current photographic state adjacent to it.
9. Feedback text describes important visual outcomes such as “movimiento alto” or “fondo muy desenfocado.”
10. Keyboard shortcut help is available but not required for basic operation.

---

## 11. GitHub Pages deployment design

Vite builds the application into `dist/`. GitHub Pages publishes only `dist/`.

The application base path is injected at build time.

### `vite.config.ts`

Use this configuration shape:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "CameraLab",
        short_name: "CameraLab",
        description: "Laboratorio virtual de aprendizaje fotográfico",
        display: "standalone",
        start_url: ".",
        scope: ".",
        background_color: "#111111",
        theme_color: "#111111",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
```

The app must not fetch remote runtime assets. Procedural 3D content means the service worker only needs to cache the built JS/CSS/icons.

### `.github/workflows/deploy-pages.yml`

```yaml
name: Deploy CameraLab to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: lts/*
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Typecheck
        run: npm run typecheck

      - name: Unit and component tests
        run: npm test -- --run

      - name: Build for GitHub Pages
        env:
          VITE_BASE_PATH: /${{ github.event.repository.name }}/
        run: npm run build

      - name: Configure Pages
        uses: actions/configure-pages@v6

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

GitHub repository setting:

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

If CameraLab is later served from a custom domain at the domain root, build with:

```text
VITE_BASE_PATH=/
```

No application code change should be required.

---

## 12. npm scripts contract

`package.json` must contain:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "typecheck": "tsc -b --pretty false",
    "lint": "eslint .",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "verify": "npm run lint && npm run typecheck && npm run test:run && npm run build"
  }
}
```

The first install resolves current stable packages and commits `package-lock.json`. From that commit forward, local/CI/deployment installs use `npm ci`.

---

# Implementation tasks

## Task 1: Scaffold the static application and verification toolchain

**Files:**
- Create/modify: `package.json`
- Create: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `playwright.config.ts`
- Create: `.github/workflows/ci.yml`
- Modify: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/styles.css`

**Produces:** a React/Vite app that builds without a backend and has unit, component, lint, typecheck, E2E, and static-build commands.

- [ ] **Step 1: Scaffold React + TypeScript with Vite**

Run:

```bash
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: Install runtime dependencies**

Run:

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing zustand i18next react-i18next vite-plugin-pwa
```

- [ ] **Step 3: Install development/test dependencies**

Run:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test eslint @types/node
```

- [ ] **Step 4: Add the npm scripts from Section 12**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 5: Create a minimal render test**

Create `src/app/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders CameraLab", () => {
    render(<App />);
    expect(screen.getByText("CameraLab")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test and verify green**

```bash
npm run test:run
```

Expected: PASS.

- [ ] **Step 7: Build production output**

```bash
npm run build
test -f dist/index.html
```

Expected: `dist/index.html` exists.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "chore: scaffold static CameraLab application"
```

---

## Task 2: Implement deterministic camera-domain constants and types

**Files:**
- Create: `src/domain/camera/constants.ts`
- Create: `src/domain/camera/types.ts`
- Create: `src/domain/camera/constants.test.ts`
- Create: `src/domain/camera/index.ts`

**Produces:** canonical camera settings values used by every later task.

- [ ] **Step 1: Write failing constants test**

```ts
import { describe, expect, it } from "vitest";
import {
  APERTURES,
  FOCAL_LENGTHS,
  ISO_VALUES,
  SHUTTER_DENOMINATORS,
} from "./constants";

describe("camera constants", () => {
  it("uses the approved full-stop values", () => {
    expect(APERTURES).toEqual([1.4, 2, 2.8, 4, 5.6, 8, 11, 16]);
    expect(SHUTTER_DENOMINATORS).toEqual([15, 30, 60, 125, 250, 500, 1000, 2000]);
    expect(ISO_VALUES).toEqual([100, 200, 400, 800, 1600, 3200]);
    expect(FOCAL_LENGTHS).toEqual([24, 35, 50, 85, 135]);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

```bash
npm test -- src/domain/camera/constants.test.ts --run
```

Expected: FAIL because constants do not exist.

- [ ] **Step 3: Implement constants/types exactly as Sections 0 and 2**

- [ ] **Step 4: Run test**

```bash
npm test -- src/domain/camera/constants.test.ts --run
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/camera
git commit -m "feat: define CameraLab camera domain"
```

---

## Task 3: Implement exposure/stops calculations

**Files:**
- Create: `src/domain/camera/exposure.ts`
- Create: `src/domain/camera/exposure.test.ts`
- Modify: `src/domain/camera/index.ts`

**Interfaces:**

```ts
export function shutterSeconds(denominator: ShutterDenominator): number;
export function cameraEv100(settings: CameraSettings): number;
export function evaluateExposure(
  settings: CameraSettings,
  scene: SceneExposure
): ExposureResult;
export function stopDifference(a: number, b: number): number;
```

- [ ] **Step 1: Write numerical tests**

Include:

```ts
it("treats f/16 1/125 ISO100 as approximately EV15", () => {
  expect(cameraEv100(settings({ aperture: 16, shutterDenominator: 125, iso: 100 })))
    .toBeCloseTo(15, 1);
});

it("increasing ISO 100 to 200 changes camera EV100 by one stop", () => {
  const a = cameraEv100(settings({ iso: 100 }));
  const b = cameraEv100(settings({ iso: 200 }));
  expect(a - b).toBeCloseTo(1, 5);
});

it("returns zero delta when scene and camera EV match", () => {
  const s = settings({ aperture: 16, shutterDenominator: 125, iso: 100 });
  const scene = { ev100: cameraEv100(s) };
  expect(evaluateExposure(s, scene).deltaStops).toBeCloseTo(0, 5);
});
```

- [ ] **Step 2: Run tests and confirm failure**

- [ ] **Step 3: Implement Section 3.1 formulas**

Use a local:

```ts
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
```

- [ ] **Step 4: Run**

```bash
npm test -- src/domain/camera/exposure.test.ts --run
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/camera
git commit -m "feat: implement exposure and stop model"
```

---

## Task 4: Implement optics and motion domain models

**Files:**
- Create: `src/domain/camera/optics.ts`
- Create: `src/domain/camera/optics.test.ts`
- Create: `src/domain/camera/motion.ts`
- Create: `src/domain/camera/motion.test.ts`
- Modify: `src/domain/camera/index.ts`

**Interfaces:**

```ts
export function fieldOfViewDeg(
  focalLengthMm: number,
  sensorDimensionMm: number
): number;

export function blurCircleMm(args: {
  focalLengthMm: number;
  aperture: number;
  focusDistanceM: number;
  objectDistanceM: number;
}): number;

export function blurCirclePx(args: {
  focalLengthMm: number;
  aperture: number;
  focusDistanceM: number;
  objectDistanceM: number;
  renderWidthPx: number;
}): number;

export function motionBlurPx(args: {
  speedMps: number;
  subjectDistanceM: number;
  shutterSeconds: number;
  focalLengthMm: number;
  renderWidthPx: number;
}): number;
```

- [ ] **Step 1: Test required monotonic relationships**

Examples:

```ts
expect(fieldOfViewDeg(24, 36)).toBeGreaterThan(fieldOfViewDeg(85, 36));

expect(blurCirclePx({ ...base, aperture: 2 }))
  .toBeGreaterThan(blurCirclePx({ ...base, aperture: 8 }));

expect(motionBlurPx({ ...motion, shutterSeconds: 1 / 30 }))
  .toBeGreaterThan(motionBlurPx({ ...motion, shutterSeconds: 1 / 500 }));

expect(motionBlurPx({ ...motion, focalLengthMm: 135 }))
  .toBeGreaterThan(motionBlurPx({ ...motion, focalLengthMm: 24 }));
```

- [ ] **Step 2: Confirm failing tests**

- [ ] **Step 3: Implement formulas from Sections 3.2–3.4**

- [ ] **Step 4: Run camera-domain test directory**

```bash
npm test -- src/domain/camera --run
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/camera
git commit -m "feat: add optics and motion simulation model"
```

---

## Task 5: Implement image-effect metrics

**Files:**
- Create: `src/domain/camera/imageEffects.ts`
- Create: `src/domain/camera/imageEffects.test.ts`
- Create: `src/domain/camera/simulate.ts`
- Create: `src/domain/camera/simulate.test.ts`
- Modify: `src/domain/camera/index.ts`

**Interfaces:**

```ts
export function noiseStrengthForIso(iso: ISO): number;
export function imageEffects(
  settings: CameraSettings,
  exposure: ExposureResult
): ImageEffectResult;

export interface SimulationSceneInput {
  ev100: number;
  renderWidthPx: number;
  foregroundDistanceM: number;
  backgroundDistanceM: number;
  focusDistanceM: number;
  subjectSpeedMps: number;
}

export interface SimulationSnapshot {
  exposure: ExposureResult;
  optics: OpticsResult;
  motion: MotionResult;
  effects: ImageEffectResult;
  metrics: {
    exposureDeltaAbs: number;
    motionBlurPx: number;
    backgroundMotionBlurPx: number;
    foregroundBlurPx: number;
    backgroundBlurPx: number;
    noiseStrength: number;
    highlightClippingRisk: number;
    shadowLossRisk: number;
    horizontalFovDeg: number;
    framingScale: number;
  };
}

export function simulateCapture(
  settings: CameraSettings,
  scene: SimulationSceneInput
): SimulationSnapshot;
```

- [ ] **Step 1: Test monotonic ISO noise and clipping**

```ts
expect(noiseStrengthForIso(100)).toBe(0);
expect(noiseStrengthForIso(3200)).toBe(1);
expect(noiseStrengthForIso(1600)).toBeGreaterThan(noiseStrengthForIso(400));
```

Also verify that a positive `deltaStops` raises highlight clipping and a negative `deltaStops` raises shadow loss.

- [ ] **Step 2: Implement Section 3.5/3.6 metrics**

- [ ] **Step 3: Write `simulateCapture` tests**

Verify that the canonical snapshot exposes all mission metrics and that:

```ts
expect(snapshot.metrics.exposureDeltaAbs).toBe(Math.abs(snapshot.exposure.deltaStops));
expect(snapshot.metrics.framingScale).toBeCloseTo(
  snapshotSettings.focalLengthMm / snapshotSettings.subjectDistanceM,
  6
);
```

When `panningEnabled` is false:

```ts
expect(snapshot.metrics.backgroundMotionBlurPx).toBe(0);
```

When `panningEnabled` is true, use a fixed pedagogical follow ratio of `0.8`:

```text
subject relative motion = base motion × 0.2
background relative motion = base motion × 0.8
```

This challenge-only approximation must be documented in `docs/simulation-model.md`.

- [ ] **Step 4: Implement `simulateCapture` as the only integration point used by rendering and mission evaluation**

- [ ] **Step 5: Run**

```bash
npm test -- src/domain/camera --run
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domain/camera
git commit -m "feat: model ISO noise and tonal clipping"
```

---

## Task 6: Implement mission definitions and outcome evaluator

**Files:**
- Create: `src/domain/learning/types.ts`
- Create: `src/domain/learning/evaluateMission.ts`
- Create: `src/domain/learning/evaluateMission.test.ts`
- Create: `src/content/missions.ts`
- Create: `src/content/curriculum.ts`

**Produces:** all 15 core missions as typed data and a generic evaluator.

**Evaluator signature:**

```ts
export function evaluateMission(args: {
  mission: MissionDefinition;
  captures: CaptureSnapshot[];
}): MissionEvaluation;
```

The evaluator operates only on retained capture metadata, never on pixels. It supports all `MissionRule` variants defined in Section 2:

- `metric`: evaluate the latest retained capture;
- `all-retained-captures-metric`: every retained capture used for the comparison must pass;
- `pair-metric-delta`: compare the two most recent retained captures using absolute metric difference;
- `setting-stop-delta`: compare full-stop indices in the approved aperture/shutter/ISO arrays;
- `distinct-setting-count`: require a minimum number of distinct selected settings;
- `framing-similarity`: compare `framingScale = focalLengthMm / subjectDistanceM` between the two most recent captures.

Mission passes when every rule whose `weight > 0` passes. Weight is retained for feedback ordering, not for a visible numeric grade.

- [ ] **Step 1: Write evaluator tests**

Test every rule variant. Include these cases:

```text
single metric pass/fail
two captures with equivalent exposure but motion-blur delta >= 6 px
aperture changed by at least two approved full-stop positions
two distinct focal lengths
framing relative difference <= 0.15
```

Also assert that `MissionEvaluation` exposes no numeric grade/score field.

- [ ] **Step 2: Implement generic evaluator over capture history**

- [ ] **Step 3: Encode the 15 mission definitions from Section 5**

Mission IDs must match the IDs in Section 5 exactly.

- [ ] **Step 4: Add structural test**

```ts
expect(MISSIONS).toHaveLength(15);
expect(new Set(MISSIONS.map((m) => m.id)).size).toBe(15);
expect(MISSIONS.every((m) => m.rules.length > 0)).toBe(true);
expect(MISSIONS.every((m) => m.initialSettings.panningEnabled === false)).toBe(true);
```

- [ ] **Step 5: Run**

```bash
npm test -- src/domain/learning src/content --run
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domain/learning src/content
git commit -m "feat: define curriculum and mission evaluation"
```

---

## Task 7: Implement hints and mastery without gamified scores

**Files:**
- Create: `src/domain/learning/hints.ts`
- Create: `src/domain/learning/mastery.ts`
- Create: `src/domain/learning/mastery.test.ts`

**Interfaces:**

```ts
export function hintForAttempt(
  mission: MissionDefinition,
  hintLevel: 0 | 1 | 2
): string;

export function deriveMastery(args: {
  missionHistory: Array<{
    missionId: string;
    completed: boolean;
    hintsUsed: number;
    attempts: number;
  }>;
}): Record<string, MasteryLevel>;
```

Rules:

- `unexplored`: no attempt in concept.
- `developing`: attempted or completed with heavy support.
- `solid`: at least two successful applications of concept, including one mission completed with <= 1 hint.
- Never display raw mastery calculation points.

- [ ] **Step 1: Write mastery tests**
- [ ] **Step 2: Implement**
- [ ] **Step 3: Run and pass**
- [ ] **Step 4: Commit**

```bash
git add src/domain/learning
git commit -m "feat: add progressive hints and mastery model"
```

---

## Task 8: Build application/navigation state and free curriculum navigation

**Files:**
- Create: `src/app/appStore.ts`
- Create: `src/app/routes.ts`
- Modify: `src/app/App.tsx`
- Create: `src/features/progress/ProgressOverview.tsx`

**State contract:**

```ts
interface AppState {
  screen: ScreenId;
  currentModuleId: string | null;
  currentMissionId: string | null;
  navigate: (screen: ScreenId) => void;
  openMission: (missionId: string) => void;
}
```

Navigation rules:

- all five modules visible;
- recommended next module is visually emphasized;
- no module is disabled;
- if learner opens a later module, show a non-blocking prerequisite note;
- no browser-history route that can 404 on Pages.

- [ ] **Step 1: Write component test that later module remains clickable**
- [ ] **Step 2: Implement state/hash synchronization**
- [ ] **Step 3: Run component tests**
- [ ] **Step 4: Commit**

```bash
git add src/app src/features/progress
git commit -m "feat: add free curriculum navigation"
```

---

## Task 9: Build procedural Three.js scene registry

**Files:**
- Create all files under `src/scenes/` from Section 1.
- Create: `src/scenes/sceneRegistry.test.ts`

**Scene registry interface:**

```ts
export interface SceneConfig {
  id: "runner" | "portrait" | "depth";
  defaultEv100: number;
  backgroundDistanceM: number;
  focusTargets: Array<{
    id: string;
    distanceM: number;
  }>;
}

export const SCENES: Record<SceneConfig["id"], SceneConfig>;
```

- [ ] **Step 1: Write scene-registry tests for all 3 IDs**
- [ ] **Step 2: Implement procedural geometry only**
- [ ] **Step 3: Ensure no `fetch()`, external texture URL, GLB URL, or CDN dependency appears in `src/scenes`**
- [ ] **Step 4: Run app manually and verify the three scenes render**
- [ ] **Step 5: Commit**

```bash
git add src/scenes
git commit -m "feat: add procedural photography scenes"
```

---

## Task 10: Connect camera settings to the 3D camera and visual effects

**Files:**
- Create/modify:
  - `src/scenes/shared/PedagogicalCamera.tsx`
  - `src/scenes/shared/NoiseOverlay.tsx`
  - `src/scenes/shared/MotionTrail.tsx`
  - `src/scenes/SceneCanvas.tsx`

**Behavior:**

1. focal length changes Three.js perspective camera FOV;
2. discrete subject distance moves the camera to calibrated positions, not arbitrary orbit;
3. exposure delta changes renderer/tone mapping exposure;
4. ISO changes deterministic noise overlay;
5. blur metric controls the DOF postprocess;
6. runner motion trail length follows domain `motionBlurPx`;
7. active focus target determines focus distance.
8. `<Canvas>` uses `gl={{ preserveDrawingBuffer: true }}` so local PNG capture is reliable on GitHub Pages without a second rendering backend.

- [ ] **Step 1: Create a pure `renderModel()` adapter test**

The adapter converts `CameraSettings + SceneConfig` into:

```ts
interface RenderModel {
  cameraFovDeg: number;
  exposure: number;
  noiseStrength: number;
  motionBlurPx: number;
  focusDistanceM: number;
  bokehStrength: number;
}
```

- [ ] **Step 2: Implement the adapter by consuming `simulateCapture()`; do not recalculate camera physics inside React/Three.js components**
- [ ] **Step 3: Wire adapter values into R3F components**
- [ ] **Step 4: Manually verify monotonic effects with a debug readout**
- [ ] **Step 5: Remove debug readout from production UI**
- [ ] **Step 6: Commit**

```bash
git add src/scenes src/domain
git commit -m "feat: connect camera model to rendered scene"
```

---

## Task 11: Build progressive camera controls and capture flow

**Files:**
- Create:
  - `src/features/lab/LabScreen.tsx`
  - `src/features/lab/CameraControls.tsx`
  - `src/features/lab/CaptureButton.tsx`
  - `src/features/lab/labStore.ts`
  - `src/features/lab/MissionPanel.tsx`

**Requirements:**

- Only `mission.enabledControls` render.
- Controls are discrete buttons/dials, not continuous free-form numeric inputs.
- Current value is always visible.
- Changing settings updates live preview.
- Pressing Capture freezes an attempt snapshot.
- Attempt count is unlimited, but visible comparison slots obey `maxVisibleCaptures`.

**Captured attempt:**

```ts
export interface CaptureAttempt {
  id: string;
  missionId: string;
  createdAt: string;
  settings: CameraSettings;
  metrics: Record<MetricName, number>;
  imageDataUrl?: string;
}
```

Do not retain all image data indefinitely; only current comparison slots need in-memory thumbnails. Progress persistence stores results/settings metadata, not an image portfolio.

- [ ] **Step 1: Test that a shutter-only mission renders only shutter control**
- [ ] **Step 2: Test that changing shutter updates store**
- [ ] **Step 3: Implement controls**
- [ ] **Step 4: Implement capture metadata**
- [ ] **Step 5: Run component tests**
- [ ] **Step 6: Commit**

```bash
git add src/features/lab
git commit -m "feat: add progressive camera controls and capture flow"
```

---

## Task 12: Implement progressive comparison, hints, and feedback

**Files:**
- Create:
  - `src/features/lab/ComparisonTray.tsx`
  - `src/features/lab/HintPanel.tsx`
  - `src/features/lab/FeedbackPanel.tsx`

**Comparison rules:**

- `maxVisibleCaptures=1`: current result only.
- `2`: A/B guided comparison, highlight one relevant changed parameter.
- `3`: user may keep any three attempts.
- `5`: advanced challenge tray.

Feedback must use three sections:

```text
Conseguiste / Achieved
Observa / Notice
Compromiso / Trade-off
```

It may say “la exposición quedó 1.3 pasos por debajo de la referencia,” but must not reduce the mission to a visible numeric score.

- [ ] **Step 1: Write A/B comparison rendering test**
- [ ] **Step 2: Write progressive hint test**
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run**
- [ ] **Step 5: Commit**

```bash
git add src/features/lab
git commit -m "feat: add guided comparison and feedback"
```

---

## Task 13: Implement capture histogram and image export

**Files:**
- Create:
  - `src/features/capture/captureCanvas.ts`
  - `src/features/capture/histogram.ts`
  - `src/features/capture/exportImage.ts`
- Create unit tests for histogram bins.

**Interfaces:**

```ts
export async function captureCanvas(
  canvas: HTMLCanvasElement
): Promise<Blob>;

export function luminanceHistogram(
  pixels: Uint8ClampedArray,
  bins?: number
): number[];

export async function exportCapture(args: {
  image: Blob;
  settings: CameraSettings;
  includeSettingsCard: boolean;
}): Promise<Blob>;
```

Histogram:

1. scale capture to a small offscreen canvas;
2. compute relative luminance;
3. default 64 bins;
4. show only when unlocked/explicitly toggled.

Export:

- PNG;
- optional footer containing shutter, aperture, ISO, focal length;
- no user identity;
- local browser download only.

- [ ] **Step 1: Write histogram test with known black/white pixels**
- [ ] **Step 2: Implement capture and histogram**
- [ ] **Step 3: Implement export card**
- [ ] **Step 4: Verify downloaded PNG opens**
- [ ] **Step 5: Commit**

```bash
git add src/features/capture
git commit -m "feat: add histogram and local image export"
```

---

## Task 14: Implement progress persistence and local telemetry

**Files:**
- Create:
  - `src/features/progress/progressStore.ts`
  - `src/features/progress/persistence.ts`
  - `src/features/telemetry/db.ts`
  - `src/features/telemetry/telemetry.ts`
  - `src/features/telemetry/exportTelemetry.ts`
- Tests for migration/reset/export.

**Persistence rules:**

- write progress after mission completion/settings preference changes;
- do not write large image data URLs to localStorage;
- IndexedDB event insert failures must never block a mission;
- resetting CameraLab clears both localStorage and IndexedDB after confirmation.

- [ ] **Step 1: Write progress round-trip test**
- [ ] **Step 2: Write reset test**
- [ ] **Step 3: Implement progress persistence**
- [ ] **Step 4: Implement native IndexedDB event store**
- [ ] **Step 5: Implement JSON export**
- [ ] **Step 6: Run tests**
- [ ] **Step 7: Commit**

```bash
git add src/features/progress src/features/telemetry
git commit -m "feat: persist local progress and learning telemetry"
```

---

## Task 15: Implement bilingual content and key-parity validation

**Files:**
- Create:
  - `src/content/locales/es.json`
  - `src/content/locales/en.json`
  - `src/shared/utils/i18n.ts`
  - `src/content/locales/locales.test.ts`
- Modify all visible components.

- [ ] **Step 1: Add key-parity test that recursively flattens JSON keys**
- [ ] **Step 2: Populate Spanish copy for every mission/hint/control**
- [ ] **Step 3: Populate English equivalent**
- [ ] **Step 4: Replace hard-coded UI copy with `t(key)`**
- [ ] **Step 5: Run key test**
- [ ] **Step 6: Manually switch locale without reload**
- [ ] **Step 7: Commit**

```bash
git add src/content src/shared src/features src/app
git commit -m "feat: add Spanish and English interface"
```

---

## Task 16: Implement onboarding, guidance, Sandbox, reference, and summaries

**Files:**
- Create:
  - `src/features/onboarding/Onboarding.tsx`
  - `src/features/onboarding/diagnostic.ts`
  - `src/features/sandbox/SandboxScreen.tsx`
  - `src/features/reference/ReferenceSheet.tsx`
  - `src/features/summary/ModuleSummary.tsx`
  - `src/features/summary/FinalMastery.tsx`
  - `src/content/presets.ts`

**Onboarding:**

Do not administer a quiz. Use 2–3 quick photographic actions to determine default amount of guidance, for example:

1. learner chooses a shutter setting for a moving subject;
2. learner adjusts aperture to alter background separation;
3. system sets guidance mode `more | standard`.

This guidance setting changes hint availability/timing, not content access.

**Sandbox:**

All v1 camera controls visible.
Presets:

```text
Freeze motion
Shallow portrait
Deep focus
Low light
Panning
```

Selecting a preset must immediately display every changed camera parameter.

**Reference sheet:**

Show:

- full-stop aperture scale;
- full-stop shutter scale;
- ISO scale;
- “one stop” equivalence concept;
- focal categories;
- concise cause/effect reminders.

**Module summary:**

Use actual session evidence, e.g. “redujiste el desenfoque de movimiento entre tu primera y última captura.”

- [ ] **Step 1: Test Sandbox preset updates all relevant values**
- [ ] **Step 2: Implement onboarding actions**
- [ ] **Step 3: Implement Sandbox**
- [ ] **Step 4: Implement reference**
- [ ] **Step 5: Implement module/final summary**
- [ ] **Step 6: Commit**

```bash
git add src/features src/content
git commit -m "feat: complete self-guided learning experience"
```

---

## Task 17: Add presentation mode, sound, reduced motion, and accessibility QA

**Files:**
- Create/modify:
  - `src/features/settings/SettingsPanel.tsx`
  - `src/shared/hooks/useShutterSound.ts`
  - `src/app/styles.css`
  - relevant lab controls

**Presentation mode:**

A local display setting only:

```ts
presentationMode: boolean
```

When enabled:

- increases instructional copy/control sizing;
- exposes a prominent “Repetir actividad” action;
- hides no student functionality;
- does not add class management or remote control.

**Shutter sound:**

Use Web Audio API to synthesize a short local click. No audio file download.

**Accessibility checks:**

- keyboard completion of one mission;
- screen-reader labels for all camera controls;
- 200% zoom;
- reduced motion;
- no color-only success indication.

- [ ] **Step 1: Add component tests for accessible names**
- [ ] **Step 2: Implement settings**
- [ ] **Step 3: Implement synthesized shutter sound**
- [ ] **Step 4: Implement presentation styling**
- [ ] **Step 5: Complete keyboard-only mission manually**
- [ ] **Step 6: Commit**

```bash
git add src/features/settings src/shared src/app
git commit -m "feat: add accessible presentation and sensory settings"
```

---

## Task 18: Add PWA/offline behavior

**Files:**
- Modify: `vite.config.ts`
- Create: `public/favicon.svg`
- Create: `public/icons/icon-192.png`
- Create: `public/icons/icon-512.png`
- Modify: `src/main.tsx`

**Acceptance test:**

1. `npm run build`;
2. `npm run preview`;
3. open app once;
4. stop network access in browser devtools;
5. reload;
6. open a previously cached mission;
7. scene and controls still function;
8. complete a mission;
9. refresh;
10. progress remains.

- [ ] **Step 1: Configure VitePWA exactly as Section 11**
- [ ] **Step 2: Generate local icons from the CameraLab mark**
- [ ] **Step 3: Build and confirm manifest/service-worker files exist in `dist/`**
- [ ] **Step 4: Perform offline acceptance test**
- [ ] **Step 5: Commit**

```bash
git add vite.config.ts public src/main.tsx
git commit -m "feat: make CameraLab installable and offline-capable"
```

---

## Task 19: Add E2E tests for the complete learning path

**Files:**
- Create:
  - `tests/e2e/navigation.spec.ts`
  - `tests/e2e/mission.spec.ts`
  - `tests/e2e/persistence.spec.ts`
  - `tests/e2e/pages-build.spec.ts`

Minimum E2E assertions:

### Navigation

```text
Home → Curriculum → Module 1 → Mission 1
```

A user can directly open Module 5 without completing Module 1.

### Mission

Change shutter → visual-state metadata changes → Capture → feedback renders.

The E2E test may inspect a deterministic debug attribute exposed only under:

```text
VITE_E2E=true
```

Example:

```html
<div data-testid="render-metrics" data-motion-blur="3.2" hidden></div>
```

Do not rely on screenshot pixel similarity for the core physics tests.

### Persistence

Complete mission → reload → completion remains.

### Pages build

Run a production build with:

```bash
VITE_BASE_PATH=/camera-lab/ npm run build
```

Assert `dist/index.html` references `/camera-lab/` assets and does not emit root-only `/assets/...` URLs.

- [ ] **Step 1: Install browser**

```bash
npx playwright install chromium
```

- [ ] **Step 2: Implement four E2E specs**
- [ ] **Step 3: Run**

```bash
npm run build
npm run test:e2e
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add tests playwright.config.ts
git commit -m "test: cover CameraLab end-to-end learning flow"
```

---

## Task 20: Add CI

**Files:**
- Create: `.github/workflows/ci.yml`

Use:

```yaml
name: CameraLab CI

on:
  pull_request:
  push:
    branches: ["main"]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v6
        with:
          node-version: lts/*
          cache: npm

      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:run
      - run: npm run build
```

- [ ] **Step 1: Add workflow**
- [ ] **Step 2: Push branch and verify all checks green**
- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: verify CameraLab on every change"
```

---

## Task 21: Add GitHub Pages deployment workflow

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

Use the exact workflow in Section 11.

- [ ] **Step 1: Add workflow**
- [ ] **Step 2: Enable GitHub Pages Source = GitHub Actions**
- [ ] **Step 3: Push to `main`**
- [ ] **Step 4: Verify Actions `build` passes**
- [ ] **Step 5: Verify Actions `deploy` passes**
- [ ] **Step 6: Open the emitted Pages URL**
- [ ] **Step 7: Verify direct app boot, assets, WebGL, PWA manifest, and one capture**
- [ ] **Step 8: Commit any deployment correction before continuing**

Expected final public path:

```text
https://{github-owner}.github.io/camera-lab/
```

- [ ] **Step 9: Commit**

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "ci: deploy CameraLab to GitHub Pages"
```

---

## Task 22: Documentation and final release verification

**Files:**
- Create:
  - `docs/architecture.md`
  - `docs/pedagogy.md`
  - `docs/simulation-model.md`
- Modify: `README.md`

### `README.md` must contain

```text
CameraLab
What it teaches
Architecture
Local development
Testing
Production build
GitHub Pages deployment
Offline behavior
Privacy
Project scope / v1 exclusions
```

### `docs/simulation-model.md` must document

- EV100 formula;
- exposure-delta interpretation;
- FOV formula;
- thin-lens blur approximation;
- motion-blur approximation;
- ISO-noise approximation;
- known simplifications.

### Final commands

Run:

```bash
npm ci
npm run lint
npm run typecheck
npm run test:run
npm run build
VITE_BASE_PATH=/camera-lab/ npm run build
npm run test:e2e
```

All must pass.

Then scan source:

```bash
grep -R "fetch(" src || true
grep -R "https://" src || true
grep -R "http://" src || true
```

Review every result. Production code must not depend on remote runtime resources.

Run:

```bash
git status --short
```

Expected: no uncommitted changes.

- [ ] **Step 1: Complete documentation**
- [ ] **Step 2: Run all verification commands**
- [ ] **Step 3: Test installed/offline experience**
- [ ] **Step 4: Test Spanish and English**
- [ ] **Step 5: Test keyboard-only basic mission**
- [ ] **Step 6: Test reset module and reset all**
- [ ] **Step 7: Test PNG export**
- [ ] **Step 8: Test telemetry JSON export**
- [ ] **Step 9: Test production GitHub Pages URL**
- [ ] **Step 10: Commit release documentation**

```bash
git add README.md docs
git commit -m "docs: document CameraLab v1 architecture and release"
```

---

# Agent execution strategy

Use this dependency graph:

```text
Task 1
  ↓
Task 2
  ↓
Task 3 ─┐
Task 4 ─┼→ Task 6 → Task 7
Task 5 ─┘
  ↓
Task 8
  ↓
Task 9 → Task 10
          ↓
       Task 11
          ↓
       Task 12
        ↙   ↘
   Task 13  Task 14
        ↘   ↙
       Task 15
          ↓
       Task 16
          ↓
       Task 17
          ↓
       Task 18
          ↓
       Task 19
          ↓
       Task 20
          ↓
       Task 21
          ↓
       Task 22
```

Safe parallelism after Task 2:

- Tasks 3, 4, and 5 may run in parallel.
- Task 13 and Task 14 may run in parallel after Task 12.
- Do not parallelize two agents editing the same file without a merge owner.

Recommended agent roles:

```text
Agent A — camera-domain math
Agent B — Three.js rendering
Agent C — learning/mission engine
Agent D — UI/accessibility/i18n
Agent E — persistence/PWA/deployment
Agent F — test/release reviewer
```

The orchestrator should still assign one task at a time to each agent and require the task-specific test command before accepting the commit.

---

# Scope guard: explicitly not in CameraLab v1

Reject implementation requests that add any of the following unless the product scope is intentionally revised:

```text
backend
Supabase/Firebase
user login
cloud synchronization
teacher dashboard
LMS integration
AI tutor
LLM API
camera brand emulation
RAW development
JPEG quality comparison
white balance
color grading
flash
IBIS/OIS
camera shake
hyperfocal calculator
sensor-size switching
third-stop controls
continuous zoom lens
continuous camera-distance slider
vertical orientation
mobile-specific UX
social feed
student portfolio
certificates
leaderboards
points/stars
remote analytics
remote fonts
remote 3D assets
```

---

# Definition of Done

CameraLab v1 is complete only when every item below is true.

## Product

- [ ] 5 modules × 3 core missions are usable.
- [ ] 3 advanced transfer challenges are usable.
- [ ] Sandbox is usable.
- [ ] Student can enter any module freely.
- [ ] Next recommended activity is explicit.
- [ ] Hints are progressive.
- [ ] Multiple valid solutions are accepted.
- [ ] Feedback explains consequences/trade-offs.
- [ ] Module summaries use learner evidence.
- [ ] Final mastery profile contains no numeric grade.

## Simulation

- [ ] Aperture affects exposure and DOF in the correct direction.
- [ ] Shutter affects exposure and motion blur in the correct direction.
- [ ] ISO affects exposure and noise in the correct direction.
- [ ] Focal length affects FOV in the correct direction.
- [ ] Focal/distance/aperture relationships affect background blur coherently.
- [ ] Focus target controls the intended plane.
- [ ] Highlights/shadows visibly lose detail under extreme exposure.
- [ ] Domain formulas pass deterministic unit tests.

## Technical

- [ ] `npm ci` succeeds.
- [ ] `npm run lint` passes.
- [ ] `npm run typecheck` passes.
- [ ] `npm run test:run` passes.
- [ ] `npm run build` passes.
- [ ] E2E tests pass.
- [ ] `dist/` is the only deployed application artifact.
- [ ] No backend is required.
- [ ] No runtime remote asset is required.
- [ ] Application works after offline reload.
- [ ] Local progress survives reload.
- [ ] Reset functions work.
- [ ] Image export works.
- [ ] Telemetry export works.

## GitHub Pages

- [ ] Repository Pages source is GitHub Actions.
- [ ] Push to `main` triggers deployment.
- [ ] Project-site base path works at `/camera-lab/`.
- [ ] No browser-history route produces a Pages 404.
- [ ] All JS/CSS/icon assets resolve under the repository base path.
- [ ] Service worker uses the same scope/base path.
- [ ] Production URL opens with no console errors.

## Accessibility/localization

- [ ] Spanish complete.
- [ ] English complete.
- [ ] Translation key parity test passes.
- [ ] Keyboard controls cover the main learning flow.
- [ ] Visible focus works.
- [ ] Reduced-motion setting works.
- [ ] Sound can be disabled.
- [ ] Important states are not color-only.
- [ ] Interface remains usable at 200% zoom.

---

# Release gate for v1.0.0

Tag `v1.0.0` only after:

```bash
npm ci
npm run verify
npm run test:e2e
```

pass from a clean clone, and the deployed GitHub Pages site passes one complete manual learning path:

```text
Open CameraLab
→ onboarding
→ M1.1
→ make first camera decision
→ capture
→ request hint
→ adjust shutter
→ successful capture
→ feedback
→ module navigation
→ reload page
→ progress preserved
→ disconnect network
→ reload cached app
→ open Sandbox
→ capture
→ export PNG
```

Final release commit:

```bash
git add .
git commit -m "release: CameraLab v1.0.0"
git tag v1.0.0
git push origin main --tags
```

---

# Implementation principle for all agents

When forced to choose between a more realistic simulation and a simpler implementation that preserves the intended causal relationship, choose the simpler deterministic implementation.

CameraLab succeeds when a learner can *predict what a camera control will do, try it, observe the consequence, and make a better photographic decision*. It does not succeed by reproducing every behavior of a commercial camera.

---

# Official deployment references

Implementation should remain aligned with:

- Vite documentation: Deploying a Static Site → GitHub Pages.
- GitHub documentation: Using custom workflows with GitHub Pages.

The architecture above follows those requirements: Vite performs the build, `dist/` is uploaded as the Pages artifact, and GitHub Actions performs deployment with Pages permissions.

# Simulation Model — CameraLab v1

> Objetivo: **realismo pedagógico**, no simulación óptica completa. La implementación elige la versión determinista *más simple que preserve la relación causal*.

## Sensor
```
SENSOR_WIDTH_MM  = 36
SENSOR_HEIGHT_MM = 24   // full-frame fijo
RENDER_WIDTH_PX  = 1280  // referencia para convertir mm→px
```

## 1. Exposición y stops

```ts
shutterSeconds = 1 / shutterDenominator
cameraEv100 = log2((aperture²) / shutterSeconds) - log2(iso/100)
deltaStops = sceneEv100 - cameraEv100
exposureMultiplier = 2 ** deltaStops        // clamped [0.125,8] para render, no para delta
highlightClippingRisk = clamp01((deltaStops - 0.5)/2.5)
shadowLossRisk       = clamp01((-deltaStops - 0.5)/2.5)
```

- `deltaStops≈0` exposición nominal
- `deltaStops>0` tiende a sobreexpuesta, `deltaStops<0` subexpuesta
- `|deltaStops|≤0.75` se trata como usable en la mayoría de misiones (salvo que la misión pida otro resultado)
- `highlightClippingRisk` crece con sobreexposición, `shadowLossRisk` con subexposición; tono mapeado a `toneMappingExposure` de Three.js

Test canónico: `f/16, 1/125, ISO100 ≈ EV15`; subir ISO 100→200 baja `cameraEv100` en 1 paso.

## 2. Campo visual (FOV)

```ts
fovRad = 2 * atan(sensorDimensionMm / (2*focalLengthMm))
fovDeg = fovRad * 180/π
```

Se expone `horizontalFovDeg` (36mm) y `verticalFovDeg` (24mm). Relación: focal corta → FOV grande.

Categorías pedagógicas (tras primera comparación):
24mm angular, 35mm angular moderado, 50mm normal, 85mm tele corto, 135mm tele.

## 3. Profundidad de campo (aprox. thin-lens)

Para focal `f` (mm) y distancias convertidas a mm:

```ts
imageDistance = (f * objectDistance) / (objectDistance - f)
apertureDiameter = f / fNumber
blurCircleMm = apertureDiameter * |objectImageDistance - focusImageDistance| / objectImageDistance
blurPx = (blurCircleMm / SENSOR_WIDTH_MM) * renderWidthPx
```

`focusDistanceM` viene del `subjectDistanceM` (o del `focusTargetId` en escena depth). `foregroundBlurPx` y `backgroundBlurPx` se calculan con las distancias del objeto respectivo.

Monotonías preservadas (testeadas):
1. f-número menor → más blur desenfocado
2. focal más larga a posición fija → más blur
3. distancia de enfoque más corta → DOF efectiva más estrecha
4. objeto a distancia de enfoque → blur ≈0

Capa Three.js: `blurPx` mapea a parámetros `DepthOfField`/bokeh (efecto visual clampedo, no exacto).

## 4. Desenfoque de movimiento

```ts
angularVelocityRadPerSec = speedMps / subjectDistanceM
angularTravel = angularVelocityRadPerSec * shutterSeconds
sensorTravelMm = focalLengthMm * angularTravel
blurPx = (sensorTravelMm / SENSOR_WIDTH_MM) * renderWidthPx
```

Clamp solo en trail visual, no en métrica `blurPx` (la métrica queda sin clamp para evaluación).

Relación causal v1:
`velocidad↑ + tiempo obturación↑ + focal↑ + distancia↓ → blur↑`

Testeado mediante comparaciones monótonas (1/30 vs 1/500, 24mm vs 135mm, 2m vs 8m).

**Panning** (solo reto C3 y Sandbox): aproximación pedagógica con ratio fijo 0.8:
```
si panningEnabled:
  motionBlurPx (sujeto) = base * 0.2
  backgroundMotionBlurPx = base * 0.8
sino:
  motionBlurPx = base
  backgroundMotionBlurPx = 0
```

## 5. Ruido ISO

```ts
isoStops = log2(iso/100)
noiseStrength = clamp01(isoStops / 5)
```

Determinista: 100→0, 3200→1 (5 pasos). Render mediante overlay/shader con patrón pseudoaleatorio estable (no ruido televisivo cambiante).

## 6. Clipping tonal
- Render lineal con `exposureMultiplier` → `toneMappingExposure`
- Sin recuperación RAW: región que llega a clamp alto/bajo pierde detalle visible
- Histograma (opcional) se computa de la captura escalada a 64×64 en canvas offscreen, 64 bins por defecto, luminancia `0.2126R+0.7152G+0.0722B`

## 7. Integración `simulateCapture`

```ts
simulateCapture(settings, {ev100, renderWidthPx, foregroundDistanceM, backgroundDistanceM, focusDistanceM, subjectSpeedMps})
→ {exposure, optics, motion, effects, metrics:{
     exposureDeltaAbs, motionBlurPx, backgroundMotionBlurPx,
     foregroundBlurPx, backgroundBlurPx, noiseStrength,
     highlightClippingRisk, shadowLossRisk, horizontalFovDeg, framingScale
   }}
```

- `framingScale = focalLengthMm / subjectDistanceM` (para regla `framing-similarity`)
- `exposureDeltaAbs = |deltaStops|`
- `motion.normalizedBlur = clamp01(blurPx/50)`, `direction=[1,0]`

Es la única integración usada por render y evaluación.

## Simplificaciones conocidas

- Sin balance de blancos, flash, RAW/JPEG, cambio de tamaño de sensor, estabilización, hyperfocal, shake, orientación vertical, zoom continuo, distancia continua, panning solo como reto avanzado
- Sin texturas remotas; escenas procedurales (runner, portrait, depth) con geometría primitiva y materiales neutros
- DOF y motion blur visuales son aproximaciones bokeh/trail, no trazado físico
- Ruido es overlay determinista, no granularidad de sensor
- Una vez clamp de tono alcanzado, no hay recuperación

Estas simplificaciones mantienen todas las relaciones causales evaluadas en misiones y mastery sin requerir WebGL para los tests de dominio.

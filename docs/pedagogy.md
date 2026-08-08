# Pedagogy — CameraLab v1

## Tesis
CameraLab enseña **compromisos fotográficos**, no reglas absolutas. El alumno *predice → manipula → observa → decide mejor*, no memoriza ni responde quizzes.

## Principios (no negociables)
- **Manipulación directa**: exposición, movimiento, profundidad, focal, distancia y enfoque se aprenden moviendo controles reales (valores discretos, pasos completos) y viendo la imagen cambiar.
- **Sin gamificación numérica**: sin notas, estrellas, puntos o certificados. El perfil final usa `Sólido / En desarrollo / Por explorar` por dominio, nunca una calificación.
- **Múltiples soluciones**: cada misión define restricciones de *resultado* (ej. motionBlurPx ≤4), nunca una configuración exacta “correcta”.
- **Feedback como trade-off**: tres secciones obligatorias — `Conseguiste / Observa / Compromiso` — explica consecuencias, no etiqueta decisiones como “malas”.
- **Revelación progresiva**: un control aparece solo cuando el aprendiz lo necesita (M1.1 solo obturación, M1.2 +ISO, etc.).
- **Navegación libre**: se recomienda un camino (siguiente módulo resaltado) pero nunca se bloquea un módulo; nota no bloqueante si se salta prerequisito.

## Máquina de flujo por misión
```
brief → predict-by-action → explore → capture → feedback → complete
```
`predict-by-action` no es quiz: el alumno elige una configuración antes de capturar; el sistema registra la primera configuración como predicción.

Capturas: 1 (resultado actual) → 2 (A/B guiada, destaca parámetro cambiado) → 3 (elige 3) → 5 (reto avanzado). Intentos ilimitados, ranuras visibles limitadas por `maxVisibleCaptures`.

## Pistas progresivas (3 niveles)
1. Dirige atención al fenómeno visual
2. Nombra el concepto controlador
3. Nombra el control y dirección del cambio
Nunca dan valor exacto en nivel 1-2.

Tras completar: muestra evidencia visual de la última captura, nombra relaciones causales logradas, declara un trade-off, recomienda siguiente actividad y permite navegación libre. Cada módulo cierra con resumen breve basado en evidencia del alumno (ej. “redujiste el desenfoque de movimiento entre tu primera y última captura”).

## Currículum (5 módulos ×3 + Sandbox + 3 transferencias)

**M1 Movimiento** (runner): shutter como tiempo de registro → trade-off luz/movimiento → compromiso poca luz.
**M2 Apertura** (portrait): separar sujeto (blur fondo) → mantener contexto → retrato con compromiso luz/ruido.
**M3 ISO y tonos** (portrait): recuperar exposición (ISO no es brillo) → evitar ruido → proteger altas/sombras (histograma solo tras primera captura).
**M4 Exposición como sistema** (portrait/runner): intercambio de un paso → misma exposición imagen distinta (dos tomas Δmov ≥6px con Δexp ≤0.5) → elegir compromiso con poca luz.
**M5 Óptica** (portrait/depth): campo visual vs focal (ΔFOV≥20°) → distancia+focal manteniendo framing (±15%) pero cambiando fondo → elegir plano de enfoque.

**Transferencia** (no es M6, máx 5 capturas): retrato editorial (aislar con contexto y poco ruido), corredor al anochecer (congelar con poca luz), panning intencional (obturación lenta + follow 0.8).

## Evaluación
`evaluateMission` opera solo sobre metadatos retenidos. Reglas:
- `metric` (última captura), `all-retained-captures-metric` (todas), `pair-metric-delta` (Δ entre 2 últimas), `setting-stop-delta` (índices en arrays de pasos completos), `distinct-setting-count`, `framing-similarity` (focal/distancia).
Pasa si cada regla con `weight>0` pasa; `weight` solo ordena feedback, no genera nota visible.

## Mastery
- `unexplored`: sin intento en concepto
- `developing`: intento o completado con mucho apoyo
- `solid`: al menos 2 aplicaciones exitosas, una con ≤1 pista
Nunca se muestran puntos. Tras segundo éxito con ≤1 pista, el concepto pasa a sólido.

## Accesibilidad pedagógica
- Lenguaje de herramienta creativa profesional, no juego
- Bilingüe es/en desde v1, con micro-etiquetas donde ayuda (Velocidad de obturación / Shutter speed)
- Histograma opcional (solo tras captura), sonido opcional (sintetizado), “reducir movimiento” sin animación innecesaria
- Vista 3D siempre acompañada de descripción textual del estado actual

## Referencia y sandbox
- Hoja de referencia fuera del flujo: escalas de apertura/obturación/ISO, concepto de un paso, categorías focales, recordatorios causa/efecto.
- Sandbox expone todos los controles + 5 presets (Freeze, Shallow portrait, Deep focus, Low light, Panning) que muestran inmediatamente cada parámetro cambiado; nunca resuelven misiones.

## Cierre
- Cada módulo termina con resumen evidencial conciso.
- Final Mastery muestra perfil por dominio sin examen; invita a aplicar en Sandbox y retos.
- Exportación de imágenes PNG con footer opcional (sin identidad) y telemetría JSON solo tras acción explícita.

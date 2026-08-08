import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import { useAppStore } from "./appStore";
import { hashToScreen, syncHash } from "./routes";
import { MODULES } from "../content/curriculum";
import { MISSIONS } from "../content/missions";
import { LabScreen } from "../features/lab/LabScreen";
import { Onboarding } from "../features/onboarding/Onboarding";
import { SandboxScreen } from "../features/sandbox/SandboxScreen";
import { ReferenceSheet } from "../features/reference/ReferenceSheet";
import { FinalMastery } from "../features/summary/FinalMastery";
import { SettingsPanel } from "../features/settings/SettingsPanel";
import { useProgressStore } from "../features/progress/progressStore";
import { useTranslation } from "react-i18next";
import { SceneCanvas } from "../scenes/SceneCanvas";

function Topbar() {
  const { navigate, screen } = useAppStore();
  const completed = useProgressStore((s) => s.completedMissionIds.length);
  const { t, i18n } = useTranslation();
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <button className="brand" onClick={() => navigate("home")} aria-label="Home">
          <span className="brand__mark">◎</span>
          <span>
            <div className="brand__name">CameraLab</div>
            <div className="brand__sub">estudio · lab</div>
          </span>
        </button>
        <nav className="nav" aria-label="Primary">
          <button className="nav__btn" aria-current={screen === "curriculum" ? "page" : undefined} onClick={() => navigate("curriculum")}>
            {t("nav.curriculum")}
          </button>
          <button className="nav__btn" onClick={() => navigate("sandbox")}>Sandbox</button>
          <button className="nav__btn" onClick={() => navigate("reference")}>{t("nav.reference")}</button>
          <button className="nav__btn" onClick={() => navigate("progress")}>
            {t("nav.progress")} {completed > 0 && <span className="kbd" style={{ marginLeft: 6 }}>{completed}/15</span>}
          </button>
          <button className="nav__btn" onClick={() => navigate("settings")} aria-label="Ajustes">
            ⚙
          </button>
          <button className="nav__btn" onClick={() => i18n.changeLanguage((i18n.language ?? "es") === "es" ? "en" : "es")} aria-label="Idioma" style={{ fontSize: 11 }}>
            {(i18n.language ?? "es").toUpperCase()}
          </button>
          <button className="nav__cta" onClick={() => navigate("onboarding")}>Comenzar</button>
        </nav>
      </div>
    </header>
  );
}

function Home() {
  const { navigate, openMission } = useAppStore();
  const { t } = useTranslation();
  const previewSettings = useMemo(() => ({ aperture: 2.8 as const, shutterDenominator: 250 as const, iso: 200 as const, focalLengthMm: 85 as const, subjectDistanceM: 2 as const, focusMode: "auto-subject" as const, focusTargetId: "portrait-subject", panningEnabled: false }), []);
  const isTestEnv = typeof navigator !== "undefined" && /jsdom|happy-dom/i.test(navigator.userAgent);
  return (
    <main>
      <section className="hero container">
        <div className="hero__grid">
          <div>
            <div className="pill" style={{ marginBottom: 16 }}>✦ Laboratorio 3D · Offline · Bilingüe</div>
            <h1 className="hero__title">
              Aprende fotografía <em>haciendo</em> fotos.
            </h1>
            <p className="hero__desc">
              {t("app.subtitle")} — mueve apertura, obturación, ISO, focal y distancia. Ve el efecto al instante. Sin quizzes, sin notas, solo decisiones con compromiso.
            </p>
            <div className="hero__actions">
              <button className="btn-primary" onClick={() => navigate("onboarding")}>Comenzar ahora →</button>
              <button className="btn-ghost" onClick={() => navigate("curriculum")}>{t("nav.curriculum")}</button>
              <button className="btn-ghost" onClick={() => navigate("sandbox")}>Abrir Sandbox</button>
            </div>
            <div className="hero__stats">
              <div className="stat"><div className="stat__k">Misiones</div><div className="stat__v">15 + 3 retos</div></div>
              <div className="stat"><div className="stat__k">Escenas</div><div className="stat__v">3 procedurales</div></div>
              <div className="stat"><div className="stat__k">Modo</div><div className="stat__v">Offline PWA</div></div>
            </div>
          </div>
          <div>
            <div className="hero__preview">
              {isTestEnv ? (
                <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "var(--panel)", color: "var(--muted)" }} data-testid="hero-preview-placeholder">Vista previa</div>
              ) : (
                <SceneCanvas sceneId="portrait" settings={previewSettings} sceneEv100={10} />
              )}
              <div style={{ position: "absolute", left: 12, top: 12, display: "flex", gap: 6 }}>
                <span className="pill" style={{ background: "var(--accent)", color: "var(--accent-ink)", borderColor: "var(--accent)" }}>● Live preview</span>
                <span className="pill">f/2.8 · 1/250 · ISO200 · 85mm</span>
              </div>
              <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ color: "white", background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 8 }}>arrastra · compara · decide</span>
                <button className="btn-primary" style={{ padding: "8px 12px", fontSize: 12 }} onClick={() => openMission("freeze-runner")}>Probar M1.1</button>
              </div>
            </div>
            <p className="mono muted" style={{ marginTop: 8, textAlign: "center" }}>Vista previa real — sin foto de stock, 100% procedural.</p>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2>Camino recomendado, navegación libre.</h2>
          <p>5 módulos progresivos. Entra donde quieras; el sistema solo sugiere.</p>
        </div>
        <div className="modules" style={{ marginBottom: 18 }}>
          {MODULES.slice(0, 3).map((m) => (
            <div key={m.id} className="module">
              <div className="module__top"><span className="module__id">{m.id.toUpperCase()}</span><span className="pill">{m.missionIds.length} misiones</span></div>
              <h3 className="module__title">{m.titleKey}</h3>
              <p className="module__desc">{m.descriptionKey}</p>
              <button className="mission-link" onClick={() => openMission(m.missionIds[0])}>Abrir →</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" onClick={() => navigate("curriculum")}>Ver currículo completo</button>
          <button className="btn-ghost" onClick={() => navigate("onboarding")}>¿Primera vez? 30s</button>
        </div>
      </section>

      <section className="section container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="panel">
            <h3>Sandbox libre</h3>
            <p className="muted" style={{ fontSize: 13 }}>Todos los controles + 5 presets (Congelar, Retrato suave, Foco profundo, Poca luz, Barrido). Ideal para creativos.</p>
            <button className="btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate("sandbox")}>Abrir Sandbox →</button>
          </div>
          <div className="panel">
            <h3>Hoja de referencia</h3>
            <p className="muted" style={{ fontSize: 13 }}>Escalas f/1.4–f/16, obturación, ISO, “un paso = doble luz”, categorías focales y causa/efecto.</p>
            <button className="btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate("reference")}>Ver referencia →</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Curriculum() {
  const { openMission } = useAppStore();
  const completedModuleIds = useProgressStore((s) => s.completedModuleIds);
  const recommended = MODULES.find((m) => !completedModuleIds.includes(m.id))?.id ?? null;
  return (
    <main className="container section">
      <div className="section__head">
        <div>
          <h1 style={{ margin: 0 }}>Currículo</h1>
          <p className="muted">Navegación libre — el sistema recomienda un camino pero nunca bloquea.</p>
        </div>
        <div className="pill">{completedModuleIds.length}/5 módulos</div>
      </div>
      <div className="modules">
        {MODULES.map((mod) => {
          const isRecommended = mod.id === recommended;
          const isLater = recommended ? MODULES.findIndex((x) => x.id === mod.id) > MODULES.findIndex((x) => x.id === recommended) : false;
          const showPrereq = isLater && completedModuleIds.length === 0;
          return (
            <section key={mod.id} data-testid={`module-${mod.id}`} data-recommended={isRecommended ? "true" : "false"} className={`module ${isRecommended ? "module--recommended" : ""}`}>
              <div className="module__top">
                <span className="module__id">{mod.id.toUpperCase()} · {mod.missionIds.length} misiones</span>
                {isRecommended && <span className="module__rec">Recomendado</span>}
              </div>
              <h2 className="module__title" style={{ fontSize: 18 }}>{mod.titleKey}</h2>
              <p className="module__desc">{mod.descriptionKey}</p>
              {showPrereq && (
                <div className="notice" data-testid={`prereq-note-${mod.id}`} style={{ marginBottom: 10 }}>
                  Puedes entrar aquí directamente; se recomienda completar módulos anteriores primero.
                </div>
              )}
              <ul className="module__missions">
                {mod.missionIds.map((mid) => {
                  const mission = MISSIONS.find((m) => m.id === mid);
                  return (
                    <li key={mid}>
                      <button data-testid={`mission-${mid}`} className="mission-link" onClick={() => openMission(mid)}>
                        <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: 11, marginRight: 6 }}>↗</span>
                        {mission?.titleKey ?? mid}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="module__foot">
                <button data-testid={`open-module-${mod.id}`} className="btn-ghost" style={{ flex: 1 }} onClick={() => openMission(mod.missionIds[0])}>
                  Abrir {mod.id}
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

export function App() {
  const { screen, currentMissionId } = useAppStore();
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  useEffect(() => {
    const onHash = () => {
      const { screen: s, missionId } = hashToScreen(window.location.hash);
      const state = useAppStore.getState();
      if (s !== state.screen || missionId !== state.currentMissionId) useAppStore.setState({ screen: s, currentMissionId: missionId });
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => { syncHash(screen, currentMissionId); }, [screen, currentMissionId]);

  if (isNarrow) {
    return (
      <div>
        <Topbar />
        <div className="container" style={{ padding: 24, textAlign: "center" }} data-testid="unsupported-notice">
          <h2>Pantalla pequeña no soportada</h2>
          <p className="muted">CameraLab v1 está diseñado para escritorio (1024×700 mínimo).</p>
        </div>
      </div>
    );
  }

  let content: React.ReactNode;
  switch (screen) {
    case "home": content = <Home />; break;
    case "curriculum": content = <Curriculum />; break;
    case "lab": content = currentMissionId ? <LabScreen missionId={currentMissionId} /> : <Curriculum />; break;
    case "sandbox": content = <SandboxScreen />; break;
    case "reference": content = <ReferenceSheet />; break;
    case "progress":
    case "final-mastery": content = <FinalMastery />; break;
    case "settings": content = <SettingsPanel />; break;
    case "onboarding": content = <Onboarding />; break;
    default: content = <Home />;
  }

  return (
    <div>
      <Topbar />
      <div style={{ minHeight: "calc(100vh - 70px)" }}>{content}</div>
      <footer style={{ borderTop: "1px solid var(--border)", padding: "16px 0", marginTop: 24 }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span className="mono muted">CameraLab v1 · estático · offline · sin tracking</span>
          <span className="mono muted">Hecho para creativos · <a href="#reference">Referencia</a> · <a href="#sandbox">Sandbox</a></span>
        </div>
      </footer>
    </div>
  );
}
export default App;

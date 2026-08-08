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

function Header() {
  const { navigate } = useAppStore();
  const { i18n } = useTranslation();
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="app-icon">📸</div>
        <div className="header-title">
          <h1>CameraLab</h1>
          <span className="header-subtitle">Iluminación &amp; Exposición</span>
        </div>
      </div>
      <div className="header-center"><div className="upca-badge">UPCA</div></div>
      <div className="header-right">
        <div className="language-switch" role="group" aria-label="Language">
          <button className={`language-btn ${i18n.language?.startsWith("es") ? "active" : ""}`} type="button" onClick={() => i18n.changeLanguage("es")} aria-pressed={i18n.language?.startsWith("es")}>ES</button>
          <button className={`language-btn ${i18n.language?.startsWith("en") ? "active" : ""}`} type="button" onClick={() => i18n.changeLanguage("en")} aria-pressed={i18n.language?.startsWith("en")}>EN</button>
        </div>
        <button className="icon-button" onClick={() => navigate("curriculum")} title="Currículo">☰</button>
        <button className="icon-button" onClick={() => navigate("settings")} title="Ajustes">⚙</button>
        <button className="icon-button" onClick={() => navigate("home")} title="Home">⌂</button>
      </div>
    </header>
  );
}

function ProgressBar() {
  const completed = useProgressStore((s) => s.completedMissionIds.length);
  const pct = (completed / 15) * 100;
  return (
    <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
  );
}

function Home() {
  const { navigate, openMission } = useAppStore();
  const { t } = useTranslation();
  const previewSettings = useMemo(() => ({ aperture: 2.8 as const, shutterDenominator: 250 as const, iso: 200 as const, focalLengthMm: 85 as const, subjectDistanceM: 2 as const, focusMode: "auto-subject" as const, focusTargetId: "portrait-subject", panningEnabled: false }), []);
  const isTestEnv = typeof navigator !== "undefined" && /jsdom|happy-dom/i.test(navigator.userAgent);
  return (
    <main style={{ paddingTop: 64 }}>
      <section className="hero container">
        <div className="hero__grid">
          <div>
            <div className="pill" style={{ marginBottom: 16 }}>✦ Laboratorio 3D · Offline · Bilingüe</div>
            <h1 className="hero__title">Aprende fotografía <em>haciendo</em> fotos.</h1>
            <p className="hero__desc">{t("app.subtitle")} — mueve apertura, obturación, ISO, focal y distancia. Ve el efecto al instante.</p>
            <div className="hero__actions">
              <button className="btn-primary" onClick={() => navigate("onboarding")}>Comenzar ahora →</button>
              <button className="btn-ghost" onClick={() => navigate("curriculum")}>{t("nav.curriculum")}</button>
              <button className="btn-ghost" onClick={() => navigate("sandbox")}>Abrir Sandbox</button>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
              <div className="stat"><div className="stat__k">Misiones</div><div className="stat__v">15 + 3 retos</div></div>
              <div className="stat"><div className="stat__k">Escenas</div><div className="stat__v">3 procedurales</div></div>
              <div className="stat"><div className="stat__k">Modo</div><div className="stat__v">Offline</div></div>
            </div>
          </div>
          <div>
            <div className="hero__preview">
              {isTestEnv ? <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", background: "var(--color-bg-secondary)", color: "var(--text-tertiary)" }} data-testid="hero-preview-placeholder">Vista previa</div> : <SceneCanvas sceneId="portrait" settings={previewSettings} sceneEv100={10} />}
              <div style={{ position: "absolute", left: 12, top: 12, display: "flex", gap: 6 }}>
                <span className="pill" style={{ background: "var(--upca-red)", color: "#fff", borderColor: "var(--upca-red)" }}>● Live</span>
                <span className="pill">f/2.8 · 1/250 · ISO200</span>
              </div>
              <div style={{ position: "absolute", left: 12, right: 12, bottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ color: "#fff", background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: 8 }}>arrastra · compara · decide</span>
                <button className="btn-primary" style={{ padding: "8px 12px", fontSize: 12 }} onClick={() => openMission("freeze-runner")}>Probar M1.1</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <h2>Camino recomendado, navegación libre.</h2>
          <p className="muted" style={{ maxWidth: 460 }}>5 módulos progresivos. Entra donde quieras; el sistema solo sugiere.</p>
        </div>
        <div className="modules" style={{ marginBottom: 18 }}>
          {MODULES.slice(0, 3).map((m) => (
            <div key={m.id} className="module">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span className="mono muted">{m.id.toUpperCase()}</span><span className="pill">{m.missionIds.length} misiones</span></div>
              <h3 style={{ margin: 0 }}>{m.titleKey}</h3>
              <p className="muted" style={{ fontSize: 13, margin: "6px 0 12px" }}>{m.descriptionKey}</p>
              <button className="mission-link" onClick={() => openMission(m.missionIds[0])}>Abrir →</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" onClick={() => navigate("curriculum")}>Ver currículo completo</button>
          <button className="btn-ghost" onClick={() => navigate("onboarding")}>¿Primera vez? 30s</button>
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
    <main className="container" style={{ paddingTop: 80, paddingBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <div><h1 style={{ margin: 0 }}>Currículo</h1><p className="muted">Navegación libre — el sistema recomienda un camino pero nunca bloquea.</p></div>
        <span className="pill">{completedModuleIds.length}/5 módulos</span>
      </div>
      <div className="modules">
        {MODULES.map((mod) => {
          const isRecommended = mod.id === recommended;
          const isLater = recommended ? MODULES.findIndex((x) => x.id === mod.id) > MODULES.findIndex((x) => x.id === recommended) : false;
          const showPrereq = isLater && completedModuleIds.length === 0;
          return (
            <section key={mod.id} data-testid={`module-${mod.id}`} data-recommended={isRecommended ? "true" : "false"} className={`module ${isRecommended ? "module--recommended" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="mono muted">{mod.id.toUpperCase()} · {mod.missionIds.length} misiones</span>
                {isRecommended && <span style={{ background: "var(--upca-red)", color: "#fff", padding: "4px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>Recomendado</span>}
              </div>
              <h2 style={{ margin: 0, fontSize: 18 }}>{mod.titleKey}</h2>
              <p className="muted" style={{ fontSize: 13, margin: "6px 0 12px" }}>{mod.descriptionKey}</p>
              {showPrereq && <div className="notice" data-testid={`prereq-note-${mod.id}`} style={{ marginBottom: 10 }}>Puedes entrar aquí directamente; se recomienda completar módulos anteriores primero.</div>}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {mod.missionIds.map((mid) => {
                  const mission = MISSIONS.find((m) => m.id === mid);
                  return <li key={mid}><button data-testid={`mission-${mid}`} className="mission-link" onClick={() => openMission(mid)}>{mission?.titleKey ?? mid}</button></li>;
                })}
              </ul>
              <button data-testid={`open-module-${mod.id}`} className="btn-ghost" style={{ width: "100%", marginTop: 12 }} onClick={() => openMission(mod.missionIds[0])}>Abrir {mod.id}</button>
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
    return <><Header /><ProgressBar /><div className="container" style={{ paddingTop: 80, textAlign: "center" }} data-testid="unsupported-notice"><h2>Pantalla pequeña no soportada</h2><p className="muted">CameraLab v1 está diseñado para escritorio (1024×700 mínimo).</p></div></>;
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

  const isLab = screen === "lab" && currentMissionId;
  return (
    <div>
      <Header />
      <ProgressBar />
      <div style={{ minHeight: "100vh", paddingTop: isLab ? 0 : 0 }}>{content}</div>
      {!isLab && <footer style={{ borderTop: "1px solid var(--glass-border-subtle)", padding: "16px 0", marginTop: 24 }}><div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}><span className="mono muted">CameraLab v1 · estático · offline · sin tracking</span><span className="mono muted">Hecho con LightStudio 3D · <a href="#reference">Referencia</a></span></div></footer>}
    </div>
  );
}
export default App;

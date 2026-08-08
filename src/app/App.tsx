import { useEffect, useState } from "react";
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

function TopBar() {
  const { navigate, screen } = useAppStore();
  const { t } = useTranslation();
  return (
    <header
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <button
        onClick={() => navigate("home")}
        style={{ background: "none", border: "none", color: "var(--fg)", cursor: "pointer", fontWeight: 700, fontSize: "18px" }}
        aria-label="Home"
      >
        CameraLab
      </button>
      <nav style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button onClick={() => navigate("curriculum")} aria-current={screen === "curriculum" ? "page" : undefined}>
          {t("nav.curriculum")}
        </button>
        <button onClick={() => navigate("progress")}>{t("nav.progress")}</button>
        <button onClick={() => navigate("reference")}>{t("nav.reference")}</button>
        <button onClick={() => navigate("settings")}>{t("nav.settings")}</button>
      </nav>
    </header>
  );
}

function HomeScreen() {
  const { navigate, openMission } = useAppStore();
  const { t } = useTranslation();
  return (
    <main style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>{t("app.title")}</h1>
      <p style={{ color: "var(--muted)" }}>{t("app.subtitle")}</p>
      <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
        <button onClick={() => navigate("onboarding")} style={{ padding: "10px 16px" }}>
          Comenzar / Start
        </button>
        <button onClick={() => navigate("curriculum")} style={{ padding: "10px 16px" }}>
          {t("nav.curriculum")}
        </button>
        <button onClick={() => navigate("sandbox")} style={{ padding: "10px 16px" }}>
          {t("nav.sandbox")}
        </button>
      </div>
      <section style={{ marginTop: "32px" }}>
        <h2>Acceso rápido</h2>
        <button onClick={() => openMission("freeze-runner")} data-testid="quick-m1-1">
          Ir a M1.1 Freeze Runner
        </button>
      </section>
    </main>
  );
}

function CurriculumScreen() {
  const { openMission } = useAppStore();
  const completedModuleIds = useProgressStore((s) => s.completedModuleIds);
  const recommended = MODULES.find((m) => !completedModuleIds.includes(m.id))?.id ?? null;

  return (
    <main style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Currículo</h1>
      <p style={{ color: "var(--muted)" }}>Navegación libre — el sistema recomienda un camino pero nunca bloquea.</p>
      <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
        {MODULES.map((mod) => {
          const isRecommended = mod.id === recommended;
          const isLater = recommended ? MODULES.findIndex((x) => x.id === mod.id) > MODULES.findIndex((x) => x.id === recommended) : false;
          const showPrereqNote = isLater && completedModuleIds.length === 0;
          return (
            <section
              key={mod.id}
              data-testid={`module-${mod.id}`}
              data-recommended={isRecommended ? "true" : "false"}
              style={{
                border: isRecommended ? "2px solid var(--accent)" : "1px solid var(--border)",
                padding: "16px",
                background: "var(--panel)",
                borderRadius: "8px",
              }}
            >
              <h2 style={{ margin: "0 0 8px" }}>
                {mod.titleKey} {isRecommended && <span style={{ fontSize: "12px", color: "var(--accent)" }}>(Recomendado)</span>}
              </h2>
              {showPrereqNote && (
                <p style={{ fontSize: "12px", color: "var(--muted)", margin: "0 0 8px" }} data-testid={`prereq-note-${mod.id}`}>
                  Nota: puedes entrar aquí directamente; se recomienda completar módulos anteriores primero.
                </p>
              )}
              <ul style={{ margin: 0, paddingLeft: "16px" }}>
                {mod.missionIds.map((mid) => {
                  const mission = MISSIONS.find((m) => m.id === mid);
                  return (
                    <li key={mid} style={{ margin: "6px 0" }}>
                      <button onClick={() => openMission(mid)} data-testid={`mission-${mid}`} style={{ cursor: "pointer" }}>
                        {mission?.titleKey ?? mid}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button data-testid={`open-module-${mod.id}`} style={{ marginTop: "8px" }} onClick={() => openMission(mod.missionIds[0])}>
                Abrir {mod.id}
              </button>
            </section>
          );
        })}
      </div>
    </main>
  );
}

function UnsupportedNotice() {
  return (
    <div style={{ padding: "24px", textAlign: "center" }} data-testid="unsupported-notice">
      <h2>Pantalla pequeña no soportada</h2>
      <p>CameraLab v1 está diseñado para escritorio (1024×700 mínimo). Por favor usa un portátil o escritorio.</p>
    </div>
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
      if (s !== state.screen || missionId !== state.currentMissionId) {
        useAppStore.setState({ screen: s, currentMissionId: missionId });
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    syncHash(screen, currentMissionId);
  }, [screen, currentMissionId]);

  if (isNarrow) {
    return (
      <div>
        <TopBar />
        <UnsupportedNotice />
      </div>
    );
  }

  let content: React.ReactNode;
  switch (screen) {
    case "home":
      content = <HomeScreen />;
      break;
    case "curriculum":
      content = <CurriculumScreen />;
      break;
    case "lab":
      content = currentMissionId ? <LabScreen missionId={currentMissionId} /> : <CurriculumScreen />;
      break;
    case "sandbox":
      content = <SandboxScreen />;
      break;
    case "reference":
      content = <ReferenceSheet />;
      break;
    case "progress":
      content = <FinalMastery />;
      break;
    case "settings":
      content = <SettingsPanel />;
      break;
    case "onboarding":
      content = <Onboarding />;
      break;
    case "final-mastery":
      content = <FinalMastery />;
      break;
    default:
      content = <HomeScreen />;
  }

  return (
    <div>
      <TopBar />
      <div style={{ minHeight: "calc(100vh - 56px)" }}>{content}</div>
      <footer style={{ padding: "12px", textAlign: "center", fontSize: "11px", color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
        CameraLab v1 — laboratorio estático, offline, sin tracking. <a href="#reference">Referencia</a>
      </footer>
    </div>
  );
}

export default App;

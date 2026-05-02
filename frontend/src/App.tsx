import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import { LoginScreen } from "./components/auth/LoginScreen";
import { LandingPage } from "./components/landing/LandingPage";
import { AppShell } from "./components/layout/AppShell";

import { API_BASE, formTemplates, portalConfig } from "./config/appConfig";
import { useHashView } from "./hooks/useHashView";
import { getDashboardCopy } from "./lib/dashboardContent";
import { buildScenarioTitle, buildShareSummary } from "./lib/scenarioUtils";

import {
  clearStoredSession,
  deleteScenarioHistory,
  loadScenarioHistory,
  loadStoredSession,
  saveScenarioHistory,
  storeSession
} from "./lib/storage";

import { HistoryView } from "./views/HistoryView";
import { HomeView } from "./views/HomeView";
import { WorkspaceView } from "./views/WorkspaceView";

import type {
  ApiMessage,
  Credentials,
  FormControlChangeEvent,
  FormSubmitEvent,
  PortalRole,
  PreviewData,
  QuoteForm,
  QuoteResult,
  SavedScenario,
  SessionData
} from "./types/app";

export default function App() {
  const [portal, setPortal] = useState<PortalRole>("FREELANCER");
  const [credentials, setCredentials] = useState<Credentials>({
    email: portalConfig.FREELANCER.demoEmail,
    password: "demo123"
  });

  const [session, setSession] = useState<SessionData | null>(() => loadStoredSession());

  const [publicView, setPublicView] = useState<"landing" | "login">("landing");

  const [form, setForm] = useState(formTemplates.FREELANCER);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);

  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const { currentView, navigateToView } = useHashView();

  useEffect(() => {
    if (!session) {
      setForm(formTemplates[portal]);
      setResult(null);
      setCredentials({
        email: portalConfig[portal].demoEmail,
        password: "demo123"
      });
      return;
    }

    setPortal(session.role);
    setForm(formTemplates[session.role]);
    setSavedScenarios(loadScenarioHistory(session.role));
  }, [portal, session]);

  async function handleLogin(event: FormSubmitEvent): Promise<void> {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: portal,
          email: credentials.email,
          password: credentials.password
        })
      });

      const payload = (await response.json()) as SessionData & ApiMessage;

      if (!response.ok) {
        throw new Error(payload.message || "No fue posible iniciar sesion.");
      }

      const nextSession = payload as SessionData;

      storeSession(nextSession);
      setSession(nextSession);
      setForm(formTemplates[nextSession.role]);
      setSavedScenarios(loadScenarioHistory(nextSession.role));
      setResult(null);

      navigateToView("home", { replace: true, smooth: false });
    } catch (loginError) {
      setAuthError(loginError instanceof Error ? loginError.message : "No fue posible iniciar sesion.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout(): Promise<void> {
    if (session?.token) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: {
          "X-Auth-Token": session.token
        }
      }).catch(() => null);
    }

    clearStoredSession();
    setSession(null);
    setResult(null);
    setSavedScenarios([]);
    setError("");
    setAuthError("");
    setCopyStatus("");

    setPublicView("landing");

    navigateToView("home", { replace: true, smooth: false });
  }

  async function handleSubmit(event: FormSubmitEvent): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!session) return;

    try {
      const response = await fetch(`${API_BASE}/quotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": session.token
        },
        body: JSON.stringify({
          ...form,
          role: session.role,
          hours: Number(form.hours),
          revisions: Number(form.revisions),
          overheadPercent: Number(form.overheadPercent),
          contingencyPercent: Number(form.contingencyPercent),
          monthlyIncomeGoal: Number(form.monthlyIncomeGoal),
          monthlyBillableHours: Number(form.monthlyBillableHours)
        })
      });

      const payload = (await response.json()) as QuoteResult & ApiMessage;

      if (!response.ok) {
        if (response.status === 401) {
          clearStoredSession();
          setSession(null);
          throw new Error("Tu sesion expiro. Vuelve a iniciar sesion.");
        }

        throw new Error(payload.message || "No fue posible calcular.");
      }

      setResult(payload as QuoteResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al calcular.");
    } finally {
      setLoading(false);
    }
  }

  function handleCredentialsChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleChange(event: FormControlChangeEvent) {
    const { name, value, type } = event.target;

    const nextValue =
      type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : ["hours", "revisions", "overheadPercent", "contingencyPercent", "monthlyIncomeGoal", "monthlyBillableHours"].includes(name)
        ? Number(value)
        : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue
    }) as QuoteForm);
  }

  function handlePortalSwitch(nextPortal: PortalRole) {
    if (session) return;

    setPortal(nextPortal);
    setCredentials({
      email: portalConfig[nextPortal].demoEmail,
      password: "demo123"
    });
  }

  function handleReset() {
    if (!session) return;

    setForm(formTemplates[session.role]);
    setResult(null);
    setError("");
  }

  function handleSaveScenario() {
    if (!result || !session) return;

    const scenario = {
      id: crypto.randomUUID(),
      role: session.role,
      createdAt: new Date().toISOString(),
      form: { ...form, role: session.role },
      result,
      title: buildScenarioTitle(session.role, form)
    };

    const next = saveScenarioHistory(session.role, scenario);
    setSavedScenarios(next);
  }

  function handleLoadScenario(s: SavedScenario) {
    setForm(s.form);
    setResult(s.result);
    setError("");
    navigateToView("workspace");
  }

  function handleDeleteScenario(id: string) {
    if (!session) return;

    setSavedScenarios(deleteScenarioHistory(session.role, id));
  }

  function handleStartEstimate() {
    if (!session) return;

    setResult(null);
    setForm(formTemplates[session.role]);
    setError("");
    navigateToView("workspace");
  }

  async function handleCopySummary() {
    if (!result || !session) return;

    const summary = buildShareSummary(session.role, form, result);

    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("Copiado");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch {
      setCopyStatus("Error");
    }
  }

  // 🔥 NUEVO FLUJO
  if (!session) {
    if (publicView === "landing") {
      return (
        <LandingPage
          onStart={() => setPublicView("login")}
          onChoosePortal={(p) => {
            handlePortalSwitch(p);
            setPublicView("login");
          }}
        />
      );
    }

    return (
      <LoginScreen
        portal={portal}
        credentials={credentials}
        authLoading={authLoading}
        authError={authError}
        onPortalSwitch={handlePortalSwitch}
        onCredentialsChange={handleCredentialsChange}
        onSubmit={handleLogin}
        onBack={() => setPublicView("landing")}
      />
    );
  }

  const currentPortal = portalConfig[session.role];
  const isCompany = session.role === "EMPRESA";

  const preview: PreviewData = {
    monthlyFloor:
      Math.round((Number(form.monthlyIncomeGoal) / Number(form.monthlyBillableHours || 1)) * 100) / 100,
    urgencyLabel: form.rushDelivery ? "Urgente" : "Normal"
  };

  const dashboardCopy = getDashboardCopy({
    currentView,
    form,
    isCompany,
    preview,
    savedScenarios
  });

  function renderCurrentView() {
    if (currentView === "workspace") {
      return (
        <WorkspaceView
          isCompany={isCompany}
          currentPortal={currentPortal}
          form={form}
          loading={loading}
          error={error}
          result={result}
          copyStatus={copyStatus}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
          onSaveScenario={handleSaveScenario}
          onCopySummary={handleCopySummary}
        />
      );
    }

    if (currentView === "history") {
      return (
        <HistoryView
          isCompany={isCompany}
          savedScenarios={savedScenarios}
          onLoadScenario={handleLoadScenario}
          onDeleteScenario={handleDeleteScenario}
        />
      );
    }

    return (
      <HomeView
        isCompany={isCompany}
        savedScenarios={savedScenarios}
        form={form}
        onStartEstimate={handleStartEstimate}
        onGoToHistory={() => navigateToView("history")}
      />
    );
  }

  return (
    <div className={`app-shell ${currentPortal.accentClass}`}>
      <main className="workspace">
        <AppShell
          currentPortal={currentPortal}
          currentView={currentView}
          currentViewCopy={dashboardCopy.currentViewCopy}
          currentHero={dashboardCopy.currentHero}
          heroClassName={dashboardCopy.heroClassName}
          heroHighlights={dashboardCopy.heroHighlights}
          workspaceMeta={dashboardCopy.workspaceMeta}
          isCompany={isCompany}
          session={session}
          preview={preview}
          marketContextLabel={form.market === "INTERNACIONAL" ? "Internacional" : "Local"}
          onNavigate={navigateToView}
          onLogout={handleLogout}
        >
          {renderCurrentView()}
        </AppShell>
      </main>
    </div>
  );
}
import { useEffect, useState } from "react";
import pricePilotLogo from "./assets/logo_PP.png";

const API_BASE = "/api";
const SESSION_KEY = "price-pilot-session";
const HISTORY_KEY = "price-pilot-history";

const portalConfig = {
  FREELANCER: {
    label: "Freelancer / Independiente",
    eyebrow: "Portal independiente",
    title: "Define cuanto cobrar sin regalar tu trabajo",
    description:
      "Calcula tarifa por hora, anticipo, paquetes y piso sostenible para vender mejor tus servicios.",
    accentClass: "portal-freelancer",
    demoEmail: "freelancer@pricepilot.app"
  },
  EMPRESA: {
    label: "Empresa",
    eyebrow: "Portal empresa",
    title: "Estima cuanto pagar y cuanto cuesta contratar bien",
    description:
      "Obtén referencia de sueldo mensual, costo empresa y presupuesto por proyecto para perfiles externos o internos.",
    accentClass: "portal-company",
    demoEmail: "empresa@pricepilot.app"
  }
};

const formTemplates = {
  FREELANCER: {
    role: "FREELANCER",
    service: "DESARROLLO",
    experience: "SEMI_SENIOR",
    complexity: "MEDIA",
    market: "LOCAL",
    hours: 24,
    revisions: 2,
    overheadPercent: 15,
    contingencyPercent: 10,
    monthlyIncomeGoal: 2500,
    monthlyBillableHours: 120,
    rushDelivery: false
  },
  EMPRESA: {
    role: "EMPRESA",
    service: "DESARROLLO",
    experience: "SEMI_SENIOR",
    complexity: "MEDIA",
    market: "LOCAL",
    hours: 160,
    revisions: 2,
    overheadPercent: 18,
    contingencyPercent: 12,
    monthlyIncomeGoal: 3200,
    monthlyBillableHours: 160,
    rushDelivery: false
  }
};

const options = {
  service: [
    { value: "DISENO", label: "Diseno" },
    { value: "DESARROLLO", label: "Desarrollo" },
    { value: "CONSULTORIA", label: "Consultoria" },
    { value: "MARKETING", label: "Marketing" },
    { value: "FOTOGRAFIA_VIDEO", label: "Fotografia / Video" }
  ],
  experience: [
    { value: "JUNIOR", label: "Junior" },
    { value: "SEMI_SENIOR", label: "Semi senior" },
    { value: "SENIOR", label: "Senior" }
  ],
  complexity: [
    { value: "BAJA", label: "Baja" },
    { value: "MEDIA", label: "Media" },
    { value: "ALTA", label: "Alta" }
  ],
  market: [
    { value: "LOCAL", label: "Local" },
    { value: "INTERNACIONAL", label: "Internacional" }
  ]
};

export default function App() {
  const [portal, setPortal] = useState("FREELANCER");
  const [credentials, setCredentials] = useState({
    email: portalConfig.FREELANCER.demoEmail,
    password: "demo123"
  });
  const [session, setSession] = useState(() => loadStoredSession());
  const [form, setForm] = useState(formTemplates.FREELANCER);
  const [result, setResult] = useState(null);
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [displayCurrency, setDisplayCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(4000);
  const [currentView, setCurrentView] = useState("home");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

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

  async function handleLogin(event) {
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

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "No fue posible iniciar sesion.");
      }

      storeSession(payload);
      setSession(payload);
      setForm(formTemplates[payload.role]);
      setSavedScenarios(loadScenarioHistory(payload.role));
      setResult(null);
      setCurrentView("home");
    } catch (loginError) {
      setAuthError(loginError.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogout() {
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
    setCurrentView("home");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

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

      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          clearStoredSession();
          setSession(null);
          throw new Error("Tu sesion expiro. Vuelve a iniciar sesion.");
        }
        throw new Error(payload.message || "No fue posible calcular la recomendacion.");
      }

      setResult(payload);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCredentialsChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleCurrencyChange(event) {
    setDisplayCurrency(event.target.value);
  }

  function handleExchangeRateChange(event) {
    setExchangeRate(Number(event.target.value));
  }

  function handlePortalSwitch(nextPortal) {
    if (session) {
      return;
    }

    setPortal(nextPortal);
    setCredentials({
      email: portalConfig[nextPortal].demoEmail,
      password: "demo123"
    });
  }

  function handleReset() {
    setForm(formTemplates[session.role]);
    setResult(null);
    setError("");
  }

  function handleSaveScenario() {
    if (!result || !session) {
      return;
    }

    const scenario = {
      id: crypto.randomUUID(),
      role: session.role,
      createdAt: new Date().toISOString(),
      form: {
        ...form,
        role: session.role
      },
      result,
      title: buildScenarioTitle(session.role, form)
    };

    const nextScenarios = saveScenarioHistory(session.role, scenario);
    setSavedScenarios(nextScenarios);
  }

  function handleLoadScenario(scenario) {
    setForm(scenario.form);
    setResult(scenario.result);
    setError("");
    setCurrentView("workspace");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDeleteScenario(id) {
    const nextScenarios = deleteScenarioHistory(session.role, id);
    setSavedScenarios(nextScenarios);
  }

  function handleStartEstimate() {
    setCurrentView("workspace");
    setResult(null);
    setForm(formTemplates[session.role]);
    setError("");
  }

  async function handleCopySummary() {
    if (!result) {
      return;
    }

    const summary = buildShareSummary(session.role, form, result, displayCurrency, exchangeRate);
    try {
      await navigator.clipboard.writeText(summary);
      setCopyStatus("Resumen copiado");
      window.setTimeout(() => setCopyStatus(""), 2200);
    } catch {
      setCopyStatus("No se pudo copiar");
      window.setTimeout(() => setCopyStatus(""), 2200);
    }
  }

  if (!session) {
    return (
      <LoginScreen
        portal={portal}
        credentials={credentials}
        authLoading={authLoading}
        authError={authError}
        onPortalSwitch={handlePortalSwitch}
        onCredentialsChange={handleCredentialsChange}
        onSubmit={handleLogin}
      />
    );
  }

  const currentPortal = portalConfig[session.role];
  const completion = Math.round(
    (Object.values(form).filter((value) =>
      typeof value === "boolean" ? true : String(value).length > 0
    ).length /
      Object.keys(form).length) *
      100
  );

  const preview = {
    monthlyFloor:
      Math.round((Number(form.monthlyIncomeGoal) / Number(form.monthlyBillableHours || 1)) * 100) / 100,
    revisionPenalty: Math.max(0, Number(form.revisions) - 2) * 4,
    urgencyLabel: form.rushDelivery ? "Urgente" : "Normal"
  };

  const isCompany = session.role === "EMPRESA";
  const convertedPreviewFloor = convertAmount(preview.monthlyFloor, displayCurrency, exchangeRate);

  return (
    <div className={`app-shell ${currentPortal.accentClass}`}>
      <main className="workspace">
        <section className="app-toolbar">
          <div className="toolbar-left">
            <div className="brand-block top">
              <img className="brand-logo" src={pricePilotLogo} alt="Price Pilot" />
            </div>
            <nav className="side-nav top-nav">
              <button
                className={`nav-item ${currentView === "home" ? "active" : ""}`}
                type="button"
                onClick={() => setCurrentView("home")}
              >
                Inicio
              </button>
              <button
                className={`nav-item ${currentView === "workspace" ? "active" : ""}`}
                type="button"
                onClick={() => setCurrentView("workspace")}
              >
                Cotizador
              </button>
              <button
                className={`nav-item ${currentView === "history" ? "active" : ""}`}
                type="button"
                onClick={() => setCurrentView("history")}
              >
                Historial
              </button>
            </nav>
          </div>

          <div className="toolbar-right">
            <section className="toolbar-card emphasis">
              <span className="mini-label">Sesion activa</span>
              <strong>{session.name}</strong>
              <p>{session.dashboardSubtitle}</p>
            </section>

            <section className="toolbar-card">
              <span className="mini-label">Perfil</span>
              <strong>{currentPortal.label}</strong>
              <p>{session.email}</p>
            </section>

            <section className="toolbar-card compact">
              <span className="mini-label">Captura</span>
              <strong>{completion}%</strong>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${completion}%` }} />
              </div>
            </section>

            <section className="toolbar-card compact">
              <span className="mini-label">Preview</span>
              <p>Piso: {formatCurrency(convertedPreviewFloor, displayCurrency)}</p>
              <p>Urgencia: {preview.urgencyLabel}</p>
            </section>
          </div>

          <div className="toolbar-actions">
            <button className="logout-button top" type="button" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        </section>

        <header className="topbar">
          <div>
            <p className="page-kicker">{isCompany ? "Company Planning" : "Independent Pricing"}</p>
            <h2>{currentPortal.title}</h2>
          </div>
          <div className="topbar-meta">
            <label className="currency-control">
              <span>Moneda</span>
              <select value={displayCurrency} onChange={handleCurrencyChange}>
                <option value="USD">USD</option>
                <option value="COP">COP</option>
              </select>
            </label>
            {displayCurrency === "COP" ? (
              <label className="currency-control rate">
                <span>Tasa USD/COP</span>
                <input type="number" min="1" value={exchangeRate} onChange={handleExchangeRateChange} />
              </label>
            ) : null}
            <div className="topbar-chip">
              <span className="chip-dot" />
              {currentPortal.label}
            </div>
            <div className="topbar-chip muted">
              {isCompany ? "Hiring Workspace" : "Proposal Workspace"}
            </div>
          </div>
        </header>

        <section className="hero-banner">
          <div className="hero-copy">
            <span className="section-tag">{isCompany ? "Company Mode" : "Freelancer Mode"}</span>
            <h3>{isCompany ? "Cuanto pagar por proyecto o por mes" : "Cuanto cobrar por proyecto o por mes"}</h3>
            <p>{currentPortal.description}</p>
          </div>

          <div className="hero-summary">
            <SummaryCard label="Meta mensual" value={displayAmount(form.monthlyIncomeGoal, displayCurrency, exchangeRate)} />
            <SummaryCard label="Horas mensuales" value={`${form.monthlyBillableHours} h`} />
            <SummaryCard label="Contingencia" value={`${form.contingencyPercent}%`} />
          </div>
        </section>

        <section className="workspace-strip">
          <InfoPill label={isCompany ? "Modo" : "Enfoque"} value={isCompany ? "Contratacion y presupuesto" : "Cotizacion y margen"} />
          <InfoPill label="Mercado" value={form.market === "INTERNACIONAL" ? "Internacional" : "Local"} />
          <InfoPill label="Senioridad" value={labelForOption(options.experience, form.experience)} />
          <InfoPill label="Servicio" value={labelForOption(options.service, form.service)} />
          <InfoPill label="Moneda visible" value={displayCurrency === "COP" ? `COP · ${exchangeRate}` : "USD"} />
        </section>

        {currentView === "home" ? (
          <section className="home-grid">
            <article className="panel home-panel home-hero-panel">
              <span className="mini-label">Bienvenido</span>
              <h3>{isCompany ? "Organiza tu presupuesto antes de cotizar o contratar" : "Prepara una cotización con mejor criterio comercial"}</h3>
              <p>
                {isCompany
                  ? "Empieza una nueva simulación para estimar pago por hora, sueldo mensual y costo empresa, o revisa escenarios guardados para comparar decisiones."
                  : "Empieza una nueva simulación para calcular tu tarifa, anticipo y paquetes de propuesta, o vuelve a cotizaciones guardadas para recuperar escenarios."}
              </p>
              <div className="home-actions">
                <button className="primary-button" type="button" onClick={handleStartEstimate}>
                  {isCompany ? "Nueva simulación" : "Nueva cotización"}
                </button>
                <button className="secondary-button" type="button" onClick={() => setCurrentView("history")}>
                  Ver historial
                </button>
              </div>
            </article>

            <article className="panel home-panel">
              <span className="mini-label">Qué puedes hacer</span>
              <div className="home-card-list">
                <FeatureCard
                  title={isCompany ? "Estimar costo mensual" : "Definir tarifa por hora"}
                  copy={isCompany
                    ? "Obtén una referencia rápida de sueldo mensual y costo empresa del perfil."
                    : "Calcula un rango defendible según mercado, complejidad y tu meta mensual."}
                />
                <FeatureCard
                  title={isCompany ? "Comparar escenarios" : "Guardar propuestas"}
                  copy={isCompany
                    ? "Guarda simulaciones para revisar alternativas de presupuesto."
                    : "Recupera cotizaciones guardadas y compara opciones con distintos márgenes."}
                />
                <FeatureCard
                  title={isCompany ? "Copiar resumen ejecutivo" : "Copiar resumen comercial"}
                  copy={isCompany
                    ? "Comparte un resumen del presupuesto con tu equipo."
                    : "Comparte una síntesis de la propuesta con clientes o aliados."}
                />
              </div>
            </article>

            <article className="panel home-panel">
              <span className="mini-label">Resumen rápido</span>
              <div className="metric-grid">
                <Metric
                  label="Moneda visible"
                  value={displayCurrency === "COP" ? "COP" : "USD"}
                  note={displayCurrency === "COP" ? `Tasa ${exchangeRate}` : "Base del sistema"}
                />
                <Metric
                  label="Simulaciones guardadas"
                  value={`${savedScenarios.length}`}
                  note={isCompany ? "Escenarios disponibles" : "Cotizaciones disponibles"}
                />
                <Metric
                  label="Mercado actual"
                  value={form.market === "INTERNACIONAL" ? "Internacional" : "Local"}
                  note="Contexto del escenario"
                />
                <Metric
                  label="Servicio actual"
                  value={labelForOption(options.service, form.service)}
                  note="Configuración base"
                />
              </div>
            </article>
          </section>
        ) : null}

        {currentView === "workspace" ? (
          <section className="dashboard-grid">
          <form className="panel quote-panel" onSubmit={handleSubmit}>
            <div className="panel-head">
              <div>
                <span className="mini-label">Entrada de datos</span>
                <h3>{isCompany ? "Configurar contratacion" : "Configurar cotizacion"}</h3>
              </div>
              <span className="panel-badge">Perfil bloqueado: {currentPortal.label}</span>
            </div>

            <div className="section-block">
              <h4>{isCompany ? "Perfil del talento y contexto" : "Servicio y contexto comercial"}</h4>
              <div className="field-grid">
                <Field label="Linea de servicio" name="service" value={form.service} options={options.service} onChange={handleChange} />
                <Field label="Senioridad" name="experience" value={form.experience} options={options.experience} onChange={handleChange} />
                <Field label="Complejidad" name="complexity" value={form.complexity} options={options.complexity} onChange={handleChange} />
                <Field label="Mercado" name="market" value={form.market} options={options.market} onChange={handleChange} />
                <NumberField
                  label={isCompany ? "Horas mensuales o de proyecto" : "Horas del proyecto"}
                  name="hours"
                  value={form.hours}
                  min="1"
                  max="500"
                  onChange={handleChange}
                />
                {isCompany ? (
                  <ToggleField
                    label="Contratacion urgente"
                    name="rushDelivery"
                    checked={form.rushDelivery}
                    onChange={handleChange}
                    hint="Activa una prima por prioridad y menor margen de busqueda."
                  />
                ) : (
                  <NumberField label="Revisiones incluidas" name="revisions" value={form.revisions} min="0" max="10" onChange={handleChange} />
                )}
              </div>
            </div>

            <div className="section-block">
              <h4>{isCompany ? "Presupuesto y costos" : "Proteccion de margen"}</h4>
              <div className="field-grid">
                {isCompany ? (
                  <>
                    <NumberField label="Presupuesto objetivo mensual USD" name="monthlyIncomeGoal" value={form.monthlyIncomeGoal} min="200" max="100000" onChange={handleChange} />
                    <NumberField label="Horas productivas estimadas al mes" name="monthlyBillableHours" value={form.monthlyBillableHours} min="10" max="240" onChange={handleChange} />
                    <NumberField label="Costo operativo adicional %" name="overheadPercent" value={form.overheadPercent} min="0" max="80" onChange={handleChange} />
                    <NumberField label="Colchon de riesgo %" name="contingencyPercent" value={form.contingencyPercent} min="0" max="40" onChange={handleChange} />
                  </>
                ) : (
                  <>
                    <NumberField label="Revisiones incluidas" name="revisions" value={form.revisions} min="0" max="10" onChange={handleChange} />
                    <NumberField label="Overhead operativo %" name="overheadPercent" value={form.overheadPercent} min="0" max="80" onChange={handleChange} />
                    <NumberField label="Contingencia %" name="contingencyPercent" value={form.contingencyPercent} min="0" max="40" onChange={handleChange} />
                    <NumberField label="Meta mensual USD" name="monthlyIncomeGoal" value={form.monthlyIncomeGoal} min="200" max="100000" onChange={handleChange} />
                    <NumberField label="Horas facturables al mes" name="monthlyBillableHours" value={form.monthlyBillableHours} min="10" max="240" onChange={handleChange} />
                    <ToggleField
                      label="Entrega urgente"
                      name="rushDelivery"
                      checked={form.rushDelivery}
                      onChange={handleChange}
                      hint="Activa una prima por prioridad y riesgo."
                    />
                  </>
                )}
              </div>
            </div>

            <div className="action-strip">
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Calculando..." : isCompany ? "Calcular pago sugerido" : "Calcular tarifa sugerida"}
              </button>
              <button className="secondary-button" type="button" onClick={handleReset}>
                Reiniciar formulario
              </button>
              <p>
                {isCompany
                  ? "Obtendras referencia de pago por hora, sueldo mensual y costo empresa."
                  : "Obtendras tarifa por hora, anticipo, piso sostenible y paquetes de propuesta."}
              </p>
            </div>

            {error ? <p className="error-banner">{error}</p> : null}
          </form>

          <section className="panel insights-panel">
            <div className="panel-head">
              <div>
                <span className="mini-label">Salida analitica</span>
                <h3>{isCompany ? "Presupuesto recomendado" : "Propuesta recomendada"}</h3>
              </div>
              <span className="panel-badge success">Sesion protegida</span>
            </div>

            {result ? (
              <div className="results-layout">
                {isCompany ? (
                  <>
                    <div className="metric-grid metric-grid-company">
                      <Metric
                        label="Pago por hora"
                        value={`${displayAmount(result.lowHourlyRate, displayCurrency, exchangeRate)} - ${displayAmount(result.highHourlyRate, displayCurrency, exchangeRate)}`}
                        note="Rango sugerido para contratacion"
                      />
                      <Metric
                        label="Costo empresa"
                        value={displayAmount(result.estimatedMonthlyCompanyCost, displayCurrency, exchangeRate)}
                        note="Costo integral aproximado"
                      />
                      <Metric
                        label="Sueldo mensual estimado"
                        value={displayAmount(result.estimatedMonthlySalary, displayCurrency, exchangeRate)}
                        note="Referencia mensual del perfil"
                      />
                      <Metric
                        label="Presupuesto de proyecto"
                        value={displayAmount(result.totalRecommendedBudget, displayCurrency, exchangeRate)}
                        note={`${result.hours} horas consideradas`}
                      />
                    </div>

                    <div className="metric-grid wide metric-grid-company-secondary">
                      <Metric
                        label="Valor recomendado"
                        value={displayAmount(result.centralHourlyRate, displayCurrency, exchangeRate)}
                        note="Punto central de negociacion"
                      />
                      <Metric
                        label="Reserva sugerida"
                        value={displayAmount(result.recommendedDepositAmount, displayCurrency, exchangeRate)}
                        note={`${result.recommendedDepositPercent}% sugerido`}
                      />
                      <Metric
                        label="Riesgo"
                        value={result.riskLevel}
                        note="Lectura comercial"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="metric-grid">
                      <Metric
                        label="Tarifa por hora"
                        value={`${displayAmount(result.lowHourlyRate, displayCurrency, exchangeRate)} - ${displayAmount(result.highHourlyRate, displayCurrency, exchangeRate)}`}
                        note="Rango sugerido"
                      />
                      <Metric
                        label="Tarifa recomendada"
                        value={displayAmount(result.centralHourlyRate, displayCurrency, exchangeRate)}
                        note="Punto central"
                      />
                      <Metric
                        label="Piso sostenible"
                        value={displayAmount(result.sustainableHourlyFloor, displayCurrency, exchangeRate)}
                        note="Minimo sano por hora"
                      />
                      <Metric
                        label="Proyecto recomendado"
                        value={displayAmount(result.totalRecommendedBudget, displayCurrency, exchangeRate)}
                        note={`${result.hours} horas consideradas`}
                      />
                      <Metric
                        label="Anticipo sugerido"
                        value={displayAmount(result.recommendedDepositAmount, displayCurrency, exchangeRate)}
                        note={`${result.recommendedDepositPercent}% sugerido`}
                      />
                      <Metric
                        label="Riesgo"
                        value={result.riskLevel}
                        note="Lectura comercial"
                      />
                    </div>

                    <div className="metric-grid wide">
                      <Metric
                        label="Sueldo mensual estimado"
                        value={displayAmount(result.estimatedMonthlySalary, displayCurrency, exchangeRate)}
                        note="Referencia de mensualizacion"
                      />
                      <Metric
                        label="Costo empresa"
                        value={displayAmount(result.estimatedMonthlyCompanyCost, displayCurrency, exchangeRate)}
                        note="Costo integral aproximado"
                      />
                      <Metric
                        label="Paquete premium"
                        value={displayAmount(result.packageBudgets.premium, displayCurrency, exchangeRate)}
                        note="Mayor cobertura y holgura"
                      />
                    </div>
                  </>
                )}

                <article className="info-block highlight">
                  <span className="mini-label">{isCompany ? "Lectura de presupuesto" : "Narrativa comercial"}</span>
                  <p>{result.negotiationScript}</p>
                </article>

                <article className="info-block">
                  <span className="mini-label">Lectura del sistema</span>
                  <p>{result.executiveSummary}</p>
                </article>

                <article className="info-block">
                  <span className="mini-label">{isCompany ? "Recomendacion de contratacion" : "Recomendacion de mensualizacion"}</span>
                  <p>{result.hiringRecommendation}</p>
                </article>

                <article className="info-block">
                  <span className="mini-label">Alcance y control</span>
                  <p>{result.scopeRecommendation}</p>
                </article>

                {isCompany ? (
                  <article className="info-block">
                    <span className="mini-label">Escenarios de presupuesto</span>
                    <div className="package-grid">
                      <PackageCard title="Ajustado" value={result.packageBudgets.base} caption="Entrada competitiva con control estricto del alcance." currency={displayCurrency} exchangeRate={exchangeRate} />
                      <PackageCard title="Objetivo" value={result.packageBudgets.recommended} caption="Escenario balanceado para contratar sin improvisar." currency={displayCurrency} exchangeRate={exchangeRate} />
                      <PackageCard title="Expandido" value={result.packageBudgets.premium} caption="Mayor cobertura, prioridad y holgura operativa." currency={displayCurrency} exchangeRate={exchangeRate} />
                    </div>
                  </article>
                ) : (
                  <article className="info-block">
                    <span className="mini-label">Paquetes de propuesta</span>
                    <div className="package-grid">
                      <PackageCard title="Base" value={result.packageBudgets.base} caption="Entrada competitiva con alcance controlado." currency={displayCurrency} exchangeRate={exchangeRate} />
                      <PackageCard title="Recomendado" value={result.packageBudgets.recommended} caption="Balance entre margen, calidad y riesgo." currency={displayCurrency} exchangeRate={exchangeRate} />
                      <PackageCard title="Premium" value={result.packageBudgets.premium} caption="Mayor cobertura, prioridad y holgura." currency={displayCurrency} exchangeRate={exchangeRate} />
                    </div>
                  </article>
                )}

                <div className="result-actions">
                  <button className="secondary-button" type="button" onClick={handleSaveScenario}>
                    Guardar simulacion
                  </button>
                  <button className="secondary-button" type="button" onClick={handleCopySummary}>
                    Copiar resumen
                  </button>
                  {copyStatus ? <span className="copy-status">{copyStatus}</span> : null}
                </div>
              </div>
            ) : (
              <div className="empty-state bank-empty">
                <div className="empty-orb" />
                <h4>Sin calculo todavia</h4>
                <p>
                  {isCompany
                    ? "Completa el formulario para ver cuanto pagar por hora, sueldo mensual y costo empresa."
                    : "Completa el formulario para ver cuanto cobrar por hora, anticipo y presupuesto total."}
                </p>
              </div>
            )}
          </section>
        </section>
        ) : null}

        {currentView === "history" ? (
        <section className="panel history-panel">
          <div className="panel-head">
            <div>
              <span className="mini-label">Historial</span>
              <h3>{isCompany ? "Simulaciones guardadas" : "Cotizaciones guardadas"}</h3>
            </div>
            <span className="panel-badge">{savedScenarios.length} guardadas</span>
          </div>

          {savedScenarios.length > 0 ? (
            <div className="history-list">
              {savedScenarios.map((scenario) => (
                <article className="history-card" key={scenario.id}>
                  <div className="history-card-head">
                    <div>
                      <strong>{scenario.title}</strong>
                      <p>{formatDateTime(scenario.createdAt)}</p>
                    </div>
                    <span className="history-chip">
                      {displayAmount(scenario.result.totalRecommendedBudget, displayCurrency, exchangeRate)}
                    </span>
                  </div>
                  <p className="history-copy">
                    {labelForOption(options.service, scenario.form.service)} · {labelForOption(options.experience, scenario.form.experience)} · {scenario.form.hours} h
                  </p>
                  <div className="history-actions">
                    <button className="ghost-button" type="button" onClick={() => handleLoadScenario(scenario)}>
                      Cargar
                    </button>
                    <button className="ghost-button danger" type="button" onClick={() => handleDeleteScenario(scenario.id)}>
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bank-empty history-empty">
              <div className="empty-orb" />
              <h4>Sin historial todavia</h4>
              <p>Guarda simulaciones para comparar escenarios y recuperar recomendaciones despues.</p>
            </div>
          )}
        </section>
        ) : null}
      </main>
    </div>
  );
}

function LoginScreen({
  portal,
  credentials,
  authLoading,
  authError,
  onPortalSwitch,
  onCredentialsChange,
  onSubmit
}) {
  const currentPortal = portalConfig[portal];

  return (
    <div className={`login-shell ${currentPortal.accentClass}`}>
      <section className="login-panel">
        <div className="login-copy">
          <img className="login-logo" src={pricePilotLogo} alt="Price Pilot" />
          <p className="page-kicker">{currentPortal.eyebrow}</p>
          <h1>{currentPortal.title}</h1>
          <p>{currentPortal.description}</p>
        </div>

        <div className="portal-switch">
          {Object.entries(portalConfig).map(([key, item]) => (
            <button
              key={key}
              className={`portal-button ${portal === key ? "active" : ""}`}
              type="button"
              onClick={() => onPortalSwitch(key)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Correo</span>
            <input type="email" name="email" value={credentials.email} onChange={onCredentialsChange} />
          </label>

          <label className="field">
            <span>Contrasena</span>
            <input type="password" name="password" value={credentials.password} onChange={onCredentialsChange} />
          </label>

          <button className="primary-button" type="submit" disabled={authLoading}>
            {authLoading ? "Ingresando..." : `Entrar como ${currentPortal.label}`}
          </button>

          {authError ? <p className="error-banner">{authError}</p> : null}
        </form>

        <div className="demo-card">
          <span className="mini-label">Accesos demo</span>
          <p>Freelancer: `freelancer@pricepilot.app` / `demo123`</p>
          <p>Empresa: `empresa@pricepilot.app` / `demo123`</p>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, value, options, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({ label, name, value, min, max, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" name={name} value={value} min={min} max={max} onChange={onChange} />
    </label>
  );
}

function ToggleField({ label, name, checked, onChange, hint }) {
  return (
    <label className="toggle-field">
      <div>
        <span>{label}</span>
        <small>{hint}</small>
      </div>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
    </label>
  );
}

function Metric({ label, value, note }) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="summary-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="info-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FeatureCard({ title, copy }) {
  return (
    <article className="feature-card">
      <h4>{title}</h4>
      <p>{copy}</p>
    </article>
  );
}

function PackageCard({ title, value, caption, currency, exchangeRate }) {
  return (
    <div className="package-card">
      <h4>{title}</h4>
      <strong>{displayAmount(value, currency, exchangeRate)}</strong>
      <p>{caption}</p>
    </div>
  );
}

function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "COP" ? 0 : 2
  }).format(Number(value || 0));
}

function convertAmount(value, currency, exchangeRate) {
  return currency === "COP" ? Number(value || 0) * Number(exchangeRate || 1) : Number(value || 0);
}

function displayAmount(value, currency, exchangeRate) {
  return formatCurrency(convertAmount(value, currency, exchangeRate), currency);
}

function labelForOption(optionList, value) {
  return optionList.find((option) => option.value === value)?.label ?? value;
}

function loadStoredSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearStoredSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

function loadScenarioHistory(role) {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed[role] ?? [];
  } catch {
    return [];
  }
}

function saveScenarioHistory(role, scenario) {
  const current = loadAllScenarioHistory();
  const nextRoleItems = [scenario, ...(current[role] ?? [])].slice(0, 8);
  const nextHistory = {
    ...current,
    [role]: nextRoleItems
  };
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  return nextRoleItems;
}

function deleteScenarioHistory(role, id) {
  const current = loadAllScenarioHistory();
  const nextRoleItems = (current[role] ?? []).filter((item) => item.id !== id);
  const nextHistory = {
    ...current,
    [role]: nextRoleItems
  };
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  return nextRoleItems;
}

function loadAllScenarioHistory() {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function buildScenarioTitle(role, form) {
  const mode = role === "EMPRESA" ? "Contratacion" : "Propuesta";
  const service = form.service.replaceAll("_", " ");
  return `${mode} ${service.toLowerCase()} ${form.market.toLowerCase()}`;
}

function buildShareSummary(role, form, result, currency, exchangeRate) {
  const prefix = role === "EMPRESA" ? "Resumen de presupuesto" : "Resumen de cotizacion";
  return [
    prefix,
    `${labelForOption(options.service, form.service)} · ${labelForOption(options.experience, form.experience)} · ${form.market.toLowerCase()}`,
    `Valor recomendado: ${displayAmount(result.centralHourlyRate, currency, exchangeRate)} por hora`,
    `Total recomendado: ${displayAmount(result.totalRecommendedBudget, currency, exchangeRate)}`,
    role === "EMPRESA"
      ? `Costo empresa estimado: ${displayAmount(result.estimatedMonthlyCompanyCost, currency, exchangeRate)}`
      : `Anticipo sugerido: ${displayAmount(result.recommendedDepositAmount, currency, exchangeRate)}`,
    `Riesgo: ${result.riskLevel}`
  ].join("\n");
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

import type { ReactNode } from "react";
import pricePilotLogo from "../../assets/price-pilot-logo-transparent.png";
import { buildInitials, formatCurrency } from "../../lib/formatters";
import { BannerStat, InfoPill } from "../ui/DisplayCards";
import type {
  HeroCopy,
  HighlightStat,
  PortalConfigItem,
  PreviewData,
  SessionData,
  ViewCopy,
  ViewName,
  WorkspaceMetaItem
} from "../../types/app";

interface AppShellProps {
  currentPortal: PortalConfigItem;
  currentView: ViewName;
  currentViewCopy: ViewCopy;
  currentHero: HeroCopy;
  heroClassName: string;
  heroHighlights: HighlightStat[];
  workspaceMeta: WorkspaceMetaItem[];
  isCompany: boolean;
  session: SessionData;
  preview: PreviewData;
  marketContextLabel: string;
  onNavigate: (view: ViewName) => void;
  onLogout: () => void | Promise<void>;
  children: ReactNode;
}

export function AppShell({
  currentPortal,
  currentView,
  currentViewCopy,
  currentHero,
  heroClassName,
  heroHighlights,
  workspaceMeta,
  isCompany,
  session,
  preview,
  marketContextLabel,
  onNavigate,
  onLogout,
  children
}: AppShellProps) {
  const sessionInitials = buildInitials(session.name);

  return (
    <>
      <section className="top-chrome">
        <header className="top-header">
          <div className="top-header-brand">
            <div className="top-header-logo">
              <img className="brand-logo" src={pricePilotLogo} alt="Price Pilot" />
            </div>
          </div>

          <div className="top-header-copy">
            <p className="page-kicker">{currentViewCopy.kicker}</p>
            <h2>{currentViewCopy.title}</h2>
            <p>{currentViewCopy.description}</p>
          </div>

          <div className="top-header-tools">
            <div className="header-currency-badge">
              <span className="mini-label">Moneda base</span>
              <strong>USD</strong>
            </div>

            <div className="session-badge">
              <span className="session-avatar">{sessionInitials}</span>
              <div>
                <strong>{session.name}</strong>
                <p>{session.dashboardSubtitle}</p>
              </div>
            </div>

            <button className="logout-button top" type="button" onClick={onLogout}>
              Cerrar sesion
            </button>
          </div>
        </header>

        <nav className="system-nav">
          <div className="system-nav-links">
            <button
              className={`nav-item ${currentView === "home" ? "active" : ""}`}
              type="button"
              onClick={() => onNavigate("home")}
            >
              Inicio
            </button>
            <button
              className={`nav-item ${currentView === "workspace" ? "active" : ""}`}
              type="button"
              onClick={() => onNavigate("workspace")}
            >
              Cotizador
            </button>
            <button
              className={`nav-item ${currentView === "history" ? "active" : ""}`}
              type="button"
              onClick={() => onNavigate("history")}
            >
              Historial
            </button>
          </div>

          <div className="system-nav-meta">
            <div className="system-chip">
              <span className="chip-dot" />
              {currentPortal.label}
            </div>
            <div className="system-chip muted">
              {isCompany ? "Espacio de contratacion" : "Espacio de propuestas"}
            </div>
          </div>
        </nav>

        <section className="status-ribbon">
          <article className="status-card emphasis">
            <span className="mini-label">Sesion activa</span>
            <strong>{session.name}</strong>
            <p>{session.email}</p>
          </article>

          <article className="status-card">
            <span className="mini-label">Preview</span>
            <strong>{formatCurrency(preview.monthlyFloor)}</strong>
            <p>Piso mensual visible</p>
          </article>

          <article className="status-card">
            <span className="mini-label">Contexto</span>
            <strong>{preview.urgencyLabel}</strong>
            <p>{marketContextLabel}</p>
          </article>
        </section>
      </section>

      <section className={heroClassName}>
        <div className="hero-copy">
          <span className="section-tag">{currentHero.tag}</span>
          <h3>{currentHero.title}</h3>
          <p>{currentHero.description}</p>
        </div>

        <div className="hero-summary">
          {heroHighlights.map((item) => (
            <BannerStat key={item.label} label={item.label} value={item.value} note={item.note} />
          ))}
        </div>
      </section>

      {currentView === "workspace" ? (
        <section className="workspace-strip">
          {workspaceMeta.map((item) => (
            <InfoPill key={item.label} label={item.label} value={item.value} />
          ))}
        </section>
      ) : null}

      {children}
    </>
  );
}

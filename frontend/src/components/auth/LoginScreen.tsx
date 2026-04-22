import type { ChangeEvent } from "react";
import pricePilotLogo from "../../assets/price-pilot-logo-transparent.png";
import { portalConfig } from "../../config/appConfig";
import type { Credentials, FormSubmitEvent, PortalRole } from "../../types/app";

const portalNotes: Record<PortalRole, string> = {
  FREELANCER: "Gestion comercial para profesionales independientes.",
  EMPRESA: "Gestion de presupuesto y costo integral de contratacion."
};

interface LoginScreenProps {
  portal: PortalRole;
  credentials: Credentials;
  authLoading: boolean;
  authError: string;
  onPortalSwitch: (nextPortal: PortalRole) => void;
  onCredentialsChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormSubmitEvent) => void | Promise<void>;
}

export function LoginScreen({
  portal,
  credentials,
  authLoading,
  authError,
  onPortalSwitch,
  onCredentialsChange,
  onSubmit
}: LoginScreenProps) {
  const currentPortal = portalConfig[portal];
  const portalMode = portal === "EMPRESA" ? "Presupuesto y contratacion" : "Cotizacion y tarifa";
  const portalScope =
    portal === "EMPRESA"
      ? "Referencia de sueldo, costo empresa y escenarios de contratacion."
      : "Referencia comercial, tarifa por hora y piso sostenible.";

  return (
    <div className={`login-shell ${currentPortal.accentClass}`}>
      <section className="login-panel">
        <div className="login-masthead">
          <div className="login-masthead-copy">
            <span className="mini-label">PMC Quote Studio</span>
            <strong>Acceso profesional</strong>
          </div>
          <div className="login-masthead-meta">
            <span>Moneda base: USD</span>
            <span>{portal === "EMPRESA" ? "Portal corporativo" : "Portal independiente"}</span>
          </div>
        </div>

        <div className="login-copy">
          <div className="login-logo-frame">
            <img className="login-logo" src={pricePilotLogo} alt="Price Pilot" />
          </div>
          <p className="page-kicker">{currentPortal.eyebrow}</p>
          <h1>{currentPortal.title}</h1>
          <p className="login-lead">{currentPortal.description}</p>

          <div className="login-info-list">
            <div className="login-info-row">
              <span>Modalidad</span>
              <strong>{portalMode}</strong>
            </div>
            <div className="login-info-row">
              <span>Alcance</span>
              <p>{portalScope}</p>
            </div>
            <div className="login-info-row">
              <span>Moneda base</span>
              <strong>USD</strong>
            </div>
          </div>
        </div>

        <div className="login-side">
          <section className="login-section">
            <div className="login-section-head">
              <span className="mini-label">Seleccion de acceso</span>
              <h2>Perfil de trabajo</h2>
              <p>Selecciona el entorno segun el tipo de consulta que vas a realizar.</p>
            </div>

            <div className="portal-switch">
              {(Object.keys(portalConfig) as PortalRole[]).map((key) => {
                const item = portalConfig[key];

                return (
                  <button
                    key={key}
                    className={`portal-button ${portal === key ? "active" : ""}`}
                    type="button"
                    onClick={() => onPortalSwitch(key)}
                  >
                    <div className="portal-button-head">
                      <strong>{item.label}</strong>
                      <span>{portal === key ? "Perfil actual" : "Disponible"}</span>
                    </div>
                    <small>{portalNotes[key]}</small>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="login-section">
            <div className="login-section-head">
              <span className="mini-label">Credenciales</span>
              <h2>Ingreso al sistema</h2>
              <p>Las cuentas demo quedan precargadas para validar el flujo sin configuracion adicional.</p>
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
          </section>

          <div className="demo-card">
            <span className="mini-label">Credenciales de demostracion</span>
            <div className="demo-row">
              <strong>Freelancer</strong>
              <p>
                <code>freelancer@pricepilot.app</code>
                <span> / </span>
                <code>demo123</code>
              </p>
            </div>
            <div className="demo-row">
              <strong>Empresa</strong>
              <p>
                <code>empresa@pricepilot.app</code>
                <span> / </span>
                <code>demo123</code>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

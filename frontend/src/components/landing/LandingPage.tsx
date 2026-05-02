import pricePilotLogo from "../../assets/price-pilot-logo-transparent.png";
import { portalConfig } from "../../config/appConfig";
import type { PortalRole } from "../../types/app";

interface LandingPageProps {
  onStart: () => void;
  onChoosePortal: (nextPortal: PortalRole) => void;
}

const metrics = [
  ["+ claridad", "Para definir precios con criterios visibles."],
  ["- improvisación", "Menos decisiones basadas solo en intuición."],
  ["2 perfiles", "Freelancer y empresa en una misma plataforma."],
  ["1 flujo", "Cotiza, compara y entra al workspace."]
];

const steps = [
  ["01", "Ingresa tu contexto", "Servicio, experiencia, mercado, horas y complejidad."],
  ["02", "Calcula el escenario", "El sistema cruza costos, overhead y contingencia."],
  ["03", "Obtén una recomendación", "Tarifa, presupuesto, anticipo y resumen para negociar."],
  ["04", "Decide con respaldo", "Guarda escenarios y compara futuras propuestas."]
];

const features = [
  ["Tarifa sugerida", "Referencia clara para cobrar por hora o por proyecto."],
  ["Piso sostenible", "Ayuda a evitar precios que no cubren tus metas."],
  ["Anticipo recomendado", "Soporte para dividir pagos y reducir riesgo comercial."],
  ["Historial de escenarios", "Consulta decisiones anteriores y compara propuestas."]
];

export function LandingPage({ onStart, onChoosePortal }: LandingPageProps) {
  return (
    <div className="landing-shell startup-landing">
      <header className="landing-navbar startup-navbar">
        <img className="brand-logo" src={pricePilotLogo} alt="Price Pilot" />

        <nav className="landing-nav">
          <a href="#problema">Problema</a>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#perfiles">Perfiles</a>
          <a href="#modelo">Modelo</a>
        </nav>

        <button className="secondary-button landing-nav-button" type="button" onClick={onStart}>
          Entrar demo
        </button>
      </header>

      <main>
        <section className="startup-hero startup-hero-clean">
          <div className="startup-hero-copy">
            <span className="startup-badge">PMC Quote Studio · MVP funcional</span>

            <h1>Cotiza con datos. Negocia con confianza.</h1>

            <p>
              Price Pilot transforma variables del proyecto, perfil profesional y mercado en una
              recomendación clara de precio para freelancers y empresas.
            </p>

            <div className="landing-actions">
              <button className="primary-button" type="button" onClick={onStart}>
                Probar la demo
              </button>

              <a className="ghost-button landing-link-button" href="#como-funciona">
                Ver cómo funciona
              </a>
            </div>

            <div className="startup-trust-row">
              <span>Diseñado para freelancers</span>
              <span>Validación de presupuestos</span>
              <span>Escenarios comparables</span>
            </div>
          </div>
        </section>

        <section className="startup-metrics">
          {metrics.map(([value, label]) => (
            <article className="startup-metric" key={value}>
              <strong>{value}</strong>
              <p>{label}</p>
            </article>
          ))}
        </section>

        <section className="landing-section startup-section" id="problema">
          <span className="mini-label">El problema</span>
          <h2>El problema no es trabajar. Es no saber cuánto cobrar.</h2>
          <p>
            Muchos profesionales independientes fijan precios con referencias dispersas,
            intuición o presión del cliente. Eso termina en inseguridad, subvaloración e
            ingresos inestables.
          </p>

          <div className="startup-before-after">
            <article>
              <span className="mini-label">Antes</span>
              <h3>Cotizar con dudas</h3>
              <p>Precios inconsistentes, miedo a perder clientes y poca capacidad para justificar el valor.</p>
            </article>

            <article>
              <span className="mini-label">Después</span>
              <h3>Decidir con respaldo</h3>
              <p>Una recomendación estructurada que ayuda a explicar, comparar y negociar mejor.</p>
            </article>
          </div>
        </section>

        <section className="landing-section startup-section" id="como-funciona">
          <span className="mini-label">Cómo funciona</span>
          <h2>De una cotización improvisada a una decisión estructurada.</h2>

          <div className="startup-steps">
            {steps.map(([number, title, text]) => (
              <article className="startup-step-card" key={number}>
                <strong>{number}</strong>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section startup-section">
          <span className="mini-label">Funcionalidades</span>
          <h2>Todo lo necesario para sustentar una propuesta.</h2>

          <div className="landing-feature-grid">
            {features.map(([title, text]) => (
              <article className="feature-card" key={title}>
                <h4>{title}</h4>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section startup-section" id="perfiles">
          <span className="mini-label">Perfiles</span>
          <h2>Dos formas de usar Price Pilot.</h2>

          <div className="landing-profile-grid startup-profile-grid">
            {(Object.keys(portalConfig) as PortalRole[]).map((key) => {
              const item = portalConfig[key];

              return (
                <article className={`landing-profile-card startup-profile-card ${item.accentClass}`} key={key}>
                  <span className="mini-label">{item.eyebrow}</span>
                  <h3>{item.label}</h3>
                  <p>{item.description}</p>

                  <button className="primary-button" type="button" onClick={() => onChoosePortal(key)}>
                    Entrar como {item.label}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-section startup-section" id="modelo">
          <span className="mini-label">Modelo de negocio</span>
          <h2>Freemium para crecer, suscripción para escalar.</h2>
          <p>
            Price Pilot puede iniciar con cálculos básicos gratuitos y evolucionar hacia planes
            de pago para freelancers y empresas que necesitan recomendaciones avanzadas,
            historial y validación de propuestas.
          </p>

          <div className="startup-pricing-grid">
            <article>
              <span>Free</span>
              <strong>$0</strong>
              <p>Cálculos básicos para probar el valor inicial.</p>
            </article>

            <article>
              <span>Plus Freelancer</span>
              <strong>$80.000 COP</strong>
              <p>Recomendaciones avanzadas, historial y soporte para negociación.</p>
            </article>

            <article>
              <span>Empresa</span>
              <strong>$200.000 COP</strong>
              <p>Benchmark, validación de propuestas y apoyo en decisiones de contratación.</p>
            </article>
          </div>
        </section>

        <section className="landing-cta startup-final-cta">
          <div>
            <span className="mini-label">Demo lista</span>
            <h2>Entra al workspace y prueba Price Pilot.</h2>
            <p>
              Selecciona un perfil, inicia sesión con las credenciales demo y explora el flujo
              completo del producto.
            </p>
          </div>

          <button className="primary-button" type="button" onClick={onStart}>
            Entrar a la demo
          </button>
        </section>
      </main>
    </div>
  );
}
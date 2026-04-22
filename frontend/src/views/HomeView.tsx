import { options } from "../config/appConfig";
import { labelForOption } from "../lib/formatters";
import { FeatureCard, Metric } from "../components/ui/DisplayCards";
import type { QuoteForm, SavedScenario } from "../types/app";

interface HomeViewProps {
  isCompany: boolean;
  savedScenarios: SavedScenario[];
  form: QuoteForm;
  onStartEstimate: () => void;
  onGoToHistory: () => void;
}

export function HomeView({ isCompany, savedScenarios, form, onStartEstimate, onGoToHistory }: HomeViewProps) {
  return (
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
          <button className="primary-button" type="button" onClick={onStartEstimate}>
            {isCompany ? "Nueva simulación" : "Nueva cotización"}
          </button>
          <button className="secondary-button" type="button" onClick={onGoToHistory}>
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
          <Metric label="Moneda visible" value="USD" note="Base del sistema" />
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
  );
}

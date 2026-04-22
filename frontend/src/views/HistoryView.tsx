import { options } from "../config/appConfig";
import { displayAmount, formatDateTime, labelForOption } from "../lib/formatters";
import type { SavedScenario } from "../types/app";

interface HistoryViewProps {
  isCompany: boolean;
  savedScenarios: SavedScenario[];
  onLoadScenario: (scenario: SavedScenario) => void;
  onDeleteScenario: (id: string) => void;
}

export function HistoryView({
  isCompany,
  savedScenarios,
  onLoadScenario,
  onDeleteScenario
}: HistoryViewProps) {
  return (
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
                <span className="history-chip">{displayAmount(scenario.result.totalRecommendedBudget)}</span>
              </div>
              <p className="history-copy">
                {labelForOption(options.service, scenario.form.service)} · {labelForOption(options.experience, scenario.form.experience)} · {scenario.form.hours} h
              </p>
              <div className="history-actions">
                <button className="ghost-button" type="button" onClick={() => onLoadScenario(scenario)}>
                  Cargar
                </button>
                <button className="ghost-button danger" type="button" onClick={() => onDeleteScenario(scenario.id)}>
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
  );
}

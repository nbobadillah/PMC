import { PackageCard, Metric } from "../components/ui/DisplayCards";
import { Field, NumberField, ToggleField } from "../components/ui/FormFields";
import { options } from "../config/appConfig";
import { displayAmount } from "../lib/formatters";
import type {
  FormControlChangeEvent,
  FormSubmitEvent,
  PortalConfigItem,
  QuoteForm,
  QuoteResult
} from "../types/app";

interface WorkspaceViewProps {
  isCompany: boolean;
  currentPortal: PortalConfigItem;
  form: QuoteForm;
  loading: boolean;
  error: string;
  result: QuoteResult | null;
  copyStatus: string;
  onChange: (event: FormControlChangeEvent) => void;
  onSubmit: (event: FormSubmitEvent) => void | Promise<void>;
  onReset: () => void;
  onSaveScenario: () => void;
  onCopySummary: () => void | Promise<void>;
}

export function WorkspaceView({
  isCompany,
  currentPortal,
  form,
  loading,
  error,
  result,
  copyStatus,
  onChange,
  onSubmit,
  onReset,
  onSaveScenario,
  onCopySummary
}: WorkspaceViewProps) {
  return (
    <section className="dashboard-grid">
      <form className="panel quote-panel" onSubmit={onSubmit}>
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
            <Field label="Linea de servicio" name="service" value={form.service} options={options.service} onChange={onChange} />
            <Field label="Senioridad" name="experience" value={form.experience} options={options.experience} onChange={onChange} />
            <Field label="Complejidad" name="complexity" value={form.complexity} options={options.complexity} onChange={onChange} />
            <Field label="Mercado" name="market" value={form.market} options={options.market} onChange={onChange} />
            <NumberField
              label={isCompany ? "Horas mensuales o de proyecto" : "Horas del proyecto"}
              name="hours"
              value={form.hours}
              min="1"
              max="500"
              onChange={onChange}
            />
            {isCompany ? (
              <ToggleField
                label="Contratacion urgente"
                name="rushDelivery"
                checked={form.rushDelivery}
                onChange={onChange}
                hint="Activa una prima por prioridad y menor margen de busqueda."
              />
            ) : (
              <NumberField label="Revisiones incluidas" name="revisions" value={form.revisions} min="0" max="10" onChange={onChange} />
            )}
          </div>
        </div>

        <div className="section-block">
          <h4>{isCompany ? "Presupuesto y costos" : "Proteccion de margen"}</h4>
          <div className="field-grid">
            {isCompany ? (
              <>
                <NumberField label="Presupuesto objetivo mensual USD" name="monthlyIncomeGoal" value={form.monthlyIncomeGoal} min="200" max="100000" onChange={onChange} />
                <NumberField label="Horas productivas estimadas al mes" name="monthlyBillableHours" value={form.monthlyBillableHours} min="10" max="240" onChange={onChange} />
                <NumberField label="Costo operativo adicional %" name="overheadPercent" value={form.overheadPercent} min="0" max="80" onChange={onChange} />
                <NumberField label="Colchon de riesgo %" name="contingencyPercent" value={form.contingencyPercent} min="0" max="40" onChange={onChange} />
              </>
            ) : (
              <>
                <NumberField label="Revisiones incluidas" name="revisions" value={form.revisions} min="0" max="10" onChange={onChange} />
                <NumberField label="Overhead operativo %" name="overheadPercent" value={form.overheadPercent} min="0" max="80" onChange={onChange} />
                <NumberField label="Contingencia %" name="contingencyPercent" value={form.contingencyPercent} min="0" max="40" onChange={onChange} />
                <NumberField label="Meta mensual USD" name="monthlyIncomeGoal" value={form.monthlyIncomeGoal} min="200" max="100000" onChange={onChange} />
                <NumberField label="Horas facturables al mes" name="monthlyBillableHours" value={form.monthlyBillableHours} min="10" max="240" onChange={onChange} />
                <ToggleField
                  label="Entrega urgente"
                  name="rushDelivery"
                  checked={form.rushDelivery}
                  onChange={onChange}
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
          <button className="secondary-button" type="button" onClick={onReset}>
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
                    value={`${displayAmount(result.lowHourlyRate)} - ${displayAmount(result.highHourlyRate)}`}
                    note="Rango sugerido para contratacion"
                  />
                  <Metric
                    label="Costo empresa"
                    value={displayAmount(result.estimatedMonthlyCompanyCost)}
                    note="Costo integral aproximado"
                  />
                  <Metric
                    label="Sueldo mensual estimado"
                    value={displayAmount(result.estimatedMonthlySalary)}
                    note="Referencia mensual del perfil"
                  />
                  <Metric
                    label="Presupuesto de proyecto"
                    value={displayAmount(result.totalRecommendedBudget)}
                    note={`${result.hours} horas consideradas`}
                  />
                </div>

                <div className="metric-grid wide metric-grid-company-secondary">
                  <Metric
                    label="Valor recomendado"
                    value={displayAmount(result.centralHourlyRate)}
                    note="Punto central de negociacion"
                  />
                  <Metric
                    label="Reserva sugerida"
                    value={displayAmount(result.recommendedDepositAmount)}
                    note={`${result.recommendedDepositPercent}% sugerido`}
                  />
                  <Metric label="Riesgo" value={result.riskLevel} note="Lectura comercial" />
                </div>
              </>
            ) : (
              <>
                <div className="metric-grid">
                  <Metric
                    label="Tarifa por hora"
                    value={`${displayAmount(result.lowHourlyRate)} - ${displayAmount(result.highHourlyRate)}`}
                    note="Rango sugerido"
                  />
                  <Metric
                    label="Tarifa recomendada"
                    value={displayAmount(result.centralHourlyRate)}
                    note="Punto central"
                  />
                  <Metric
                    label="Piso sostenible"
                    value={displayAmount(result.sustainableHourlyFloor)}
                    note="Minimo sano por hora"
                  />
                  <Metric
                    label="Proyecto recomendado"
                    value={displayAmount(result.totalRecommendedBudget)}
                    note={`${result.hours} horas consideradas`}
                  />
                  <Metric
                    label="Anticipo sugerido"
                    value={displayAmount(result.recommendedDepositAmount)}
                    note={`${result.recommendedDepositPercent}% sugerido`}
                  />
                  <Metric label="Riesgo" value={result.riskLevel} note="Lectura comercial" />
                </div>

                <div className="metric-grid wide">
                  <Metric
                    label="Sueldo mensual estimado"
                    value={displayAmount(result.estimatedMonthlySalary)}
                    note="Referencia de mensualizacion"
                  />
                  <Metric
                    label="Costo empresa"
                    value={displayAmount(result.estimatedMonthlyCompanyCost)}
                    note="Costo integral aproximado"
                  />
                  <Metric
                    label="Paquete premium"
                    value={displayAmount(result.packageBudgets.premium)}
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
                  <PackageCard title="Ajustado" value={result.packageBudgets.base} caption="Entrada competitiva con control estricto del alcance." />
                  <PackageCard title="Objetivo" value={result.packageBudgets.recommended} caption="Escenario balanceado para contratar sin improvisar." />
                  <PackageCard title="Expandido" value={result.packageBudgets.premium} caption="Mayor cobertura, prioridad y holgura operativa." />
                </div>
              </article>
            ) : (
              <article className="info-block">
                <span className="mini-label">Paquetes de propuesta</span>
                <div className="package-grid">
                  <PackageCard title="Base" value={result.packageBudgets.base} caption="Entrada competitiva con alcance controlado." />
                  <PackageCard title="Recomendado" value={result.packageBudgets.recommended} caption="Balance entre margen, calidad y riesgo." />
                  <PackageCard title="Premium" value={result.packageBudgets.premium} caption="Mayor cobertura, prioridad y holgura." />
                </div>
              </article>
            )}

            <div className="result-actions">
              <button className="secondary-button" type="button" onClick={onSaveScenario}>
                Guardar simulacion
              </button>
              <button className="secondary-button" type="button" onClick={onCopySummary}>
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
  );
}

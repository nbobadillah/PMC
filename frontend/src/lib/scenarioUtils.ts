import { options } from "../config/appConfig";
import { displayAmount, labelForOption } from "./formatters";
import type { PortalRole, QuoteForm, QuoteResult } from "../types/app";

export function buildScenarioTitle(role: PortalRole, form: QuoteForm): string {
  const mode = role === "EMPRESA" ? "Contratacion" : "Propuesta";
  const service = form.service.replaceAll("_", " ");
  return `${mode} ${service.toLowerCase()} ${form.market.toLowerCase()}`;
}

export function buildShareSummary(role: PortalRole, form: QuoteForm, result: QuoteResult): string {
  const prefix = role === "EMPRESA" ? "Resumen de presupuesto" : "Resumen de cotizacion";

  return [
    prefix,
    `${labelForOption(options.service, form.service)} · ${labelForOption(options.experience, form.experience)} · ${form.market.toLowerCase()}`,
    `Valor recomendado: ${displayAmount(result.centralHourlyRate)} por hora`,
    `Total recomendado: ${displayAmount(result.totalRecommendedBudget)}`,
    role === "EMPRESA"
      ? `Costo empresa estimado: ${displayAmount(result.estimatedMonthlyCompanyCost)}`
      : `Anticipo sugerido: ${displayAmount(result.recommendedDepositAmount)}`,
    `Riesgo: ${result.riskLevel}`
  ].join("\n");
}

import type { OptionItem, PortalConfigItem, PortalRole, QuoteForm, ViewName } from "../types/app";

export const API_BASE = "/api";
export const SESSION_KEY = "price-pilot-session";
export const HISTORY_KEY = "price-pilot-history";

export const VIEW_HASHES: Record<ViewName, string> = {
  home: "#/inicio",
  workspace: "#/cotizador",
  history: "#/historial"
};

export const portalConfig: Record<PortalRole, PortalConfigItem> = {
  FREELANCER: {
    label: "Freelancer / Independiente",
    eyebrow: "Portal profesional independiente",
    title: "Establece una referencia comercial clara",
    description:
      "Centraliza tarifa por hora, anticipo, paquetes y piso sostenible para presentar propuestas con mejor criterio.",
    accentClass: "portal-freelancer",
    demoEmail: "freelancer@pricepilot.app"
  },
  EMPRESA: {
    label: "Empresa",
    eyebrow: "Portal corporativo",
    title: "Consolida presupuesto y costo de contratacion",
    description:
      "Consolida referencia salarial, costo empresa y escenarios de contratacion en un solo workspace de consulta.",
    accentClass: "portal-company",
    demoEmail: "empresa@pricepilot.app"
  }
};

export const formTemplates: Record<PortalRole, QuoteForm> = {
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

export const options: Record<"service" | "experience" | "complexity" | "market", OptionItem[]> = {
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

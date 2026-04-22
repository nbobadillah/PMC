import { options } from "../config/appConfig";
import { displayAmount, formatCurrency, labelForOption } from "./formatters";
import type {
  DashboardCopyResult,
  HeroCopy,
  PreviewData,
  QuoteForm,
  SavedScenario,
  ViewCopy,
  ViewName
} from "../types/app";

const companyViewContent: Record<ViewName, ViewCopy> = {
  home: {
    kicker: "Workspace overview",
    title: "Planea antes de contratar",
    description:
      "Centraliza el contexto del perfil, revisa referencias de costo y guarda escenarios comparables."
  },
  workspace: {
    kicker: "Cotizador activo",
    title: "Configura el escenario y valida el presupuesto",
    description:
      "Ajusta servicio, senioridad, mercado y riesgo mientras ves una referencia clara de pago."
  },
  history: {
    kicker: "Historial guardado",
    title: "Recupera simulaciones y compara decisiones",
    description:
      "Carga escenarios anteriores para revisar supuestos, montos y margen de seguridad."
  }
};

const freelancerViewContent: Record<ViewName, ViewCopy> = {
  home: {
    kicker: "Workspace overview",
    title: "Ordena tu proceso de cotizacion",
    description:
      "Prepara propuestas con mejor criterio comercial y manten a mano tus escenarios guardados."
  },
  workspace: {
    kicker: "Cotizador activo",
    title: "Define tarifa, margen y alcance en un solo flujo",
    description:
      "Ajusta el escenario comercial sin perder de vista el piso sostenible y el presupuesto final."
  },
  history: {
    kicker: "Historial guardado",
    title: "Compara propuestas y recupera escenarios",
    description:
      "Vuelve a simulaciones anteriores para comparar servicio, senioridad y presupuesto."
  }
};

const companyHeroContent: Record<ViewName, HeroCopy> = {
  home: {
    tag: "Company overview",
    title: "Organiza presupuesto, contexto y decisiones",
    description:
      "Mantén una vista clara del perfil, tu rango esperado y los escenarios guardados antes de contratar."
  },
  workspace: {
    tag: "Company mode",
    title: "Cuanto pagar por proyecto o por mes",
    description:
      "Estima pago por hora, sueldo mensual y costo real de contratacion con una base mas ordenada."
  },
  history: {
    tag: "Company history",
    title: "Consulta escenarios y recupera referencias",
    description:
      "Revisa simulaciones guardadas para comparar presupuesto, mercado y supuestos de contratacion."
  }
};

const freelancerHeroContent: Record<ViewName, HeroCopy> = {
  home: {
    tag: "Freelancer overview",
    title: "Ordena tu referencia comercial desde el inicio",
    description:
      "Consulta tu base operativa, revisa el piso visible y entra al cotizador con un contexto mas claro."
  },
  workspace: {
    tag: "Freelancer mode",
    title: "Cuanto cobrar por proyecto o por mes",
    description:
      "Calcula tarifa por hora, anticipo, paquetes y piso sostenible para vender mejor tus servicios."
  },
  history: {
    tag: "Freelancer history",
    title: "Recupera propuestas y compara escenarios",
    description:
      "Vuelve a cotizaciones guardadas para revisar servicio, senioridad y presupuesto recomendado."
  }
};

interface GetDashboardCopyParams {
  currentView: ViewName;
  form: QuoteForm;
  isCompany: boolean;
  preview: PreviewData;
  savedScenarios: SavedScenario[];
}

export function getDashboardCopy({
  currentView,
  form,
  isCompany,
  preview,
  savedScenarios
}: GetDashboardCopyParams): DashboardCopyResult {
  const currentMode = currentView;
  const marketLabel = form.market === "INTERNACIONAL" ? "Internacional" : "Local";
  const viewContent = isCompany ? companyViewContent : freelancerViewContent;
  const heroContent = isCompany ? companyHeroContent : freelancerHeroContent;

  const heroHighlights =
    currentMode === "workspace"
      ? [
          {
            label: "Meta mensual",
            value: displayAmount(form.monthlyIncomeGoal),
            note: "Base operativa"
          },
          {
            label: "Horas mensuales",
            value: `${form.monthlyBillableHours} h`,
            note: "Capacidad declarada"
          },
          {
            label: "Contingencia",
            value: `${form.contingencyPercent}%`,
            note: "Margen de seguridad"
          }
        ]
      : currentMode === "history"
        ? [
            {
              label: "Escenarios",
              value: `${savedScenarios.length}`,
              note: "Guardados"
            },
            {
              label: "Servicio base",
              value: labelForOption(options.service, form.service),
              note: "Ultima configuracion"
            },
            {
              label: "Mercado",
              value: marketLabel,
              note: "Contexto actual"
            }
          ]
        : [
            {
              label: "Piso visible",
              value: formatCurrency(preview.monthlyFloor),
              note: "Referencia rapida"
            },
            {
              label: "Moneda",
              value: "USD",
              note: "Base actual"
            },
            {
              label: "Urgencia",
              value: preview.urgencyLabel,
              note: isCompany ? "Lectura de contratacion" : "Lectura comercial"
            }
          ];

  return {
    currentViewCopy: viewContent[currentMode],
    currentHero: heroContent[currentMode],
    heroHighlights,
    heroClassName: `hero-banner ${currentMode === "workspace" ? "hero-banner-detailed" : "hero-banner-compact"}`,
    workspaceMeta: [
      {
        label: isCompany ? "Modo" : "Enfoque",
        value: isCompany ? "Contratacion y presupuesto" : "Cotizacion y margen"
      },
      {
        label: "Mercado",
        value: marketLabel
      },
      {
        label: "Senioridad",
        value: labelForOption(options.experience, form.experience)
      },
      {
        label: "Servicio",
        value: labelForOption(options.service, form.service)
      },
      {
        label: "Moneda visible",
        value: "USD"
      }
    ]
  };
}

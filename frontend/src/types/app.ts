import type { ChangeEvent, FormEvent, ReactNode } from "react";

export type PortalRole = "FREELANCER" | "EMPRESA";
export type ViewName = "home" | "workspace" | "history";

export interface ApiMessage {
  message?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface PortalConfigItem {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  accentClass: string;
  demoEmail: string;
}

export interface OptionItem {
  value: string;
  label: string;
}

export interface QuoteForm {
  role: PortalRole;
  service: string;
  experience: string;
  complexity: string;
  market: string;
  hours: number;
  revisions: number;
  overheadPercent: number;
  contingencyPercent: number;
  monthlyIncomeGoal: number;
  monthlyBillableHours: number;
  rushDelivery: boolean;
}

export interface SessionData {
  token: string;
  role: PortalRole;
  name: string;
  email: string;
  dashboardSubtitle: string;
}

export interface PackageBudgets {
  base: number;
  recommended: number;
  premium: number;
}

export interface QuoteResult {
  lowHourlyRate: number;
  highHourlyRate: number;
  centralHourlyRate: number;
  sustainableHourlyFloor: number;
  totalRecommendedBudget: number;
  recommendedDepositAmount: number;
  recommendedDepositPercent: number;
  riskLevel: string;
  estimatedMonthlySalary: number;
  estimatedMonthlyCompanyCost: number;
  packageBudgets: PackageBudgets;
  hours: number;
  negotiationScript: string;
  executiveSummary: string;
  hiringRecommendation: string;
  scopeRecommendation: string;
}

export interface SavedScenario {
  id: string;
  role: PortalRole;
  createdAt: string;
  form: QuoteForm;
  result: QuoteResult;
  title: string;
}

export interface PreviewData {
  monthlyFloor: number;
  urgencyLabel: string;
}

export interface ViewCopy {
  kicker: string;
  title: string;
  description: string;
}

export interface HeroCopy {
  tag: string;
  title: string;
  description: string;
}

export interface HighlightStat {
  label: string;
  value: string;
  note: string;
}

export interface WorkspaceMetaItem {
  label: string;
  value: string;
}

export interface DashboardCopyResult {
  currentViewCopy: ViewCopy;
  currentHero: HeroCopy;
  heroHighlights: HighlightStat[];
  heroClassName: string;
  workspaceMeta: WorkspaceMetaItem[];
}

export type DisplayValue = ReactNode;
export type FormControlChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;
export type FormSubmitEvent = FormEvent<HTMLFormElement>;

import type { OptionItem } from "../types/app";

export function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

export function displayAmount(value: number | string): string {
  return formatCurrency(value);
}

export function labelForOption(optionList: OptionItem[], value: string): string {
  return optionList.find((option) => option.value === value)?.label ?? value;
}

export function buildInitials(value: string): string {
  return String(value || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

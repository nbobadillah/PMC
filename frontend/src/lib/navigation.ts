import { VIEW_HASHES } from "../config/appConfig";
import type { ViewName } from "../types/app";

export function normalizeView(view: string): ViewName {
  return Object.prototype.hasOwnProperty.call(VIEW_HASHES, view) ? (view as ViewName) : "home";
}

export function getViewFromHash(): ViewName {
  if (typeof window === "undefined") {
    return "home";
  }

  const matchedView = Object.entries(VIEW_HASHES).find(([, hash]) => hash === window.location.hash)?.[0];
  return matchedView ? (matchedView as ViewName) : "home";
}

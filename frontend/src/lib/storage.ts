import { HISTORY_KEY, SESSION_KEY } from "../config/appConfig";
import type { PortalRole, SavedScenario, SessionData } from "../types/app";

type ScenarioHistoryMap = Partial<Record<PortalRole, SavedScenario[]>>;

export function loadStoredSession(): SessionData | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionData) : null;
  } catch {
    return null;
  }
}

export function storeSession(session: SessionData): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

export function loadScenarioHistory(role: PortalRole): SavedScenario[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as ScenarioHistoryMap) : {};
    return parsed[role] ?? [];
  } catch {
    return [];
  }
}

export function saveScenarioHistory(role: PortalRole, scenario: SavedScenario): SavedScenario[] {
  const current = loadAllScenarioHistory();
  const nextRoleItems = [scenario, ...(current[role] ?? [])].slice(0, 8);
  const nextHistory = {
    ...current,
    [role]: nextRoleItems
  };

  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  return nextRoleItems;
}

export function deleteScenarioHistory(role: PortalRole, id: string): SavedScenario[] {
  const current = loadAllScenarioHistory();
  const nextRoleItems = (current[role] ?? []).filter((item) => item.id !== id);
  const nextHistory = {
    ...current,
    [role]: nextRoleItems
  };

  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
  return nextRoleItems;
}

function loadAllScenarioHistory(): ScenarioHistoryMap {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as ScenarioHistoryMap) : {};
  } catch {
    return {};
  }
}

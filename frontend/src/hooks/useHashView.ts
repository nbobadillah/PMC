import { useEffect, useState } from "react";
import { VIEW_HASHES } from "../config/appConfig";
import { getViewFromHash, normalizeView } from "../lib/navigation";
import type { ViewName } from "../types/app";

interface NavigateOptions {
  replace?: boolean;
  smooth?: boolean;
}

export function useHashView() {
  const [currentView, setCurrentView] = useState<ViewName>(() => getViewFromHash());

  useEffect(() => {
    function syncViewWithHash() {
      const nextView = getViewFromHash();
      const nextHash = VIEW_HASHES[nextView];

      setCurrentView(nextView);

      if (window.location.hash !== nextHash) {
        window.history.replaceState(null, "", nextHash);
      }
    }

    syncViewWithHash();
    window.addEventListener("hashchange", syncViewWithHash);

    return () => {
      window.removeEventListener("hashchange", syncViewWithHash);
    };
  }, []);

  function navigateToView(nextView: ViewName, { replace = false, smooth = true }: NavigateOptions = {}) {
    const normalizedView = normalizeView(nextView);
    const nextHash = VIEW_HASHES[normalizedView];

    setCurrentView(normalizedView);

    if (replace) {
      window.history.replaceState(null, "", nextHash);
    } else if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    }

    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
  }

  return {
    currentView,
    navigateToView
  };
}

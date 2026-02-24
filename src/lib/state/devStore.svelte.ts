import { browser } from "$app/environment";

const DEV_STORAGE_KEY = "dev-mode-state";

export const devMode = $state({
  enabled: false,
});

export function loadDevMode() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(DEV_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        devMode.enabled = parsed.enabled;
      } catch (e) {
        console.error("Ошибка при загрузке devMode из localStorage", e);
      }
    }
  }
}

export function initDevStorePersistence() {
  if (browser) {
    $effect.root(() => {
      $effect(() => {
        localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(devMode)); // при любом изменении сохраняется
      });
    });
  }
}

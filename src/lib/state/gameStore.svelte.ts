import type { GameState } from "$lib/types";

const STORAGE_KEY = "igra-state";

const defaultState: GameState = {
  phase: "setup",
  players: [],
  round1Themes: [],
  round2Themes: [],
  finalQuestion: null,
  currentPlayerId: null,
  activeQuestion: null,
  answeringPlayerId: null,
  attemptedPlayerIds: [],
  timerEndsAt: null,
  auctionState: null,
  finalState: null,

  devMode: false,
};

export const game = $state<GameState>(
  JSON.parse(JSON.stringify(defaultState)) // чтобы не менять оригинал defaultState
);

export function loadGame() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        Object.assign(game, parsed); // изменяем game чтобы была реактивность
      } catch (e) {
        console.error("Ошибка при загрузке состояния игры из localStorage", e);
      }
    }
  }
}

// Автоматическое сохранение состояния при любом изменении
export function initStorePersistence() {
  if (typeof window !== "undefined") {
    $effect.root(() => {
      $effect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
      });
    });
  }
}

export function resetGame() {
  Object.assign(game, JSON.parse(JSON.stringify(defaultState)));
}

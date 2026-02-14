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
  devMode: false,
};

export const game = $state<GameState>(
  JSON.parse(JSON.stringify(defaultState)) // чтобы не мутировать оригинал
);

export function loadGame() {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        Object.assign(game, parsed); // мутируем game чтобы была реактивность
      } catch (e) {
        console.error("Ошибка при загрузке состояния игры из localStorage", e);
      }
    }
  }
}

export function resetGame() {
  Object.assign(game, JSON.parse(JSON.stringify(defaultState)));
}

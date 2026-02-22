import { game } from "$lib/state/gameStore.svelte";

export function pauseGameTimer() {
  if (game.timerEndsAt) {
    game.pausedRemainingMs = Math.max(0, game.timerEndsAt - Date.now());
    game.timerEndsAt = null;
  }
}

export function resumeGameTimer() {
  if (game.pausedRemainingMs !== null) {
    game.timerEndsAt = Date.now() + game.pausedRemainingMs;
    game.pausedRemainingMs = null;
  }
}

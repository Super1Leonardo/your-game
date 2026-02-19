import { goto } from "$app/navigation";
import { game } from "$lib/state/gameStore.svelte";
import { addToast } from "$lib/components/ui/Toaster.svelte";

export function closeQuestion(msg: string = "") {
  if (msg) {
    addToast({ data: { title: msg, type: "info" } });
  }

  game.activeQuestion = null;
  game.answeringPlayerId = null;
  game.attemptedPlayerIds = [];
  game.timerEndsAt = null;

  goto("/game");
}

export function endQuestion(msg: string = "") {
  if (msg) {
    addToast({ data: { title: msg, type: "info" } });
  }

  if (game.activeQuestion) {
    game.activeQuestion.isPlayed = true;
  }

  game.activeQuestion = null;
  game.answeringPlayerId = null;
  game.attemptedPlayerIds = [];
  game.timerEndsAt = null;

  goto("/game");
}

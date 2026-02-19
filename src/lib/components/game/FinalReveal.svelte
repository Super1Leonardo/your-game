<script lang="ts">
  import type { Player } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import { goto } from "$app/navigation";

  let { finalPlayers }: { finalPlayers: Player[] } = $props();

  let revealIndex = $state(-1);
  let correctRevealed = $state(false);

  function nextReveal() {
    if (revealIndex < finalPlayers.length - 1) {
      revealIndex++;

      const p = finalPlayers[revealIndex];
      const bet = game.finalState?.bets[p.id] || 0;
      const ans = game.finalState?.answers[p.id] || "";
      const correctAns = game.finalQuestion?.answer || "";

      const isCorrect =
        ans.trim().toLowerCase() === correctAns.trim().toLowerCase(); // проверка

      if (isCorrect) {
        p.score += bet;
      } else {
        p.score -= bet;
      }
    } else if (!correctRevealed) {
      correctRevealed = true;
    }
  }

  function finishGame() {
    game.phase = "results";
    goto("/results");
  }
</script>

<div class="card bg-base-100 shadow-2xl w-full">
  <div class="card-body text-center p-10">
    <h2 class="text-5xl font-extrabold mb-8">Итоги финала</h2>

    <div class="flex flex-col gap-4 mb-8">
      {#each finalPlayers as player, i}
        <div
          class="p-6 border-2 border-base-content/10 rounded-box flex justify-between items-center transition-all duration-500 {i >
          revealIndex
            ? 'opacity-30 scale-95'
            : 'opacity-100 shadow-md'}"
        >
          <div class="flex flex-col items-start">
            <span class="text-2xl font-bold">{player.name}</span>
            <span class="text-lg opacity-70">Счет: {player.score}</span>
          </div>

          {#if i <= revealIndex}
            <div
              class="flex flex-col items-end gap-2 animate-in slide-in-from-right duration-300"
            >
              <span class="badge badge-primary badge-lg"
                >Ставка: {game.finalState?.bets[player.id]}</span
              >
              <span class="font-mono text-xl bg-base-200 px-3 py-1 rounded-md">
                {game.finalState?.answers[player.id] || "—"}
              </span>
            </div>
          {/if}
        </div>
      {/each}
    </div>

    <div class="h-32 flex items-center justify-center">
      {#if correctRevealed}
        <div
          class="w-full bg-success/20 text-success-content p-6 rounded-box border-2 border-success animate-in fade-in zoom-in duration-500"
        >
          <h3 class="font-bold text-xl text-secondary uppercase tracking-wide">
            Правильный ответ:
          </h3>
          <p class="text-4xl text-secondary font-extrabold mt-2">
            {game.finalQuestion?.answer}
          </p>
        </div>
      {/if}
    </div>

    <div class="mt-4">
      {#if revealIndex < finalPlayers.length - 1}
        <button
          class="btn btn-primary btn-lg w-full max-w-sm"
          onclick={nextReveal}
          >Показать ответ игрока
        </button>
      {:else if !correctRevealed}
        <button
          class="btn btn-secondary -mt-2 btn-lg w-full max-w-sm"
          onclick={nextReveal}>Показать правильный ответ</button
        >
      {:else}
        <button
          class="btn btn-primary btn-lg w-full max-w-sm"
          onclick={finishGame}>К результатам игры!</button
        >
      {/if}
    </div>
  </div>
</div>

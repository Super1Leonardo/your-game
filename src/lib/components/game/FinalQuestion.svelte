<script lang="ts">
  import type { Player } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import Timer from "./Timer.svelte";
  import { devMode } from "$lib/state/devStore.svelte";

  let { finalPlayers }: { finalPlayers: Player[] } = $props();

  // Индекс вычисляется из глобального стора
  let currentPlayerIndex = $derived(
    game.finalState ? game.finalState.completedPlayerIds.length : 0
  );
  let currentPlayer = $derived(finalPlayers[currentPlayerIndex]);

  let answerInput = $state("");
  let isReady = $state(false);
  let pausedRemainingMs: number | null = $state(null);

  // Если мы перезагрузили страницу, а таймер в сторе еще активен — возвращаем isReady
  $effect(() => {
    if (game.timerEndsAt && game.timerEndsAt > Date.now()) {
      isReady = true;
    }
  });

  function startTurn() {
    isReady = true;
    game.timerEndsAt = Date.now() + 60000;
  }

  function pauseTimer() {
    if (game.timerEndsAt) {
      pausedRemainingMs = Math.max(0, game.timerEndsAt - Date.now());
      game.timerEndsAt = null;
    }
  }

  function resumeTimer() {
    if (pausedRemainingMs !== null) {
      game.timerEndsAt = Date.now() + pausedRemainingMs;
      pausedRemainingMs = null;
    }
  }

  function submitAnswer() {
    if (!currentPlayer) return;
    if (game.finalState) {
      game.finalState.answers[currentPlayer.id] = answerInput || "";
      game.finalState.completedPlayerIds.push(currentPlayer.id);
    }

    game.timerEndsAt = null;
    pausedRemainingMs = null;
    answerInput = "";
    isReady = false;
  }

  function handleTimeUp() {
    submitAnswer();
  }
</script>

<div class="card bg-base-100 shadow-2xl border-t-4 border-secondary w-full">
  <div class="card-body items-center text-center p-10">
    {#if !isReady && currentPlayer}
      <h3 class="text-4xl mb-4">
        Очередь игрока: <span class="font-extrabold text-secondary"
          >{currentPlayer.name}</span
        >
      </h3>
      <p class="mb-8 opacity-70 text-lg">
        Приготовьтесь. На ответ у вас будет ровно 60 секунд.
      </p>
      <button class="btn btn-secondary btn-lg px-12" onclick={startTurn}
        >Я готов(а)</button
      >
    {:else if isReady && currentPlayer}
      <div
        class="w-full max-w-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300"
      >
        <Timer time={60} onTimeUp={handleTimeUp} />

        <h2 class="text-4xl font-extrabold my-8 leading-tight">
          {game.finalQuestion?.text}
        </h2>

        {#if devMode.enabled}
          <div class="flex justify-center items-stretch gap-3 mb-6 w-full">
            <div
              class="px-4 flex items-center py-2 justify-center bg-info text-info-content rounded-2xl shadow-sm text-lg"
            >
              <span>Ответ: <strong>{game.finalQuestion?.answer}</strong></span>
            </div>

            {#if game.timerEndsAt}
              <button
                class="btn btn-warning w-1/5 text-lg h-auto"
                onclick={pauseTimer}
              >
                Пауза
              </button>
            {:else if pausedRemainingMs !== null}
              <button
                class="btn btn-success w-1/5 text-lg h-auto"
                onclick={resumeTimer}
              >
                Возобновить
              </button>
            {/if}
          </div>
        {/if}

        <input
          type="text"
          bind:value={answerInput}
          class="input border-2 input-secondary input-lg w-full text-center text-2xl mb-6"
          placeholder="Ваш ответ"
          onkeydown={(e) => e.key === "Enter" && submitAnswer()}
        />
        <button class="btn btn-success btn-lg w-full" onclick={submitAnswer}>
          Сохранить ответ
        </button>
      </div>
    {/if}
  </div>
</div>

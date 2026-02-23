<script lang="ts">
  import type { Player } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import Timer from "./Timer.svelte";
  import { devMode } from "$lib/state/devStore.svelte";
  import { pauseGameTimer, resumeGameTimer } from "$lib/utils/timer";
  import { fade, fly } from "svelte/transition";

  let { finalPlayers }: { finalPlayers: Player[] } = $props();

  // Индекс вычисляется из глобального стора
  let currentPlayerIndex = $derived(
    game.finalState ? game.finalState.completedPlayerIds.length : 0,
  );
  let currentPlayer = $derived(finalPlayers[currentPlayerIndex]);
  let answerInput = $state("");
  let isReady = $state(false);
  let readyHeight = $state(0);
  let questionHeight = $state(0);
  let currentContentHeight = $derived(
    !isReady ? readyHeight : questionHeight || readyHeight,
  );

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
    pauseGameTimer();
  }

  function resumeTimer() {
    resumeGameTimer();
  }

  function submitAnswer() {
    if (!currentPlayer) return;
    if (game.finalState) {
      game.finalState.answers[currentPlayer.id] = answerInput || "";
      game.finalState.completedPlayerIds.push(currentPlayer.id);
    }

    game.timerEndsAt = null;
    game.pausedRemainingMs = null;
    answerInput = "";
    isReady = false;
  }

  function handleTimeUp() {
    submitAnswer();
  }
</script>

<div
  class="card bg-base-100 shadow-2xl border-t-4 border-secondary w-full overflow-x-hidden"
>
  <div class="card-body items-center text-center p-10">
    <div
      class="grid w-full justify-items-center items-start transition-[height] duration-300 ease-in-out overflow-hidden"
      style={currentContentHeight ? `height: ${currentContentHeight}px` : ""}
    >
      {#if !isReady && currentPlayer}
        <div
          bind:clientHeight={readyHeight}
          class="col-start-1 row-start-1 flex flex-col items-center w-full"
          in:fly={{ y: 50, duration: 400, delay: 400 }}
          out:fly={{ y: -50, duration: 400 }}
        >
          <h3 class="text-4xl mb-4">
            Очередь игрока <span class="font-extrabold text-secondary"
              >{currentPlayer.name}</span
            >
          </h3>
          <p class="mb-8 opacity-70 text-lg">
            Приготовьтесь. На ответ у вас будет ровно 60 секунд.
          </p>
          <button
            data-test-id="final-ready-btn"
            class="btn btn-primary btn-lg px-12"
            onclick={startTurn}>Я готов(а)</button
          >
        </div>
      {:else if isReady && currentPlayer}
        <div
          bind:clientHeight={questionHeight}
          class="col-start-1 row-start-1 w-full max-w-2xl flex flex-col items-center"
          in:fade={{ duration: 200, delay: 400 }}
          out:fade={{ duration: 200 }}
        >
          <Timer time={60} onTimeUp={handleTimeUp} />

          <h2 class="text-4xl font-extrabold my-8 leading-tight">
            {game.finalQuestion?.text}
          </h2>

          <div
            class="grid transition-all duration-300 ease-in-out w-full"
            style="grid-template-rows: {devMode.enabled
              ? '1fr'
              : '0fr'}; opacity: {devMode.enabled ? '1' : '0'};"
            inert={!devMode.enabled}
          >
            <div class="overflow-hidden w-full">
              <div class="flex justify-center items-stretch gap-3 pb-6 w-full">
                <div
                  class="px-4 flex items-center py-2 justify-center bg-info text-info-content rounded-2xl shadow-sm text-lg"
                >
                  <span
                    >Ответ: <strong>{game.finalQuestion?.answer}</strong></span
                  >
                </div>

                {#if game.timerEndsAt}
                  <button
                    class="btn btn-warning w-1/5 text-lg h-auto"
                    onclick={pauseTimer}
                  >
                    Пауза
                  </button>
                {:else if game.pausedRemainingMs !== null}
                  <button
                    class="btn btn-success w-1/5 text-lg h-auto"
                    onclick={resumeTimer}
                  >
                    Возобновить
                  </button>
                {/if}
              </div>
            </div>
          </div>

          <input
            type="text"
            data-test-id="final-answer-input"
            bind:value={answerInput}
            class="input border-2 input-primary input-lg p-2 w-full text-center text-2xl mb-6"
            placeholder="Ваш ответ"
            onkeydown={(e) => e.key === "Enter" && submitAnswer()}
          />
          <button
            data-test-id="final-answer-submit"
            class="btn btn-success btn-lg w-1/2"
            onclick={submitAnswer}
          >
            Сохранить ответ
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>

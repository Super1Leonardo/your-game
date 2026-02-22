<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
  import Timer from "$lib/components/game/Timer.svelte";
  import DevModeButtons from "$lib/components/game/DevModeButtons.svelte";
  import { devMode } from "$lib/state/devStore.svelte";

  let {
    answerInput = $bindable(),
    submitAnswer,
    handleTimeUp,
    pauseTimer,
    resumeTimer,
    pausedRemainingMs,
  }: {
    answerInput: string;
    submitAnswer: () => void;
    handleTimeUp: () => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    pausedRemainingMs: number | null;
  } = $props();
</script>

<div
  class="card w-full max-w-4xl bg-base-100 shadow-2xl border-t-4 border-primary"
>
  <div class="card-body items-center text-center p-10 gap-8">
    <div class="badge badge-primary badge-lg p-4 text-xl">
      {game.activeQuestion?.price} баллов
    </div>

    <h2 class="text-4xl font-extrabold leading-tight">
      {game.activeQuestion?.text}
    </h2>

    {#if devMode.enabled}
      <div class="flex justify-center items-stretch gap-3 mt-4 w-full">
        <div
          class="px-4 flex items-center py-2 justify-center bg-info text-info-content rounded-2xl shadow-sm text-lg"
        >
          <span
            >Ответ: <strong data-test-id="question-answer"
              >{game.activeQuestion?.answer}</strong
            ></span
          >
        </div>
        {#if game.timerEndsAt}
          <button
            class="btn btn-warning w-1/5 text-lg h-auto"
            onclick={pauseTimer}>Пауза</button
          >
        {:else if pausedRemainingMs !== null && !game.answeringPlayerId}
          <button
            class="btn btn-success w-1/5 text-lg h-auto"
            onclick={resumeTimer}>Возобновить</button
          >
        {/if}
      </div>
    {/if}

    {#if !game.answeringPlayerId}
      <div class="flex flex-col items-center gap-4 mt-4">
        <Timer onTimeUp={handleTimeUp} />
        <p class="text-base-content/70 animate-pulse">
          Нажмите свою клавишу для ответа...
        </p>
        <div class="flex gap-4 mt-2">
          {#each game.players as player}
            <div
              class="badge badge-outline badge-lg {game.attemptedPlayerIds.includes(
                player.id,
              )
                ? 'opacity-30 line-through'
                : ''}"
            >
              {player.name} ({player.key === " "
                ? "Пробел"
                : player.key.toUpperCase()})
            </div>
          {/each}
        </div>
      </div>
    {:else}
      {@const answeringPlayer = game.players.find(
        (p) => p.id === game.answeringPlayerId,
      )}
      <div
        class="w-full max-w-md flex flex-col gap-4 animate-in fade-in zoom-in duration-300"
      >
        <div
          data-test-id="active-player"
          class="justify-center text-xl font-bold"
        >
          Отвечает {answeringPlayer?.name}
        </div>
        <input
          type="text"
          data-test-id="question-input"
          placeholder="Введите ваш ответ..."
          class="input border-2 input-primary input-lg w-full text-center"
          bind:value={answerInput}
          onkeydown={(e) => e.key === "Enter" && submitAnswer()}
        />
        <button
          data-test-id="question-submit"
          class="btn btn-primary btn-lg w-full"
          onclick={submitAnswer}
        >
          Ответить
        </button>
      </div>
    {/if}

    {#if devMode.enabled}
      <div class="w-1/2"><DevModeButtons /></div>
    {/if}
  </div>
</div>

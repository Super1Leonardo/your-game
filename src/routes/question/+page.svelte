<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import Timer from "$lib/components/game/Timer.svelte";
  import Cat from "$lib/components/game/Cat.svelte";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { onMount } from "svelte";
  import { initKeyboardManager } from "$lib/utils/keyboardManager";
  import Header from "$lib/components/game/Header.svelte";
  import Auction from "$lib/components/game/Auction.svelte";
  import { endQuestion } from "$lib/utils/gameActions";
  import { devMode } from "$lib/state/devStore.svelte";
  import DevModeButtons from "$lib/components/game/DevModeButtons.svelte";

  let answerInput = $state("");
  let isSpecialSetupDone = $state(false);
  let isCat = $derived(game.activeQuestion?.type === "cat");
  let isAuction = $derived(game.activeQuestion?.type === "auction");
  let pausedRemainingMs: number | null = $state(null); // время на котором паузу поставили

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

  onMount(() => {
    if (!game.activeQuestion) {
      goto("/game");
      return;
    }

    // стартуем таймер если вопрос только открыли на обычном вопросе
    if (
      game.activeQuestion?.type === "normal" &&
      !game.answeringPlayerId &&
      !game.timerEndsAt &&
      game.attemptedPlayerIds.length === 0
    ) {
      game.timerEndsAt = Date.now() + 30000;
    }

    return initKeyboardManager(); // менеджер клавиатуры и отписка при уничтожении компонента
  });

  function handleTimeUp() {
    endQuestion("Время вышло! Никто не ответил.");
  }

  function submitAnswer() {
    if (!game.answeringPlayerId || !game.activeQuestion) return;

    const player = game.players.find((p) => p.id === game.answeringPlayerId);
    if (!player) return;

    const isCorrect =
      answerInput.trim().toLowerCase() ===
      game.activeQuestion.answer.trim().toLowerCase();

    if (isCorrect) {
      player.score += game.activeQuestion.price;
      game.currentPlayerId = player.id; // передача права хода
      addToast({
        data: {
          title: `Верно! +${game.activeQuestion.price}`,
          type: "success",
        },
      });
      endQuestion("");
    } else {
      player.score -= game.activeQuestion.price;
      if (
        game.activeQuestion.type === "cat" ||
        game.activeQuestion.type === "auction"
      ) {
        addToast({
          data: {
            title: `Неверно! -${game.activeQuestion.price}`,
            type: "error",
          },
        });
        endQuestion("Вопрос закрыт.");
        return;
      }
      game.attemptedPlayerIds.push(player.id);
      addToast({
        data: {
          title: `Неверно! -${game.activeQuestion.price}`,
          type: "error",
        },
      });

      answerInput = "";
      game.answeringPlayerId = null;

      if (game.attemptedPlayerIds.length === game.players.length) {
        endQuestion("Никто не дал верного ответа.");
      } else {
        // возобновляем таймер для остальных
        game.timerEndsAt = Date.now() + 30000;
      }
    }
  }
</script>

<div
  class="min-h-screen bg-base-200 flex flex-col items-center justify-center py-8 px-4"
>
  <Header />
  <div class="grow w-full flex flex-col items-center justify-center">
    {#if isCat && !isSpecialSetupDone}
      <Cat onSetupComplete={() => (isSpecialSetupDone = true)} />
    {:else if isAuction && !isSpecialSetupDone}
      <Auction onSetupComplete={() => (isSpecialSetupDone = true)} />
    {:else if game.activeQuestion}
      <div
        class="card w-full max-w-4xl bg-base-100 shadow-2xl border-t-4 border-primary"
      >
        <div class="card-body items-center text-center p-10 gap-8">
          <div class="badge badge-primary badge-lg p-4 text-xl">
            {game.activeQuestion.price} баллов
          </div>

          <h2 class="text-4xl font-extrabold leading-tight">
            {game.activeQuestion.text}
          </h2>

          {#if devMode.enabled}
            <div class="flex justify-center items-stretch gap-3 mt-4 w-full">
              <div
                class=" px-4 flex items-center py-2 justify-center bg-info text-info-content rounded-2xl shadow-sm text-lg"
              >
                <span>Ответ: <strong>{game.activeQuestion.answer}</strong></span
                >
              </div>

              {#if game.timerEndsAt}
                <button
                  class="btn btn-warning w-1/5 text-lg h-auto"
                  onclick={pauseTimer}
                >
                  Пауза
                </button>
              {:else if pausedRemainingMs !== null && !game.answeringPlayerId}
                <button
                  class="btn btn-success w-1/5 text-lg h-auto"
                  onclick={resumeTimer}
                >
                  Возобновить
                </button>
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
                      player.id
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
              (p) => p.id === game.answeringPlayerId
            )}
            <div
              class="w-full max-w-md flex flex-col gap-4 animate-in fade-in zoom-in duration-300"
            >
              <div class=" justify-center text-xl font-bold">
                Отвечает: {answeringPlayer?.name}
              </div>
              <input
                type="text"
                placeholder="Введите ваш ответ..."
                class="input border-2 input-primary input-lg w-full text-center"
                bind:value={answerInput}
                onkeydown={(e) => e.key === "Enter" && submitAnswer()}
              />
              <button
                class="btn btn-primary btn-lg w-full"
                onclick={submitAnswer}
              >
                Ответить
              </button>
            </div>
          {/if}
          {#if devMode.enabled}
            <div class="w-1/2">
              <DevModeButtons />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

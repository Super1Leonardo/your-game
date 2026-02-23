<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import Cat from "$lib/components/game/Cat.svelte";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { onMount } from "svelte";
  import { initKeyboardManager } from "$lib/utils/keyboardManager";
  import Header from "$lib/components/game/Header.svelte";
  import Auction from "$lib/components/game/Auction.svelte";
  import AvgQuestion from "$lib/components/game/AvgQuestion.svelte";
  import { endQuestion } from "$lib/utils/gameActions";
  import { checkAnswer } from "$lib/utils/answerChecker";
  import { pauseGameTimer, resumeGameTimer } from "$lib/utils/timer";
  import { fade, fly } from "svelte/transition";

  let answerInput = $state("");
  let isSpecialSetupDone = $state(false);
  let isCat = $derived(game.activeQuestion?.type === "cat");
  let isAuction = $derived(game.activeQuestion?.type === "auction");

  function pauseTimer() {
    pauseGameTimer();
  }

  function resumeTimer() {
    resumeGameTimer();
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

    const isCorrect = checkAnswer(
      answerInput,
      game.activeQuestion.answer,
      1,
      2,
    );

    if (isCorrect) {
      player.score += game.activeQuestion.price;
      game.currentPlayerId = player.id; // передача права хода
      addToast({
        data: {
          title: `Верно! +${game.activeQuestion.price}`,
          type: "success",
          testid: `success-answer-${game.activeQuestion.price}`,
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
            testid: `wrong-answer-${game.activeQuestion.price}`,
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
          testid: `wrong-answer-${game.activeQuestion.price}`,
        },
      });

      answerInput = "";
      game.answeringPlayerId = null;

      if (game.attemptedPlayerIds.length === game.players.length) {
        endQuestion("Никто не дал верного ответа.");
      } else {
        // возобновляем таймер для остальных
        resumeTimer();
      }
    }
  }
</script>

<div
  class="min-h-screen bg-base-200 flex flex-col items-center justify-center py-8 px-4"
>
  <Header />
  <div class="grow w-full grid place-items-center">
    {#if isCat && !isSpecialSetupDone}
      <div
        class="col-start-1 row-start-1 w-full flex justify-center"
        out:fly={{ y: -30, duration: 300 }}
      >
        <Cat onSetupComplete={() => (isSpecialSetupDone = true)} />
      </div>
    {:else if isAuction && !isSpecialSetupDone}
      <div
        class="col-start-1 row-start-1 w-full flex justify-center"
        out:fly={{ y: -30, duration: 300 }}
      >
        <Auction onSetupComplete={() => (isSpecialSetupDone = true)} />
      </div>
    {:else if game.activeQuestion}
      <div
        class="col-start-1 row-start-1 w-full flex justify-center"
        in:fly={{ y: 30, duration: 400, delay: 300 }}
        out:fade={{ duration: 200 }}
      >
        <AvgQuestion
          bind:answerInput
          {submitAnswer}
          {handleTimeUp}
          {pauseTimer}
          {resumeTimer}
          pausedRemainingMs={game.pausedRemainingMs}
        />
      </div>
    {/if}
  </div>
</div>

<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { goto } from "$app/navigation";
  import { devMode } from "$lib/state/devStore.svelte";
  import DevModeButtons from "./DevModeButtons.svelte";
  import GameDialog from "./GameDialog.svelte";

  let { onSetupComplete }: { onSetupComplete: () => void } = $props();

  let activePlayerIds = $state(game.players.map((p) => p.id)); // начинает тот кто выбрал вопрос
  let currentPlayerIndex = $state(
    Math.max(0, activePlayerIds.indexOf(game.currentPlayerId || ""))
  );

  let highestBidderId = $state<string | null>(null);
  let currentBet = $state(game.activeQuestion?.price || 100);
  let isAllInMode = $state(false);
  let betInput = $state<number | "">("");

  let activePlayer = $derived(
    game.players.find((p) => p.id === activePlayerIds[currentPlayerIndex])
  );
  let activePlayerScore = $derived(activePlayer?.score || 0);
  let requiredMin = $derived(
    highestBidderId === null ? currentBet : currentBet + 1
  );

  let highestBidderName = $derived(
    game.players.find((p) => p.id === highestBidderId)?.name || ""
  );

  function placeBet(amount: number, isExplicitAllIn: boolean) {
    if (!activePlayer) return;

    // Автоматически засчитываем ручной ввод всех баллов как ва-банк
    const isAllIn = isExplicitAllIn || amount === activePlayerScore;

    if (isAllInMode && !isAllIn) {
      addToast({
        data: {
          title: "Можно перебить только ставкой Ва-банк!",
          type: "error",
        },
      });
      return;
    }

    if (amount < requiredMin) {
      addToast({
        data: { title: `Минимальная ставка: ${requiredMin}`, type: "error" },
      });
      return;
    }

    if (amount > activePlayerScore) {
      addToast({
        data: { title: "У вас нет столько баллов!", type: "error" },
      });
      return;
    }

    highestBidderId = activePlayer.id;
    currentBet = amount;
    if (isAllIn) isAllInMode = true;

    nextTurn();
  }

  function nextTurn() {
    // остался один чел и он делает ставку
    if (activePlayerIds.length === 1 && highestBidderId !== null) {
      finishAuction();
      return;
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % activePlayerIds.length;
    betInput = "";

    // если ход у текущего лидера значит остальные скипнули
    if (activePlayerIds[currentPlayerIndex] === highestBidderId) {
      finishAuction();
    }
  }

  function fold() {
    activePlayerIds.splice(currentPlayerIndex, 1);

    // корректируем индекс если выбыл последний в массиве
    if (currentPlayerIndex >= activePlayerIds.length) {
      currentPlayerIndex = 0;
    }
    betInput = "";

    if (activePlayerIds.length === 0) {
      addToast({
        data: { title: "Все спасовали, вопрос сгорает", type: "info" },
      });
      if (game.activeQuestion) game.activeQuestion.isPlayed = true;
      game.activeQuestion = null;
      goto("/game");
    } else if (activePlayerIds.length === 1 && highestBidderId !== null) {
      finishAuction();
    } else if (activePlayerIds[currentPlayerIndex] === highestBidderId) {
      finishAuction();
    }
  }

  function finishAuction() {
    if (game.activeQuestion && highestBidderId) {
      game.activeQuestion.price = currentBet;
      game.answeringPlayerId = highestBidderId;
      game.currentPlayerId = highestBidderId;
      onSetupComplete();
    }
  }
</script>

<GameDialog
  contentClass="max-w-lg flex flex-col items-center text-center gap-6"
>
  <h2 class="text-4xl font-extrabold">Аукцион!</h2>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl w-full">
    <p class="text-lg">
      Номинал: <strong class="text-secondary"
        >{game.activeQuestion?.price}</strong
      >
    </p>
    {#if highestBidderId}
      <p class="text-xl">
        Ставка: <strong>{currentBet}</strong> ({highestBidderName})
      </p>
    {/if}
    {#if isAllInMode}
      <div
        class="badge badge-error badge-lg mx-auto font-bold animate-pulse mt-2"
      >
        Режим Ва-банк!
      </div>
    {/if}
  </div>

  <div class="divider font-bold opacity-50 text-sm uppercase tracking-wide">
    Ход игрока
  </div>

  <h3 class="text-3xl font-bold text-secondary">{activePlayer?.name}</h3>
  <p class="text-xl">На счете: <strong>{activePlayerScore}</strong></p>

  <div class="flex gap-4 h-12 w-full justify-center mt-2">
    <input
      type="number"
      class="input input-bordered input-primary h-full px-5 py-2 border-2 text-center text-xl font-bold"
      placeholder="Сумма"
      bind:value={betInput}
      onkeydown={(e) =>
        e.key === "Enter" &&
        typeof betInput === "number" &&
        placeBet(betInput, false)}
    />
    <button
      class="btn btn-primary h-full text-lg"
      onclick={() => typeof betInput === "number" && placeBet(betInput, false)}
    >
      Поставить
    </button>
  </div>

  <div class="flex gap-4 w-full mt-4">
    <button class="btn btn-outline btn-error flex-1 text-lg" onclick={fold}>
      Пас
    </button>
    <button
      class="btn btn-success btn-outline flex-1 text-lg"
      onclick={() => placeBet(activePlayerScore, true)}
    >
      Ва-банк!
    </button>
  </div>

  {#if devMode.enabled}
    <DevModeButtons />
  {/if}
</GameDialog>

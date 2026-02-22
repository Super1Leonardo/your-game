<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { goto } from "$app/navigation";
  import AuctionUI from "./AuctionUI.svelte";

  let { onSetupComplete }: { onSetupComplete: () => void } = $props();

  let activePlayerIds = $state(game.players.map((p) => p.id)); // начинает тот кто выбрал вопрос
  let currentPlayerIndex = $state(Math.max(0, activePlayerIds.indexOf(game.currentPlayerId || "")));

  let highestBetterId = $state<string | null>(null);
  let currentBet = $state(game.activeQuestion?.price || 100);
  let isAllInMode = $state(false);
  let betInput = $state<number | "">("");

  let activePlayer = $derived(game.players.find((p) => p.id === activePlayerIds[currentPlayerIndex]));
  let activePlayerScore = $derived(activePlayer?.score || 0);
  let requiredMin = $derived(highestBetterId === null ? currentBet : currentBet + 1);
  let highestBetterName = $derived(game.players.find((p) => p.id === highestBetterId)?.name || "");

  function placeBet(amount: number, isExplicitAllIn: boolean) {
    if (!activePlayer) return;

    // fвтоматически засчитываем ручной ввод всех баллов как вабанк
    const isAllIn = isExplicitAllIn || amount === activePlayerScore;

    if (isAllInMode && !isAllIn) {
      addToast({ data: {title: "Можно перебить только ставкой Ва-банк!", type: "error", testid: "allin-notification"}});
      return;
    }

    if (amount < requiredMin) {
      addToast({data: { title: `Минимальная ставка: ${requiredMin}`, type: "error" }});
      return;
    }

    if (amount > activePlayerScore) {
      addToast({data: { title: "У вас нет столько баллов!", type: "error" }});
      return;
    }

    highestBetterId = activePlayer.id;
    currentBet = amount;
    if (isAllIn) isAllInMode = true;

    nextTurn();
  }

  function nextTurn() {
    // остался один чел и он делает ставку
    if (activePlayerIds.length === 1 && highestBetterId !== null) {
      return finishAuction();
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % activePlayerIds.length;
    betInput = "";

    // если ход у текущего лидера значит остальные скипнули
    if (activePlayerIds[currentPlayerIndex] === highestBetterId) {
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
      addToast({data: { title: "Все спасовали, вопрос сгорает", type: "info" }});
      if (game.activeQuestion) game.activeQuestion.isPlayed = true;
      game.activeQuestion = null;
      goto("/game");
    } else if (activePlayerIds.length === 1 && highestBetterId !== null) {
      finishAuction();
    } else if (activePlayerIds[currentPlayerIndex] === highestBetterId) {
      finishAuction();
    }
  }

  function finishAuction() {
    if (game.activeQuestion && highestBetterId) {
      game.activeQuestion.price = currentBet;
      game.answeringPlayerId = highestBetterId;
      game.currentPlayerId = highestBetterId;
      onSetupComplete();
    }
  }
</script>

<AuctionUI
  {highestBetterId}
  {currentBet}
  {isAllInMode}
  {highestBetterName}
  {activePlayer}
  {activePlayerScore}
  bind:betInput
  {placeBet}
  {fold}
/>
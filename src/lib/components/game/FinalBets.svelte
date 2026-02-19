<script lang="ts">
  import type { Player } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import { addToast } from "$lib/components/ui/Toaster.svelte";

  let { finalPlayers }: { finalPlayers: Player[] } = $props();

  // Индекс вычисляется из глобального стора (после F5 вернет нужного игрока)
  let currentPlayerIndex = $derived(
    game.finalState ? Object.keys(game.finalState.bets).length : 0
  );
  let betInput = $state("");

  let currentPlayer = $derived(finalPlayers[currentPlayerIndex]);
  let isAllBetsDone = $derived(currentPlayerIndex >= finalPlayers.length);

  function submitBet() {
    const betAmount = parseInt(betInput, 10);
    if (isNaN(betAmount) || betAmount < 1 || betAmount > currentPlayer.score) {
      addToast({
        data: {
          title: `Ставка должна быть от 1 до ${currentPlayer.score}`,
          type: "error",
        },
      });
      return;
    }

    if (game.finalState) {
      game.finalState.bets[currentPlayer.id] = betAmount; // это триггерит обновление step и index
    }
    betInput = "";
  }
</script>

<div class="card bg-base-100 border-t-4 border-primary shadow-2xl w-full">
  <div class="card-body items-center text-center p-10">
    <div class="badge badge-primary badge-lg mb-4">Финал</div>
    <h2 class="text-3xl font-bold mb-8 opacity-80">
      Тема: {game.finalQuestion?.theme}
    </h2>

    {#if !isAllBetsDone && currentPlayer}
      <div class="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <h3 class="text-2xl mb-2">
          Ставку делает: <span class="font-extrabold text-primary"
            >{currentPlayer.name}</span
          >
        </h3>
        <p class="mb-6 opacity-60 text-sm uppercase tracking-wide">
          Остальные игроки, отвернитесь!
        </p>

        <div class="form-control w-full">
          <label class="label"
            ><span class="label-text">Сумма (макс. {currentPlayer.score})</span
            ></label
          >
          <input
            type="number"
            min="1"
            max={currentPlayer.score}
            bind:value={betInput}
            class="input border-2 input-primary input-lg w-full text-center text-2xl font-bold"
            placeholder="Ваша ставка"
            onkeydown={(e) => e.key === "Enter" && submitBet()}
          />
        </div>
        <button class="btn btn-primary btn-lg w-full mt-6" onclick={submitBet}>
          Подтвердить и скрыть ставку
        </button>
      </div>
    {/if}
  </div>
</div>

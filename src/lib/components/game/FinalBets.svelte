<script lang="ts">
  import type { Player } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { fade } from "svelte/transition";

  let { finalPlayers }: { finalPlayers: Player[] } = $props();

  // Индекс вычисляется из глобального стора (после F5 вернет нужного игрока)
  let currentPlayerIndex = $derived(
    game.finalState ? Object.keys(game.finalState.bets).length : 0,
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
      Тема: {game.finalQuestion?.secretTheme}
    </h2>

    {#if !isAllBetsDone && currentPlayer}
      <div class="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div class="grid place-items-center h-10 w-full relative">
          <div class="grid place-items-center h-10 w-full relative">
            {#key currentPlayer.id}
              <h3
                in:fade={{ duration: 300, delay: 150 }}
                out:fade={{ duration: 150 }}
                class="text-2xl mb-2 col-start-1 row-start-1 whitespace-nowrap absolute top-0"
              >
                Ставку делает <span class="font-extrabold text-secondary"
                  >{currentPlayer.name}</span
                >
              </h3>
            {/key}
          </div>
        </div>
        <p class="mb-6 text-error text-sm uppercase tracking-wide">
          Остальные игроки, отвернитесь!
        </p>

        <div class="form-control w-full">
          <label class="label" for="bet"
            ><span class="label-text">Сумма (макс. {currentPlayer.score})</span
            ></label
          >
          <input
            id="bet"
            type="number"
            min="1"
            data-test-id="final-bet-input"
            max={currentPlayer.score}
            bind:value={betInput}
            class="input border-2 input-primary input-lg w-full mb-3 mt-1 text-center text-2xl font-bold"
            placeholder="Ваша ставка"
            onkeydown={(e) => e.key === "Enter" && submitBet()}
          />
        </div>
        <button
          data-test-id="final-bet-submit"
          class="btn btn-primary btn-lg w-full"
          onclick={submitBet}
        >
          Подтвердить и скрыть ставку
        </button>
      </div>
    {/if}
  </div>
</div>

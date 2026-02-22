<script lang="ts">
  import type { Player } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import DevModeButtons from "./DevModeButtons.svelte";
  import { devMode } from "$lib/state/devStore.svelte";
  import PlayerCombobox from "./PlayerDropdown.svelte";
  import GameDialog from "./GameDialog.svelte";

  let { onSetupComplete }: { onSetupComplete: () => void } = $props();

  let step: "selectPlayer" | "showTheme" | "bet" = $state("selectPlayer");
  let tempSelectedPlayer: Player | null = $state(null);
  let chosenPlayer: Player | null = $state(null);

  let dialogOpen = $state(true);

  let otherPlayers = $derived(
    game.players.filter((p) => p.id !== game.currentPlayerId),
  );

  function confirmPlayer() {
    if (tempSelectedPlayer) {
      chosenPlayer = tempSelectedPlayer;
      step = "showTheme";
    }
  }

  function placeBet(amount: number) {
    if (game.activeQuestion && chosenPlayer) {
      game.activeQuestion.price = amount;
      game.answeringPlayerId = chosenPlayer.id;
      game.currentPlayerId = chosenPlayer.id;
      onSetupComplete();
    }
  }

  let availableBets = $derived(
    game.phase === "round1" ? [100, 500] : [200, 1000],
  );
</script>

{#if step === "selectPlayer"}
  <GameDialog open={true} contentClass="max-w-md">
    <h2 class="text-3xl font-extrabold mb-2">Кот в мешке!</h2>
    <p class="text-base-content/70 mb-6">Кому передадим этого кота?</p>

    <div class="flex flex-col gap-2 mb-8">
      <label for="cat-input" class="text-sm font-semibold">Игрок:</label>
      <PlayerCombobox
        players={otherPlayers}
        bind:selectedPlayer={tempSelectedPlayer}
      />
    </div>

    <button
      data-test-id="cat-confirm-button"
      class="btn btn-primary w-full btn-lg mb-4"
      onclick={confirmPlayer}
      disabled={!tempSelectedPlayer}
    >
      Подтвердить выбор
    </button>

    {#if devMode.enabled}
      <DevModeButtons />
    {/if}
  </GameDialog>
{/if}

{#if step === "showTheme" || step === "bet"}
  <div
    class="card w-full max-w-2xl bg-base-100 shadow-2xl border-t-4 border-primary animate-in fade-in zoom-in duration-300"
  >
    <div class="card-body items-center text-center p-10 gap-6">
      <div class="badge badge-primary badge-lg p-4 text-xl font-bold">
        Кот в мешке
      </div>

      {#if step === "showTheme"}
        <h3 class="text-2xl opacity-80 mt-4">Секретная тема:</h3>
        <h2 class="text-5xl font-extrabold my-4">
          {game.activeQuestion?.secretTheme || "Без темы"}
        </h2>
        <button
          data-test-id="cat-to-bet-button"
          class="btn btn-primary btn-lg mt-4 w-full"
          onclick={() => (step = "bet")}
        >
          Перейти к ставке
        </button>
      {:else if step === "bet"}
        <h3 class="text-2xl mt-4">
          <span class="font-bold">{chosenPlayer?.name}</span> делает ставку:
        </h3>
        <div class="flex gap-4 w-full justify-center mt-6">
          {#each availableBets as bet}
            <button
              data-test-id="cat-bet-{bet}"
              class="btn btn-primary btn-lg flex-1 text-2xl"
              onclick={() => placeBet(bet)}
            >
              {bet}
            </button>
          {/each}
        </div>
      {/if}

      {#if devMode.enabled}
        <DevModeButtons />
      {/if}
    </div>
  </div>
{/if}

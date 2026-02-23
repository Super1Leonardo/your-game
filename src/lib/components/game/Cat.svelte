<script lang="ts">
  import type { Player } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import DevModeButtons from "./DevModeButtons.svelte";
  import PlayerCombobox from "./PlayerDropdown.svelte";
  import GameDialog from "./GameDialog.svelte";
  import { fly } from "svelte/transition";

  let { onSetupComplete }: { onSetupComplete: () => void } = $props();

  let step = $state<"selectPlayer" | "showTheme" | "bet">("selectPlayer");
  let tempSelectedPlayer: Player | null = $state(null);
  let chosenPlayer: Player | null = $state(null);

  let themeHeight = $state(0);
  let betHeight = $state(0);

  let currentContentHeight = $derived(
    step === "showTheme" ? themeHeight : betHeight || themeHeight,
  );

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

    <DevModeButtons />
  </GameDialog>
{/if}

{#if step === "showTheme" || step === "bet"}
  <div
    transition:fly={{ y: 30, duration: 400, delay: 50 }}
    class="card w-full max-w-2xl bg-base-100 shadow-2xl border-t-4 border-primary animate-in fade-in transition-all zoom-in duration-300"
  >
    <div
      class="card-body items-center text-center p-10 gap-6 overflow-x-hidden duration-300 ease-in transition-all"
    >
      <div class="badge badge-primary badge-lg p-4 text-xl font-bold">
        Кот в мешке
      </div>

      <div
        class="grid w-full items-start transition-[height] duration-300 ease-in-out"
        style={currentContentHeight ? `height: ${currentContentHeight}px` : ""}
      >
        {#if step === "showTheme"}
          <div
            bind:clientHeight={themeHeight}
            in:fly={{ x: 50, duration: 300, delay: 300 }}
            out:fly={{ x: -50, duration: 300 }}
            class="col-start-1 row-start-1 flex flex-col items-center w-full"
          >
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
          </div>
        {:else if step === "bet"}
          <div
            bind:clientHeight={betHeight}
            in:fly={{ x: 50, duration: 300, delay: 300 }}
            out:fly={{ x: -50, duration: 300 }}
            class="col-start-1 row-start-1 flex flex-col items-center w-full"
          >
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
          </div>
        {/if}
      </div>

      <DevModeButtons />
    </div>
  </div>
{/if}

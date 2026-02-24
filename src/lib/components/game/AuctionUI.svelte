<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
  import DevModeButtons from "./DevModeButtons.svelte";
  import GameDialog from "./GameDialog.svelte";
  import type { Player } from "$lib/types";
  import { fly } from "svelte/transition";

  let {
    highestBetterId,
    currentBet,
    isAllInMode,
    highestBetterName,
    activePlayer,
    activePlayerScore,
    betInput = $bindable(),
    placeBet,
    fold,
  }: {
    highestBetterId: string | null;
    currentBet: number;
    isAllInMode: boolean;
    highestBetterName: string;
    activePlayer: Player | undefined;
    activePlayerScore: number;
    betInput: number | "";
    placeBet: (amount: number, isExplicitAllIn: boolean) => void;
    fold: () => void;
  } = $props();
</script>

<GameDialog
  contentClass="max-w-lg flex flex-col items-center text-center gap-6"
>
  <h2 class="text-4xl font-extrabold">Аукцион!</h2>
  <div class="flex flex-col gap-2 bg-base-200 p-4 rounded-xl w-full">
    <div class="grid place-items-center">
      {#if !highestBetterId}
        <p
          out:fly={{ x: 50, duration: 300 }}
          class="col-start-1 row-start-1 text-lg"
        >
          Номинал: <strong data-test-id="min-bet" class="text-secondary"
            >{game.activeQuestion?.price}</strong
          >
        </p>
      {:else}
        <p
          in:fly={{ x: -50, duration: 300 }}
          class="col-start-1 row-start-1 text-xl"
        >
          Ставка: <strong>{currentBet}</strong> ({highestBetterName})
        </p>
      {/if}
    </div>
    {#if isAllInMode}
      <div
        data-test-id="allin-badge"
        class="badge badge-error badge-lg mx-auto font-bold animate-pulse mt-2"
      >
        Режим Ва-банк!
      </div>
    {/if}
  </div>

  <div class="divider font-bold opacity-50 text-sm uppercase tracking-wide">
    Ход игрока
  </div>

  <h3
    data-test-id="auction-active-player"
    class="text-3xl font-bold text-secondary"
  >
    {activePlayer?.name}
  </h3>
  <p class="text-xl">На счете: <strong>{activePlayerScore}</strong></p>

  <div class="flex gap-4 h-12 w-full justify-center mt-2">
    <input
      data-test-id="auction-input"
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
      data-test-id="auction-confirm-btn"
      class="btn btn-primary h-full text-lg"
      onclick={() => typeof betInput === "number" && placeBet(betInput, false)}
    >
      Поставить
    </button>
  </div>

  <div class="flex gap-4 w-full mt-4">
    <button
      data-test-id="auction-skip-btn"
      class="btn btn-outline btn-error flex-1 text-lg"
      onclick={fold}
    >
      Пас
    </button>
    <button
      data-test-id="allin-btn"
      class="btn btn-success btn-outline flex-1 text-lg"
      onclick={() => placeBet(activePlayerScore, true)}
    >
      Ва-банк!
    </button>
  </div>

  <DevModeButtons />
</GameDialog>

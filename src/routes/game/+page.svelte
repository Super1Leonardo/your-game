<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
  import PlayerPanel from "$lib/components/game/PlayerPanel.svelte";
  import Board from "$lib/components/game/Board.svelte";
  import Header from "$lib/components/game/Header.svelte";
  import { goto } from "$app/navigation";

  let themes = $derived.by(() => {
    if (game.phase === "round1") {
      return game.round1Themes;
    } else if (game.phase === "round2") {
      return game.round2Themes;
    }
    return [];
  });
  let isRoundFinished = $derived.by(() => {
    if (themes.length === 0) return false;
    return themes.every((theme) =>
      theme.questions.every((q) => q.isPlayed === true),
    );
  });
  function handleNextRound() {
    if (game.phase === "round1") {
      game.phase = "round2";
      const lowestPlayer = [...game.players].sort(
        // игрок с мин счетом; что бы не мутировать оригинал
        (a, b) => a.score - b.score,
      )[0];
      game.currentPlayerId = lowestPlayer.id;
    } else if (game.phase === "round2") {
      game.phase = "final";
      goto("/final");
    }
  }
</script>

<div
  class="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4 gap-7"
>
  <Header />

  <PlayerPanel />

  {#if isRoundFinished}
    <div class="grow flex flex-col items-center justify-center gap-6">
      <h2 data-test-id="round-complete" class="text-4xl font-bold">
        Раунд завершен!
      </h2>
      <button class="btn btn-primary btn-lg text-xl" onclick={handleNextRound}>
        {game.phase === "round1" ? "Перейти ко 2 раунду" : "Перейти к финалу"}
      </button>
    </div>
  {:else}
    <div class="grow w-full max-w-6xl flex flex-col justify-center">
      <Board {themes} />
    </div>
  {/if}
</div>

<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
  import Switch from "$lib/components/ui/Switch.svelte";
  import PlayerPanel from "$lib/components/game/PlayerPanel.svelte";
  import Board from "$lib/components/game/Board.svelte";

  let themes = $derived.by(() => {
    if (game.phase === "round1") {
      return game.round1Themes;
    } else if (game.phase === "round2") {
      return game.round2Themes;
    }
    return [];
  });
  let roundTitle = $derived.by(() => {
    if (game.phase === "round1") {
      return "Раунд 1";
    } else if (game.phase === "round2") {
      return "Раунд 2";
    }
    return "";
  });
  let isRoundFinished = $derived.by(() => {
    if (themes.length === 0) return false;
    return themes.every((theme) =>
      theme.questions.every((q) => q.isPlayed === true)
    );
  });
  function handleNextRound() {
    if (game.phase === "round1") {
      game.phase = "round2";
      const lowestPlayer = [...game.players].sort(
        // игрок с мин счетом; что бы не мутировать оригинал
        (a, b) => a.score - b.score
      )[0];
      game.currentPlayerId = lowestPlayer.id;
    } else if (game.phase === "round2") {
      game.phase = "final";
    }
  }
</script>

<div
  class="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4 gap-7"
>
  <header class="flex w-full max-w-6xl justify-between items-center">
    <h1 class="font-extrabold text-5xl drop-shadow-sm">
      {roundTitle}
    </h1>
    <Switch
      testid="dev-mode-switch"
      label="Режим разработчика"
      checked={game.devMode}
      onChange={(v: boolean) => (game.devMode = v)}
    />
  </header>

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

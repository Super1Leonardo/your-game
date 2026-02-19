<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import { onMount } from "svelte";
  import Header from "$lib/components/game/Header.svelte";
  import FinalBets from "$lib/components/game/FinalBets.svelte";
  import FinalQuestion from "$lib/components/game/FinalQuestion.svelte";
  import FinalReveal from "$lib/components/game/FinalReveal.svelte";

  let finalPlayers = $derived(game.players.filter((p) => p.score > 0));

  // Step вычисляется автоматически на основе данных в сторе (защита от F5)
  let step = $derived.by(() => {
    if (!game.finalState) return "betting";
    if (Object.keys(game.finalState.bets).length < finalPlayers.length)
      return "betting";
    if (game.finalState.completedPlayerIds.length < finalPlayers.length)
      return "answering";
    return "reveal";
  });

  onMount(() => {
    if (finalPlayers.length === 0) {
      game.phase = "results";
      goto("/results");
      return;
    }
    if (!game.finalState) {
      game.finalState = {
        bets: {},
        answers: {},
        completedPlayerIds: [],
      };
    }
  });
</script>

<div
  class="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4 gap-7"
>
  <Header />
  <div class="grow w-full max-w-4xl flex flex-col justify-center items-center">
    {#if step === "betting"}
      <FinalBets {finalPlayers} />
    {:else if step === "answering"}
      <FinalQuestion {finalPlayers} />
    {:else if step === "reveal"}
      <FinalReveal {finalPlayers} />
    {/if}
  </div>
</div>

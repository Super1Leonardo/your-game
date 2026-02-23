<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import { onMount } from "svelte";
  import Header from "$lib/components/game/Header.svelte";
  import FinalBets from "$lib/components/game/FinalBets.svelte";
  import FinalQuestion from "$lib/components/game/FinalQuestion.svelte";
  import FinalReveal from "$lib/components/game/FinalReveal.svelte";
  import { fade, fly } from "svelte/transition"; // <-- Добавляем импорт анимаций

  let finalPlayers = $derived(game.players.filter((p) => p.score > 0));

  let step = $derived.by(() => {
    // вычисляется автоматически на основе данных в сторе (защита от F5)
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
  class="min-h-screen bg-base-200 flex flex-col transition-colors duration-150 items-center py-8 px-4 gap-7 overflow-x-hidden"
>
  <Header />

  <div class="grow w-full max-w-4xl grid place-items-center">
    {#if step === "betting"}
      <div
        class="col-start-1 row-start-1 w-full"
        in:fly={{ x: 50, duration: 400, delay: 400 }}
        out:fly={{ x: -50, duration: 400 }}
      >
        <FinalBets {finalPlayers} />
      </div>
    {:else if step === "answering"}
      <div
        class="col-start-1 row-start-1 w-full"
        in:fly={{ x: 50, duration: 400, delay: 400 }}
        out:fly={{ x: -50, duration: 400 }}
      >
        <FinalQuestion {finalPlayers} />
      </div>
    {:else if step === "reveal"}
      <div
        class="col-start-1 row-start-1 w-full"
        in:fly={{ y: 50, duration: 400, delay: 400 }}
        out:fade={{ duration: 300 }}
      >
        <FinalReveal {finalPlayers} />
      </div>
    {/if}
  </div>
</div>

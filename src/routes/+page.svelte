<script lang="ts">
  import { goto } from "$app/navigation";
  import { game, resetGame, loadGame } from "$lib/state/gameStore.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    loadGame();
  });

  // Игра считается активной, если мы ушли с этапа настройки
  let hasActiveGame = $derived(game.phase !== "setup");

  function startNewGame() {
    resetGame(); // Очищаем старый стейт
    goto("/setup");
  }

  function continueGame() {
    if (game.phase === "results") {
      goto("/results");
    } else if (game.phase === "final") {
      goto("/final");
    } else {
      goto("/game");
    }
  }
</script>

<div class="hero min-h-screen">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-6xl font-extrabold mb-6 drop-shadow-md">Твоя Игра</h1>

      <p class="py-6 text-lg text-base-content/80">
        Интеллектуальная браузерная викторина для троих игроков. Проверьте свои
        знания и скорость реакции!
      </p>

      <div class="flex flex-col gap-4 mt-2">
        <button
          class="btn btn-primary btn-lg w-full text-xl"
          onclick={startNewGame}
        >
          Новая игра
        </button>

        {#if hasActiveGame}
          <button
            class="btn btn-secondary btn-lg w-full text-xl"
            onclick={continueGame}
          >
            Продолжить игру
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>

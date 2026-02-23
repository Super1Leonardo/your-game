<script lang="ts">
  import { goto } from "$app/navigation";
  import ThemeSwitcher from "$lib/components/ui/ThemeSwitcher.svelte";
  import { game, resetGame, loadGame } from "$lib/state/gameStore.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    loadGame();
  });

  let hasActiveGame = $derived(game.phase !== "setup"); // игра считается активной если мы ушли с этапа настройки

  function startNewGame() {
    resetGame();
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

<div class="hero bg-base-200 min-h-screen">
  <div class="absolute top-1 z-50 mt-8">
    <ThemeSwitcher />
  </div>
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-6xl text-secondary font-extrabold mb-6">Твоя Игра</h1>

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
            class="btn btn-secondary text-secondary-content btn-lg w-full text-xl"
            onclick={continueGame}
          >
            Продолжить игру
          </button>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  @reference "./layout.css";
  div {
    @apply transition-colors duration-300 ease-in-out;
  }
</style>

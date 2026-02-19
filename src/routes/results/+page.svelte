<script lang="ts">
  import { goto } from "$app/navigation";
  import { game, resetGame } from "$lib/state/gameStore.svelte";
  import Header from "$lib/components/game/Header.svelte";
  import { onMount } from "svelte";

  // Сортируем игроков по убыванию очков (копируем массив, чтобы не мутировать стор)
  let sortedPlayers = $derived(
    [...game.players].sort((a, b) => b.score - a.score)
  );

  // Победитель — первый в отсортированном списке
  let winner = $derived(sortedPlayers[0]);

  onMount(() => {
    // Защита: если перешли на страницу без игроков, выкидываем на главную
    if (game.players.length === 0) {
      goto("/");
    }
  });

  function startNewGame() {
    resetGame(); // Сбрасываем глобальный стор
    goto("/setup"); // Редиректим на окно настройки имен, как ты и просил
  }
</script>

<div
  class="min-h-screen bg-base-200 flex flex-col items-center py-8 px-4 gap-7"
>
  <Header />

  <div
    class="grow w-full max-w-4xl flex flex-col justify-center items-center gap-8"
  >
    <h2 class="text-6xl font-extrabold text-secondary drop-shadow-md">
      Итоги игры
    </h2>

    {#if winner}
      <div
        class="card bg-base-100 shadow-2xl border-t-4 border-warning w-full max-w-2xl animate-in fade-in zoom-in duration-500"
      >
        <div class="card-body items-center text-center p-10 gap-4">
          <div class="text-warning text-7xl mb-2 drop-shadow-lg">👑</div>
          <h3 class="text-2xl opacity-80 uppercase tracking-widest font-bold">
            Победитель
          </h3>
          <h1 class="text-6xl font-extrabold text-base-content">
            {winner.name}
          </h1>
          <div
            class="badge badge-warning badge-lg p-6 text-3xl mt-4 font-bold shadow-sm"
          >
            {winner.score} баллов
          </div>
        </div>
      </div>
    {/if}

    <div class="w-full max-w-2xl flex flex-col gap-4">
      {#each sortedPlayers.slice(1) as player, i}
        <div
          class="flex items-center justify-between p-6 bg-base-100 rounded-box shadow-md border-2 border-base-content/5 transition-all hover:scale-[1.02]"
        >
          <div class="flex items-center gap-4">
            <span class="text-2xl font-bold opacity-50">#{i + 2}</span>
            <span class="text-3xl font-bold">{player.name}</span>
          </div>
          <span
            class="text-2xl font-mono bg-base-200 px-4 py-2 rounded-lg font-bold text-base-content/80"
          >
            {player.score}
          </span>
        </div>
      {/each}
    </div>

    <button
      class="btn btn-primary btn-lg text-xl px-12 shadow-lg hover:shadow-primary/30"
      onclick={startNewGame}
    >
      Новая игра
    </button>
  </div>
</div>

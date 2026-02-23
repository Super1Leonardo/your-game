<script lang="ts">
  import { goto } from "$app/navigation";
  import { game, resetGame } from "$lib/state/gameStore.svelte";
  import Header from "$lib/components/game/Header.svelte";
  import { onMount } from "svelte";

  let sortedPlayers = $derived(
    [...game.players].sort((a, b) => b.score - a.score),
  );

  // Вычисляем максимальный счет
  let maxScore = $derived(sortedPlayers[0]?.score ?? 0);

  // По правилам игры, победить может только игрок с положительным балансом
  let hasWinners = $derived(maxScore > 0);

  // Если есть победители, собираем всех с максимальным счетом (ничья)
  let winners = $derived(
    hasWinners ? sortedPlayers.filter((p) => p.score === maxScore) : [],
  );

  // Остальные игроки (или все, если победителей нет)
  let losers = $derived(
    hasWinners
      ? sortedPlayers.filter((p) => p.score !== maxScore)
      : sortedPlayers,
  );

  onMount(() => {
    if (game.players.length === 0) {
      goto("/");
    }
  });

  function startNewGame() {
    resetGame();
    goto("/setup");
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

    {#if hasWinners}
      <div
        class="card bg-base-100 shadow-2xl border-t-4 border-warning w-full max-w-3xl animate-in fade-in zoom-in duration-500"
      >
        <div class="card-body items-center text-center p-10 gap-4">
          <div class="text-warning text-7xl mb-2 drop-shadow-lg">👑</div>
          <h3 class="text-2xl opacity-80 uppercase tracking-widest font-bold">
            {winners.length > 1 ? "Победители" : "Победитель"}
          </h3>

          <div class="flex flex-wrap justify-center gap-8 mt-4">
            {#each winners as winner}
              <div class="flex flex-col items-center gap-3">
                <div class="avatar {winner.avatar ? '' : 'placeholder'}">
                  <div
                    class="w-24 h-24 rounded-full bg-neutral text-neutral-content flex justify-center items-center ring-4 ring-warning ring-offset-base-100 ring-offset-4"
                  >
                    {#if winner.avatar}
                      <img
                        src={winner.avatar}
                        alt="Аватар {winner.name}"
                        class="object-cover"
                      />
                    {:else}
                      <span class="text-4xl font-bold"
                        >{winner.name.charAt(0).toUpperCase()}</span
                      >
                    {/if}
                  </div>
                </div>
                <h1 class="text-4xl font-extrabold text-base-content">
                  {winner.name}
                </h1>
              </div>
            {/each}
          </div>

          <div
            class="badge badge-warning badge-lg p-6 text-3xl mt-6 font-bold shadow-sm"
          >
            {maxScore} баллов
          </div>
        </div>
      </div>
    {:else}
      <div
        class="card bg-base-100 shadow-2xl border-t-4 border-error w-full max-w-2xl animate-in fade-in duration-500"
      >
        <div class="card-body items-center text-center p-10 gap-4">
          <div class="text-error text-7xl mb-2 drop-shadow-lg">💀</div>
          <h3 class="text-2xl opacity-80 uppercase tracking-widest font-bold">
            Игра окончена
          </h3>
          <h1 class="text-4xl font-extrabold text-base-content">
            Никто не дошел до финала
          </h1>
          <p class="text-base-content/60 mt-2">
            Все игроки ушли в минус или остались с нулем.
          </p>
        </div>
      </div>
    {/if}

    <div class="w-full max-w-2xl flex flex-col gap-4">
      {#each losers as player, i}
        <div
          class="flex items-center justify-between p-6 bg-base-100 rounded-box shadow-md border-2 border-base-content/5 transition-all hover:scale-[1.02]"
        >
          <div class="flex items-center gap-4">
            <span class="text-2xl font-bold opacity-50">
              #{hasWinners ? winners.length + i + 1 : i + 1}
            </span>

            <div class="avatar {player.avatar ? '' : 'placeholder'}">
              <div
                class="w-12 h-12 rounded-full bg-neutral text-neutral-content flex justify-center items-center ring ring-base-300 ring-offset-base-100 ring-offset-2"
              >
                {#if player.avatar}
                  <img
                    src={player.avatar}
                    alt="Аватар {player.name}"
                    class="object-cover"
                  />
                {:else}
                  <span class="text-xl font-bold"
                    >{player.name.charAt(0).toUpperCase()}</span
                  >
                {/if}
              </div>
            </div>

            <span class="text-3xl font-bold">{player.name}</span>
          </div>
          <span
            class="text-2xl font-mono bg-base-200 px-4 py-2 rounded-lg font-bold {player.score <
            0
              ? 'text-error'
              : 'text-base-content/80'}"
          >
            {player.score}
          </span>
        </div>
      {/each}
    </div>

    <button
      class="btn btn-primary btn-lg text-xl px-12 shadow-lg hover:shadow-primary/30 mt-4"
      onclick={startNewGame}
    >
      Новая игра
    </button>
  </div>
</div>

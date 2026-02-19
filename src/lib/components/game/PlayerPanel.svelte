<script lang="ts">
  import { devMode } from "$lib/state/devStore.svelte";
  import { game } from "$lib/state/gameStore.svelte";
</script>

<div class="flex w-full max-w-6xl justify-center gap-6">
  {#each game.players as player}
    {@const isCurrent = game.currentPlayerId === player.id}
    <div
      data-test-id={isCurrent ? "active-player" : ""}
      class="card w-72 bg-base-100 shadow-xl border-4 transition-all duration-300
        {isCurrent
        ? 'border-primary scale-105 shadow-primary/50'
        : 'border-transparent'}"
    >
      <div class="card-body items-center text-center p-4">
        <h2 class="card-title text-2xl">
          {player.name}
        </h2>
        <h3 data-test-id="player-score" class="text-5xl mb-2 font-bold">
          {player.score}
        </h3>
        <div class="badge badge-outline badge-lg font-mono">
          Кнопка: {player.key === " " ? "Пробел" : player.key.toUpperCase()}
        </div>

        {#if devMode.enabled}
          <div class="flex mt-2">
            <button
              class="btn btn-sm btn-soft btn-error text-sm rounded-r-none"
              onclick={() => (player.score -= 100)}>Убрать 100</button
            >
            <button
              class="btn flex btn-sm btn-soft btn-success text-sm rounded-l-none"
              onclick={() => (player.score += 100)}>Добавить 100</button
            >
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>

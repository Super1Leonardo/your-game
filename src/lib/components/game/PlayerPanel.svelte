<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
</script>

<div class="flex w-full max-w-6xl justify-center gap-6">
  {#each game.players as player}
    {@const isCurrent = game.currentPlayerId === player.id}
    <div
      class="card w-72 bg-base-100 shadow-xl border-4 transition-all duration-300
             {isCurrent
        ? 'border-primary scale-105 shadow-primary/50'
        : 'border-transparent'}"
    >
      <div class="card-body items-center text-center p-6">
        <h2 class="card-title text-2xl">
          {player.name}
        </h2>
        <div class="text-5xl font-bold my-4">{player.score}</div>
        <div class="badge badge-outline badge-lg mt-2 font-mono">
          Кнопка: {player.key === " " ? "Пробел" : player.key.toUpperCase()}
        </div>

        {#if game.devMode}
          <div class="flex gap-2 mt-4">
            <button
              class="btn btn-sm btn-error"
              onclick={() => (player.score -= 100)}>-100</button
            >
            <button
              class="btn btn-sm btn-success"
              onclick={() => (player.score += 100)}>+100</button
            >
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>

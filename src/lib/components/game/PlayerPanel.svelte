<script lang="ts">
  import { devMode } from "$lib/state/devStore.svelte";
  import { game } from "$lib/state/gameStore.svelte";
</script>

<div class="flex w-full justify-center gap-6">
  {#each game.players as player}
    {@const isCurrent = game.currentPlayerId === player.id}
    <div
      data-test-id={isCurrent ? "active-player" : ""}
      class="card w-72 bg-base-100 shadow-xl border-4 transition-all duration-300
        {isCurrent
        ? 'border-primary scale-105 shadow-primary/50'
        : 'border-transparent'}"
    >
      <div class="card-body items-center text-center p-2">
        <div class="avatar {player.avatar ? '' : 'placeholder'}">
          <div
            class="w-16 h-16 rounded-full bg-neutral text-neutral-content flex justify-center items-center"
          >
            {#if player.avatar}
              <img
                src={player.avatar}
                alt="Аватар {player.name}"
                class="object-cover"
              />
            {:else}
              <span class="text-2xl font-bold"
                >{player.name.charAt(0).toUpperCase()}</span
              >
            {/if}
          </div>
        </div>
        <h2 class="card-title -mt-2 text-2xl">
          {player.name}
        </h2>
        <h3 data-test-id="player-score" class="text-5xl mb-2 font-bold">
          {player.score}
        </h3>
        <div class="badge badge-outline badge-lg font-mono">
          Кнопка: {player.key === " " ? "Пробел" : player.key.toUpperCase()}
        </div>

        <div
          class="grid transition-all duration-300 ease-in-out w-full"
          style="grid-template-rows: {devMode.enabled
            ? '1fr'
            : '0fr'}; opacity: {devMode.enabled ? '1' : '0'};"
        >
          <div class="overflow-hidden flex justify-center">
            <div class="flex pt-2">
              <button
                class="btn btn-sm btn-soft btn-error text-sm rounded-r-none"
                disabled={!devMode.enabled}
                onclick={() => (player.score -= 100)}>Убрать 100</button
              >
              <button
                class="btn flex btn-sm btn-soft btn-success text-sm rounded-l-none"
                disabled={!devMode.enabled}
                onclick={() => (player.score += 100)}>Добавить 100</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>

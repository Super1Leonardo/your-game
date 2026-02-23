<script lang="ts">
  import { Combobox } from "melt/builders";
  import type { Player } from "$lib/types";
  import { fade } from "svelte/transition";

  let {
    players,
    selectedPlayer = $bindable(null),
  }: {
    players: Player[];
    selectedPlayer: Player | null;
  } = $props();

  const combobox = new Combobox<Player>({
    forceVisible: true,
  });

  // синхронизация  с selectedPlayer
  $effect(() => {
    selectedPlayer = combobox.value ?? null;
  });

  // синхронизация текста инпута при закрытии меню
  $effect(() => {
    if (!combobox.open) {
      combobox.inputValue = combobox.value?.name ?? "";
    }
  });

  // фильтрация игроков на основе введенного текста
  const filteredPlayers = $derived.by(() => {
    if (!combobox.touched) return players;
    const normalizedInput = combobox.inputValue.trim().toLowerCase();
    return players.filter((p) =>
      p.name.toLowerCase().includes(normalizedInput),
    );
  });
</script>

<div class="relative w-full">
  <input
    {...combobox.input}
    id="cat-input"
    class="input input-bordered border-2 input-primary w-full"
    placeholder="Начните вводить имя..."
  />

  {#if combobox.open}
    <ul
      transition:fade={{ duration: 150 }}
      {...combobox.content}
      class="absolute z-50 mt-1 max-h-50 w-full flex-col overflow-y-auto rounded-box bg-base-200 p-2 shadow-xl border border-base-content/10"
    >
      {#each filteredPlayers as player (player.id)}
        <li
          {...combobox.getOption(player)}
          class="cursor-pointer flex items-center justify-between rounded-md px-4 py-3 hover:bg-primary hover:text-primary-content transition-colors data-highlighted:bg-primary data-highlighted:text-primary-content"
        >
          {player.name}
          {#if combobox.isSelected(player)}
            <span class="font-bold">✓</span>
          {/if}
        </li>
      {:else}
        <li class="px-4 py-2 opacity-50">Нет совпадений</li>
      {/each}
    </ul>
  {/if}
</div>

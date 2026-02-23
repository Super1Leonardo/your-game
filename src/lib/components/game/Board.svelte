<script lang="ts">
  import type { Theme } from "$lib/types";
  import BoardCell from "./BoardCell.svelte";

  let { themes }: { themes: Theme[] } = $props();

  // Состояние: какая ячейка сейчас анимируется (выбрана)
  let selectedId = $state<string | null>(null);
</script>

<div
  class="w-full rounded-box p-4 shadow-inner flex flex-col gap-2 border-primary border-2 transition-all duration-500 {selectedId
    ? 'bg-base-300/50'
    : ''}"
>
  {#each themes as theme}
    <div class="flex gap-2 h-20">
      <div
        class="flex-[1.5] rounded-box bg-primary/10 text-secondary rounded-btn flex items-center justify-center text-center px-4 font-bold text-lg shadow-md leading-tight transition-opacity duration-500 {selectedId
          ? 'opacity-20'
          : 'opacity-100'}"
      >
        {theme.name}
      </div>

      <div class="flex-4 flex gap-2">
        {#each theme.questions as question}
          <div class="flex-1 flex relative">
            <BoardCell
              {question}
              {selectedId}
              onSelect={(id) => (selectedId = id)}
            />
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

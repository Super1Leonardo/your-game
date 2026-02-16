<script lang="ts">
  import type { Theme } from "$lib/types";
  import BoardCell from "./BoardCell.svelte";

  let { themes }: { themes: Theme[] } = $props();
</script>

<div
  class="w-full bg-base-300 rounded-box p-4 shadow-inner flex flex-col gap-2 border border-base-content/10"
>
  {#each themes as theme}
    <div class="flex gap-2 h-20">
      <div
        class="flex-[1.5] bg-neutral text-neutral-content rounded-btn flex items-center justify-center text-center px-4 font-bold text-lg shadow-md leading-tight"
      >
        {theme.name}
      </div>

      <div class="flex-4 flex gap-2">
        {#each theme.questions as question}
          <div class="flex-1 flex relative">
            <BoardCell {question} />
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

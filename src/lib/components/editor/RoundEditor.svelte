<script lang="ts">
  import type { RawTheme } from "$lib/types";
  import QuestionCard from "./QuestionCard.svelte";

  let { themes = $bindable() }: { themes: RawTheme[] } = $props();
</script>

<div class="flex flex-col gap-6 pb-10">
  {#each themes as themeObj, i}
    <div
      class="collapse collapse-arrow bg-base-100 border border-base-300 shadow-sm"
    >
      <input type="checkbox" checked={true} />
      <div class="collapse-title p-4 flex items-center gap-4 bg-base-200/30">
        <span class="font-mono w-16 text-secondary opacity-50"
          >Тема {i + 1}</span
        >
        <input
          type="text"
          class="input input-ghost input-sm w-full font-bold text-lg focus:bg-base-100"
          bind:value={themeObj.theme}
          placeholder="Название темы"
          onclick={(e) => e.stopPropagation()}
        />
      </div>

      <div class="collapse-content pt-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {#each themeObj.questions as _, qIndex}
            <QuestionCard
              bind:question={themeObj.questions[qIndex]}
              index={qIndex}
            />
          {/each}
        </div>
      </div>
    </div>
  {/each}
</div>

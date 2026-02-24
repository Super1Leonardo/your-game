<script lang="ts">
  import type { RawSpecialQuestion } from "$lib/types";
  import SpecialQuestionCard from "./SpecialQuestionCard.svelte";

  let {
    cats = $bindable(),
    final = $bindable(),
  }: {
    cats: RawSpecialQuestion[];
    final: RawSpecialQuestion;
  } = $props();
</script>

<div class="flex flex-col gap-8 pb-10">
  <div class="rounded-box bg-base-100 border border-base-300 p-4 shadow-sm">
    <div class="flex items-center gap-2 mb-4">
      <h2 class="text-xl font-bold flex text-secondary">Коты в мешке</h2>
      <div class="badge badge-outline">4 штуки</div>
      <span class="text-xs opacity-50 ml-2 hidden sm:inline"
        >Выпадают случайно вместо обычных вопросов</span
      >
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each cats as _, i}
        <SpecialQuestionCard bind:question={cats[i]} index={i} />
      {/each}
    </div>
  </div>

  <div
    class="rounded-box bg-base-100 border border-warning/50 p-4 shadow-sm relative overflow-hidden"
  >
    <div
      class="absolute -right-6 -top-6 text-warning/5 text-9xl font-black select-none pointer-events-none rotate-12"
    >
      FINAL
    </div>

    <div class="flex items-center gap-2 mb-4 relative z-10">
      <h2 class="text-xl font-bold text-warning">Финальный вопрос</h2>
      <span class="text-xs opacity-50 ml-2 hidden sm:inline"
        >Разыгрывается в конце игры</span
      >
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
      <SpecialQuestionCard bind:question={final} isFinal={true} />

      <div
        class="hidden lg:flex items-center justify-center p-4 text-base-content text-sm border-2 border-dashed border-base-300 rounded-box"
      >
        <p class="text-center max-w-xs">
          Финальный вопрос всегда один. Игроки делают ставки, затем отвечают
        </p>
      </div>
    </div>
  </div>
</div>

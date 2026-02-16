<script lang="ts">
  import type { Question } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import { goto } from "$app/navigation";

  let { question }: { question: Question } = $props();

  let isSpecial = $derived(
    question.type === "cat" || question.type === "auction"
  );

  function handleSelect() {
    if (question.isPlayed) return;

    game.activeQuestion = question; // сохраняем вопрос в стор

    goto("/question");
  }
</script>

<button
  class="w-full h-full btn text-4xl font-extrabold transition-all duration-200 flex items-center justify-center relative
         {question.isPlayed
    ? 'bg-transparent text-transparent cursor-default'
    : 'bg-secondary text-secondary-content shadow-md hover:scale-[1.03] active:scale-95 cursor-pointer'}
         {!question.isPlayed && game.devMode && isSpecial
    ? question.type === 'cat'
      ? 'ring-4 ring-warning ring-inset'
      : 'ring-4 ring-info ring-inset'
    : ''}
  "
  disabled={question.isPlayed}
  onclick={handleSelect}
>
  {question.price}

  {#if game.devMode && !question.isPlayed && isSpecial}
    <div
      class="text-[10px] font-normal uppercase opacity-80 absolute top-1 right-2"
    >
      {question.type}
    </div>
  {/if}
</button>

<script lang="ts">
  import type { Question } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import { goto } from "$app/navigation";

  let { question }: { question: Question } = $props();

  let isSpecial = $derived(
    question.type === "cat" || question.type === "auction"
  );

  const specialTranslated: Record<string, string> = {
    cat: "Кот в мешке",
    auction: "Аукцион",
  };

  function handleSelect() {
    if (question.isPlayed) return;

    game.activeQuestion = question; // сохраняем вопрос в стор

    goto("/question");
  }
</script>

<button
  class="w-full h-full btn text-4xl font-bold transition-all duration-200 flex items-center justify-center relative
         {question.isPlayed
    ? 'hidden'
    : 'bg-secondary text-secondary-content shadow-md hover:scale-[1.03] active:scale-95 cursor-pointer'}
         {!question.isPlayed && game.devMode && isSpecial
    ? question.type === 'cat'
      ? 'ring-4 ring-warning ring-inset'
      : 'ring-4 ring-primary ring-inset'
    : ''}
  "
  disabled={question.isPlayed}
  onclick={handleSelect}
>
  {question.price}

  {#if game.devMode && !question.isPlayed && isSpecial}
    <div class="text-sm font-bold uppercase opacity-80 absolute top-1">
      {specialTranslated[question.type]}
    </div>
  {/if}
</button>

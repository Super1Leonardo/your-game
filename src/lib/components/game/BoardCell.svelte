<script lang="ts">
  import type { Question } from "$lib/types";
  import { game } from "$lib/state/gameStore.svelte";
  import { goto } from "$app/navigation";
  import { devMode } from "$lib/state/devStore.svelte";
  import { fade } from "svelte/transition";

  let {
    question,
    selectedId,
    onSelect,
  }: {
    question: Question;
    selectedId: string | null;
    onSelect: (id: string) => void;
  } = $props();

  let isSpecial = $derived(
    question.type === "cat" || question.type === "auction",
  );

  const specialTranslated: Record<string, string> = {
    cat: "Кот в мешке",
    auction: "Аукцион",
  };

  // Реактивные флаги для состояний анимации
  let isSelected = $derived(selectedId === question.id);
  let isDimmed = $derived(selectedId !== null && selectedId !== question.id);
  let canHover = $derived(!question.isPlayed && selectedId === null);

  function handleSelect() {
    if (question.isPlayed || selectedId) return;

    onSelect(question.id);

    setTimeout(() => {
      game.activeQuestion = question;
      goto("/question");
    }, 500);
  }
</script>

<button
  class="board-cell btn w-full h-full text-4xl font-bold flex items-center justify-center relative cursor-pointer origin-center
         {question.isPlayed ? 'hidden' : 'bg-base-100 text-secondary shadow-md'}
         {isSelected ? 'z-50 ring-4 ring-secondary shadow-2xl bg-base-200' : ''}
         {!question.isPlayed && devMode.enabled && isSpecial
    ? question.type === 'cat'
      ? 'ring-4 ring-warning ring-inset'
      : 'ring-4 ring-primary ring-inset'
    : ''}
  "
  class:can-hover={canHover}
  class:is-selected={isSelected}
  class:is-dimmed={isDimmed}
  disabled={question.isPlayed || selectedId !== null}
  onclick={handleSelect}
>
  {question.price}

  {#if devMode.enabled && !question.isPlayed && isSpecial}
    <div
      transition:fade={{ duration: 200 }}
      class="absolute top-1 text-sm font-bold uppercase opacity-80"
    >
      {specialTranslated[question.type]}
    </div>
  {/if}
</button>

<!-- анимации -->
<style>
  .board-cell {
    will-change: transform, opacity;
    transition:
      transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1),
      opacity 400ms ease,
      box-shadow 400ms ease;
  }

  .can-hover:hover {
    transform: scale(1.05);
  }

  .can-hover:active {
    transform: scale(0.95);
  }

  .is-selected {
    transform: scale(1.6);
  }

  .is-dimmed {
    transform: scale(0.9);
    opacity: 0.15;
    pointer-events: none;
  }
</style>

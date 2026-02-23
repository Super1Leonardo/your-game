<script lang="ts">
  import { Dialog } from "melt/builders";
  import type { Snippet } from "svelte";
  import { fly } from "svelte/transition";

  let {
    open = $bindable(true),
    contentClass = "",
    children,
  }: {
    open?: boolean;
    contentClass?: string;
    children: Snippet;
  } = $props();

  const dialog = new Dialog({
    closeOnEscape: false,
    closeOnOutsideClick: false,
  });

  // принудительно задаем начальное состояние до отрисовки
  dialog.open = open;

  // реактивная синхронизация состояния
  $effect(() => {
    dialog.open = open;
  });

  $effect(() => {
    open = dialog.open;
  });
</script>

<div
  {...dialog.overlay}
  class="fixed inset-0 z-49 bg-black/60 backdrop-blur-sm melt-overlay"
></div>

<div
  {...dialog.content}
  class="fixed left-1/2 top-1/2 z-50 w-[90vw] m-0 -translate-x-1/2 -translate-y-1/2 rounded-box bg-base-100 p-8 shadow-2xl melt-dialog {contentClass}"
  transition:fly={{ y: 30, duration: 400, delay: 50 }}
  oncancel={(e) => e.preventDefault()}
  onkeydown={(e) => {
    if (e.key === "Escape") {
      e.preventDefault();
    }
  }}
  role="dialog"
>
  {@render children()}
</div>

<style>
  .melt-dialog {
    opacity: 0;
    transform: translateY(2rem) scale(0.95); /* вниз и немного уменьшаем */
    transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1); /* ease-out */
  }

  .melt-dialog[data-open] {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .melt-overlay {
    opacity: 0;
    transition: opacity 400ms ease;
    pointer-events: none;
  }

  .melt-overlay[data-open] {
    opacity: 1;
    pointer-events: auto;
  }
</style>

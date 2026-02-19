<script lang="ts">
  import { Dialog } from "melt/builders";
  import type { Snippet } from "svelte";

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
    scale: 0.95;
    transition: ease 200ms;
  }

  .melt-dialog[data-open] {
    opacity: 1;
    scale: 1;
  }

  .melt-overlay {
    opacity: 0;
    transition: ease 200ms;
    pointer-events: none;
  }

  .melt-overlay[data-open] {
    opacity: 1;
    pointer-events: auto;
  }
</style>

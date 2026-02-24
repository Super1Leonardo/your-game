<script lang="ts">
  import { fade } from "svelte/transition";

  let {
    count = $bindable(),
    onCountChange,
  }: {
    count: number;
    onCountChange: (n: number) => void;
  } = $props();

  let isOpen = $state(false);
</script>

<section class="form-control w-full mb-4">
  <label class="label" id="player-count-label" for="player-count-btn">
    <span class="label-text text-secondary/50 mb-0.5 font-semibold"
      >Количество игроков:</span
    >
  </label>

  <div class="relative w-full">
    <button
      id="player-count-btn"
      type="button"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      class="select select-bordered w-full focus:select-primary text-lg flex items-center justify-between"
      onclick={() => (isOpen = !isOpen)}
      data-test-id="setup-player-count-select"
    >
      <span class="text-secondary"
        >{count} {count > 4 ? "игроков" : "игрока"}</span
      >
    </button>

    {#if isOpen}
      <button
        tabindex="-1"
        type="button"
        class="fixed inset-0 z-40 w-full h-full cursor-default"
        onclick={() => (isOpen = false)}
        aria-label="Закрыть меню"
      ></button>

      <ul
        role="listbox"
        transition:fade={{ duration: 150 }}
        class="absolute top-full z-50 mt-2 w-full flex-col rounded-box bg-base-200 p-2 shadow-xl border border-base-content/10"
      >
        {#each [2, 3, 4, 5, 6] as c}
          <li role="option" aria-selected={count === c}>
            <button
              type="button"
              class="w-full cursor-pointer flex items-center justify-between rounded-md
              px-4 py-3 hover:bg-primary hover:text-primary-content transition-colors"
              onclick={() => {
                count = c;
                onCountChange(c);
                isOpen = false;
              }}
            >
              <span>{c} {c > 4 ? "игроков" : "игрока"}</span>
              {#if count === c}
                <span class="font-bold">✓</span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<!-- <script lang="ts">
  import { createSwitch, melt } from "@melt-ui/svelte";

  let { checked, onChange, label = "", textclass = "", testid = "" } = $props();

  const {
    elements: { root, input },
    states: { checked: meltChecked },
  } = createSwitch({
    defaultChecked: checked,
    onCheckedChange: ({ next }) => {
      onChange(next);
      return next;
    },
  });

  $effect(() => {
    if (meltChecked !== checked) {
      meltChecked.set(checked);
    }
  });
</script>

<form>
  <div class="flex items-center">
    <label
      class="pr-4 leading-none {textclass}"
      for="airplane-mode"
      id="airplane-mode-label"
    >
      {label}
    </label>
    <button
      type="button"
      data-test-id={testid}
      use:melt={$root}
      class="relative h-6 cursor-default rounded-full bg-gray-600 transition-colors data-[state=checked]:bg-primary"
      id="airplane-mode"
      aria-labelledby="airplane-mode-label"
    >
      <span class="thumb block rounded-full bg-white transition"></span>
    </button>
    <input use:melt={$input} />
  </div>
</form>

<style>
  button {
    --w: 2.75rem;
    --padding: 0.125rem;
    width: var(--w);
  }

  .thumb {
    --size: 1.25rem;
    width: var(--size);
    height: var(--size);
    transform: translateX(var(--padding));
  }

  :global([data-state="checked"]) .thumb {
    transform: translateX(calc(var(--w) - var(--size) - var(--padding)));
  }
</style> -->

<script lang="ts">
  import { devMode } from "$lib/state/devStore.svelte";
</script>

<div class="flex gap-3">
  <p class="text-secondary">Режим разработчика</p>
  <input
    type="checkbox"
    class="toggle toggle-secondary"
    bind:checked={devMode.enabled}
  />
</div>

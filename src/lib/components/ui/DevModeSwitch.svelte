<script lang="ts">
  import { devMode } from "$lib/state/devStore.svelte";
</script>

<div class="flex gap-3">
  <p class="text-secondary">Режим разработчика</p>
  <input
    type="checkbox"
    data-test-id="dev-mode-switch"
    class="toggle toggle-secondary"
    bind:checked={devMode.enabled}
  />
</div>

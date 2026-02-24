<script lang="ts">
  import { devMode } from "$lib/state/devStore.svelte";
</script>

<label class="flex gap-3">
  <span class="text-secondary">Режим разработчика</span>
  <input
    type="checkbox"
    data-test-id="dev-mode-switch"
    class="toggle toggle-secondary"
    bind:checked={devMode.enabled}
  />
</label>

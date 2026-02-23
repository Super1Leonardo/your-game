<script>
  import { closeQuestion, endQuestion } from "$lib/utils/gameActions";
  import { devMode } from "$lib/state/devStore.svelte";
</script>

<div
  class="grid transition-all duration-300 ease-in-out w-full"
  style="grid-template-rows: {devMode.enabled
    ? '1fr'
    : '0fr'}; opacity: {devMode.enabled ? '1' : '0'};"
  inert={!devMode.enabled}
>
  <div class="flex justify-center w-full gap-4">
    <button
      type="button"
      tabindex="-1"
      class="btn btn-soft flex-1 btn-warning"
      onclick={() => closeQuestion("Вопрос закрыт разработчиком")}
    >
      Закрыть вопрос
    </button>
    <button
      type="button"
      tabindex="-1"
      class="btn btn-soft flex-1 btn-error"
      onclick={() => endQuestion("Вопрос пропущен разработчиком")}
    >
      Пропустить вопрос
    </button>
  </div>
</div>

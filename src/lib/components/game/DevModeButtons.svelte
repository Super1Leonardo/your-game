<script>
  import { closeQuestion, endQuestion } from "$lib/utils/gameActions";
</script>

<div class="flex justify-center w-full gap-4">
  <button
    class="btn btn-soft flex-1 btn-warning"
    onclick={() => closeQuestion("Вопрос закрыт разработчиком")}
  >
    Закрыть вопрос
  </button>
  <button
    class="btn btn-soft flex-1 btn-error"
    onclick={() => endQuestion("Вопрос пропущен разработчиком")}
  >
    Пропустить вопрос
  </button>
</div>

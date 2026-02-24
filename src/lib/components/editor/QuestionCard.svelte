<script lang="ts">
  import type { RawQuestion } from "$lib/types";

  let {
    question = $bindable(),
    index,
  }: { question: RawQuestion; index: number } = $props();
</script>

<div class="card bg-base-200 shadow-sm border border-base-content/10 compact">
  <div class="card-body p-3">
    <div class="flex justify-between items-center mb-2">
      <span class="badge badge-neutral text-xs">#{index + 1}</span>
      <input
        type="number"
        class="input input-xs w-12 text-secondary text-center font-mono"
        bind:value={question.cost}
        aria-label="Стоимость"
      />
    </div>

    <div class="form-control w-full">
      <textarea
        class="textarea textarea-bordered textarea-sm h-24 w-full leading-tight text-sm"
        bind:value={question.text}
        placeholder="Текст вопроса..."
      ></textarea>
    </div>

    <div class="form-control w-full mt-2">
      <input
        type="text"
        class="input input-bordered input-sm w-full text-sm"
        bind:value={question.answer}
        placeholder="Ответ"
      />
    </div>
  </div>
</div>

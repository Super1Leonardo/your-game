<script lang="ts">
  import type { RawSpecialQuestion } from "$lib/types";

  let {
    question = $bindable(),
    index,
    isFinal = false,
  }: {
    question: RawSpecialQuestion;
    index?: number;
    isFinal?: boolean;
  } = $props();
</script>

<article
  class="card bg-base-200 shadow-sm border border-base-content/10 compact h-full"
>
  <div class="card-body p-3 flex flex-col gap-2">
    <header class="flex justify-between items-center">
      <span
        class="badge {isFinal ? 'badge-warning' : 'badge-secondary'} text-xs"
      >
        {isFinal ? "ФИНАЛ" : `Кот #${(index ?? 0) + 1}`}
      </span>
    </header>

    <div class="form-control w-full">
      <label class="label py-0" for="theme-{index}">
        <span class="label-text-alt opacity-70">Скрытая тема</span>
      </label>
      <input
        id="theme-{index}"
        type="text"
        class="input input-bordered input-sm w-full font-bold text-base-content/80"
        bind:value={question.theme}
        placeholder="Например: Астрономия"
      />
    </div>

    <div class="form-control w-full grow">
      <label class="label py-0 mt-1" for="text-{index}">
        <span class="label-text-alt opacity-70">Текст вопроса</span>
      </label>
      <textarea
        id="text-{index}"
        class="textarea textarea-bordered textarea-sm w-full leading-tight text-sm resize-none h-24"
        bind:value={question.text}
        placeholder="Текст вопроса..."
      ></textarea>
    </div>

    <div class="form-control w-full mt-auto">
      <label class="label py-0" for="answer-{index}">
        <span class="label-text-alt opacity-70">Ответ</span>
      </label>
      <input
        id="answer-{index}"
        type="text"
        class="input input-bordered input-sm w-full text-sm"
        bind:value={question.answer}
        placeholder="Правильный ответ"
      />
    </div>
  </div>
</article>

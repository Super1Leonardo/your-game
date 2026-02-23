<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
  import gameData from "$lib/data/data.json";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { FileUpload } from "melt/builders";

  // Вычисляемые значения из глобального стора
  let currentPack = $derived(game.customPack ?? gameData);
  let isCustomPack = $derived(!!game.customPack);

  const packUpload = new FileUpload({
    accept: "application/json",
    multiple: false,
  });

  // Логика загрузки (Импорт)
  $effect(() => {
    const currentSelection = packUpload.selected;
    const file = Array.isArray(currentSelection)
      ? currentSelection[0]
      : currentSelection;

    if (file instanceof File) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);

          if (
            parsed.round1 &&
            parsed.round2 &&
            parsed.catQuestions &&
            parsed.finalQuestion
          ) {
            game.customPack = parsed; // Пишем в глобальный стор
            addToast({
              data: { title: "Пакет успешно загружен!", type: "success" },
            });
          } else {
            addToast({
              data: { title: "Ошибка: неверный формат пакета!", type: "error" },
            });
          }
        } catch (err) {
          addToast({
            data: {
              title: "Ошибка: файл поврежден или это не JSON!",
              type: "error",
            },
          });
        }
      };

      reader.readAsText(file);
    }
  });

  // Логика скачивания (Экспорт)
  function handleExport() {
    const dataStr = JSON.stringify(currentPack, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = isCustomPack ? "custom-pack.json" : "standard-pack.json";
    a.click();

    URL.revokeObjectURL(url);
  }
</script>

<div
  class="form-control w-full mb-6 p-4 bg-base-200/50 rounded-box border border-base-content/10"
>
  <p class="label pt-0">
    <span class="label-text text-secondary/50 font-semibold"
      >Пакет вопросов:</span
    >
    <span class="badge {isCustomPack ? 'badge-primary' : 'badge-ghost'}">
      {isCustomPack ? "Пользовательский" : "Стандартный"}
    </span>
  </p>

  <div class="grid grid-cols-2 gap-2 mt-2">
    <div
      class="flex-1 flex"
      {...packUpload.dropzone}
      tabindex="0"
      role="button"
    >
      <button
        class="btn btn-outline btn-secondary flex-1 {packUpload.isDragging
          ? 'btn-active scale-105'
          : ''}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          /></svg
        >
        Загрузить
      </button>
      <input {...packUpload.input} class="hidden" />
    </div>

    <button
      type="button"
      class="btn btn-outline btn-secondary flex-1"
      onclick={handleExport}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        /></svg
      >
      Скачать
    </button>
  </div>
</div>

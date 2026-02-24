<script lang="ts">
  import { FileUpload } from "melt/builders";
  import { fade } from "svelte/transition";

  // двусторонняя привязка для сохранения base64-строки
  let { avatar = $bindable() }: { avatar?: string } = $props();

  const fileUpload = new FileUpload({
    accept: "image/jpeg, image/png, image/webp",
    maxSize: 5 * 1024 * 1024, // 5 мегабайт
    multiple: false,
  });

  // отслеживаем свойство selected из билдера
  $effect(() => {
    // selected может быть массивом или одним файлом
    // если multiple = false, то приводим к одному файлу
    const currentSelection = fileUpload.selected;
    const file = Array.isArray(currentSelection)
      ? currentSelection[0]
      : currentSelection;

    if (file instanceof File) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          avatar = e.target.result as string;
        }
      };

      reader.readAsDataURL(file);
    }
  });
</script>

<div class="shrink-0">
  <div
    {...fileUpload.dropzone}
    class="relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-base-300 ring-2 ring-base-content/10 hover:ring-primary transition-all group {fileUpload.isDragging
      ? 'ring-primary ring-4 scale-105'
      : ''}"
    aria-label="Загрузить аватар"
    role="button"
    tabindex="0"
  >
    {#if avatar}
      <img
        src={avatar}
        alt="Аватар"
        class="h-full w-full object-cover"
        transition:fade={{ duration: 200 }}
      />
      <div
        class="absolute inset-0 bg-base-300/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg
          class="h-6 w-6 text-base-content"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
    {:else}
      <svg
        class="h-6 w-6 text-base-content/50 group-hover:text-primary transition-colors {fileUpload.isDragging
          ? 'text-primary scale-110'
          : ''}"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
    {/if}
  </div>

  <input {...fileUpload.input} />
</div>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import gameData from "$lib/data/data.json";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import type { GamePack } from "$lib/types";
  import RoundEditor from "$lib/components/editor/RoundEditor.svelte";
  import ThemeSwitcher from "$lib/components/ui/ThemeSwitcher.svelte";

  // Загружаем данные: либо кастомный пак, либо дефолтный (клонируем)
  let pack = $state<GamePack>(
    JSON.parse(JSON.stringify(game.customPack ?? gameData)),
  );

  let activeTab = $state<"round1" | "round2" | "special">("round1");

  function handleSave() {
    // Минимальная валидация
    const allThemes = [...pack.round1, ...pack.round2];
    const emptyThemes = allThemes.filter((t) => !t.theme.trim());

    if (emptyThemes.length > 0) {
      addToast({
        data: {
          title: "Ошибка: У всех тем должны быть названия!",
          type: "error",
        },
      });
      return;
    }

    game.customPack = pack;
    addToast({ data: { title: "Пакет успешно сохранен!", type: "success" } });
    goto("/setup");
  }
</script>

<div class="min-h-screen bg-base-200 flex flex-col items-center p-4">
  <div class="w-full max-w-7xl">
    <div
      class="navbar bg-base-100 rounded-box shadow-lg mb-6 sticky top-2 z-50 border border-base-content/5"
    >
      <div class="navbar-start">
        <a href="/setup" class="btn btn-ghost text-xl normal-case">
          ✏️ Редактор
        </a>
      </div>
      <div class="navbar-center">
        <ThemeSwitcher />
      </div>
      <div class="navbar-end gap-2">
        <button class="btn btn-ghost" onclick={() => goto("/setup")}>
          Отмена
        </button>
        <button class="btn btn-primary" onclick={handleSave}>
          Сохранить
        </button>
      </div>
    </div>

    <div role="tablist" class="tabs tabs-lifted tabs-lg mb-4">
      <button
        role="tab"
        class="tab {activeTab === 'round1'
          ? 'tab-active [--tab-bg:var(--color-base-100)]'
          : ''}"
        onclick={() => (activeTab = "round1")}>Раунд 1</button
      >
      <button
        role="tab"
        class="tab {activeTab === 'round2'
          ? 'tab-active [--tab-bg:var(--color-base-100)]'
          : ''}"
        onclick={() => (activeTab = "round2")}>Раунд 2</button
      >
      <button
        role="tab"
        class="tab {activeTab === 'special'
          ? 'tab-active [--tab-bg:var(--color-base-100)]'
          : ''}"
        onclick={() => (activeTab = "special")}>Спец. вопросы</button
      >
    </div>

    <div
      class="bg-base-100 rounded-box rounded-tl-none p-6 shadow-xl min-h-[50vh]"
    >
      {#if activeTab === "round1"}
        <RoundEditor bind:themes={pack.round1} />
      {:else if activeTab === "round2"}
        <RoundEditor bind:themes={pack.round2} />
      {:else}
        <div class="hero py-10 bg-base-200/50 rounded-box">
          <div class="hero-content text-center">
            <div class="max-w-md">
              <h1 class="text-2xl font-bold">Спецвопросы и Финал</h1>
              <p class="py-6">
                Раздел для редактирования котов в мешке и финального вопроса
                будет добавлен в следующем коммите.
              </p>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

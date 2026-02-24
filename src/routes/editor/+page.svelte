<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import gameData from "$lib/data/data.json";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import type { GamePack } from "$lib/types";
  import RoundEditor from "$lib/components/editor/RoundEditor.svelte";
  import ThemeSwitcher from "$lib/components/ui/ThemeSwitcher.svelte";
  import SpecialsEditor from "$lib/components/editor/SpecialsEditor.svelte";
  import { fly, fade } from "svelte/transition";

  // либо кастомный пак либо клонируем дефолтный
  let pack = $state<GamePack>(
    JSON.parse(JSON.stringify(game.customPack ?? gameData)),
  );
  let activeTab = $state<"round1" | "round2" | "special">("round1");

  function handleSave() {
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
    <nav
      class="navbar bg-base-100 rounded-box shadow-lg mb-6 sticky top-2 z-50 border border-base-content/5"
    >
      <div class="navbar-start">
        <a href="/" class="btn btn-square btn-ghost" aria-label="На главную">
          <!-- иконка домика -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </a>
        <h1 class="text-xl normal-case relative left-2">Редактор</h1>
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
    </nav>

    <div role="tablist" class="tabs tabs-lifted tabs-lg mb-4">
      <button
        role="tab"
        class="tab duration-150 transition-all ease-in-out {activeTab ===
        'round1'
          ? 'tab-active [--tab-bg:var(--color-base-100)]'
          : ''}"
        onclick={() => (activeTab = "round1")}>Раунд 1</button
      >
      <button
        role="tab"
        class="tab duration-150 transition-all ease-in-out {activeTab ===
        'round2'
          ? 'tab-active [--tab-bg:var(--color-base-100)]'
          : ''}"
        onclick={() => (activeTab = "round2")}>Раунд 2</button
      >
      <button
        role="tab"
        class="tab duration-150 transition-all ease-in-out {activeTab ===
        'special'
          ? 'tab-active [--tab-bg:var(--color-base-100)]'
          : ''}"
        onclick={() => (activeTab = "special")}>Спец. вопросы</button
      >
    </div>

    <main
      class="bg-base-100 rounded-box rounded-tl-none p-6 shadow-xl min-h-[50vh] grid items-start overflow-x-hidden"
    >
      {#key activeTab}
        <div
          class="col-start-1 row-start-1 w-full"
          in:fly={{ y: 20, duration: 300, delay: 150 }}
          out:fade={{ duration: 150 }}
        >
          {#if activeTab === "round1"}
            <RoundEditor bind:themes={pack.round1} />
          {:else if activeTab === "round2"}
            <RoundEditor bind:themes={pack.round2} />
          {:else}
            <SpecialsEditor
              bind:cats={pack.catQuestions}
              bind:final={pack.finalQuestion}
            />
          {/if}
        </div>
      {/key}
    </main>
  </div>
</div>

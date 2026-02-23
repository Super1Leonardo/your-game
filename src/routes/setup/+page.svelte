<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import gameData from "$lib/data/data.json";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { prepareRound, type RawCatQuestion } from "$lib/utils/boardGenerator";
  import { fade, slide } from "svelte/transition";
  import ThemeSwitcher from "$lib/components/ui/ThemeSwitcher.svelte";
  import Upload from "$lib/components/ui/Upload.svelte";
  import { FileUpload } from "melt/builders";

  let isDropdownOpen = $state(false);
  const AVAILABLE_KEYS = [
    { displayKey: "A", eventKey: "a" },
    { displayKey: "Пробел", eventKey: " " },
    { displayKey: "L", eventKey: "l" },
    { displayKey: "Q", eventKey: "q" },
    { displayKey: "P", eventKey: "p" },
    { displayKey: "Z", eventKey: "z" },
  ];
  let playerCount = $state(3);

  let currentPack = $derived(game.customPack ?? gameData);
  let isCustomPack = $derived(!!game.customPack);

  let playersInput = $state([
    { id: crypto.randomUUID(), name: "", avatar: "", ...AVAILABLE_KEYS[0] },
    { id: crypto.randomUUID(), name: "", avatar: "", ...AVAILABLE_KEYS[1] },
    { id: crypto.randomUUID(), name: "", avatar: "", ...AVAILABLE_KEYS[2] },
  ]);

  // динамическое изменение количества игроков
  function updatePlayerCount(count: number) {
    const newPlayers = [...playersInput];
    while (newPlayers.length < count) {
      const i = newPlayers.length;
      newPlayers.push({
        id: crypto.randomUUID(),
        name: "",
        avatar: "",
        displayKey: AVAILABLE_KEYS[i].displayKey,
        eventKey: AVAILABLE_KEYS[i].eventKey,
      });
    }
    if (newPlayers.length > count) {
      newPlayers.length = count;
    }
    playersInput = newPlayers;
  }

  const packUpload = new FileUpload({
    accept: "application/json",
    multiple: false,
  });

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
            // валидация
            parsed.round1 &&
            parsed.round2 &&
            parsed.catQuestions &&
            parsed.finalQuestion
          ) {
            game.customPack = parsed;

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

  function handleStartGame() {
    for (const p of playersInput) {
      const trimmedName = p.name.trim();
      if (!trimmedName) {
        addToast({
          data: {
            testid: "setup-empty-name-alert",
            title: "Все имена должны быть заполнены!",
            type: "error",
          },
        });
        return;
      }
      if (trimmedName.length > 15) {
        addToast({
          data: {
            testid: "setup-long-name-alert",
            title: "Имя слишком длинное (максимум 15 символов)!",
            type: "error",
          },
        });
        return;
      }
    }

    game.players = playersInput.map((p) => ({
      id: p.id,
      name: p.name.trim(),
      key: p.eventKey,
      score: 0,
      avatar: p.avatar,
    }));

    // currentPack уже derived кста
    const availableCats: RawCatQuestion[] = [...currentPack.catQuestions];
    game.round1Themes = prepareRound(currentPack.round1, availableCats);
    game.round2Themes = prepareRound(currentPack.round2, availableCats);

    game.finalQuestion = {
      id: crypto.randomUUID(),
      type: "final",
      text: currentPack.finalQuestion.text,
      answer: currentPack.finalQuestion.answer,
      price: 0,
      isPlayed: false,
      secretTheme: currentPack.finalQuestion.theme,
    };

    game.phase = "round1";
    game.currentPlayerId = game.players[0].id;

    goto("/game");
  }
</script>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
  <div class="absolute top-1 z-50 mt-8">
    <ThemeSwitcher />
  </div>
  <div class="card w-full max-w-lg bg-base-100 mt-4 shadow-xl">
    <div class="card-body">
      <h1
        class="card-title text-4xl text-secondary font-bold justify-center mb-4 mt-6"
      >
        Подготовка игры
      </h1>

      <p class="text-center text-base-content/70 mb-4">
        Выберите количество игроков и введите их имена.
      </p>

      <div class="form-control w-full mb-4">
        <p class="label" id="player-count-label">
          <span class="label-text text-secondary/50 mb-0.5 font-semibold"
            >Количество игроков:</span
          >
        </p>

        <div class="relative w-full">
          <button
            type="button"
            aria-labelledby="player-count-label"
            class="select select-bordered w-full focus:select-primary text-lg flex items-center justify-between"
            onclick={() => (isDropdownOpen = !isDropdownOpen)}
            data-test-id="setup-player-count-select"
          >
            <span class="text-secondary"
              >{playerCount} {playerCount > 4 ? "игроков" : "игрока"}</span
            >
          </button>

          {#if isDropdownOpen}
            <button
              tabindex="-1"
              type="button"
              class="fixed inset-0 z-40 w-full h-full cursor-default"
              onclick={() => (isDropdownOpen = false)}
              aria-label="Закрыть меню"
            ></button>

            <ul
              transition:fade={{ duration: 150 }}
              class="absolute top-full z-50 mt-2 w-full flex-col rounded-box bg-base-200 p-2 shadow-xl border border-base-content/10"
            >
              {#each [2, 3, 4, 5, 6] as count}
                <li>
                  <button
                    type="button"
                    class="w-full cursor-pointer flex items-center justify-between rounded-md px-4 py-3 hover:bg-primary hover:text-primary-content transition-colors"
                    onclick={() => {
                      playerCount = count;
                      updatePlayerCount(count);
                      isDropdownOpen = false;
                    }}
                  >
                    <span>{count} {count > 4 ? "игроков" : "игрока"}</span>
                    {#if playerCount === count}
                      <span class="font-bold">✓</span>
                    {/if}
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>

      <div class="flex flex-col">
        {#each playersInput as player, index (player.id)}
          <div
            transition:slide={{ duration: 300 }}
            class="form-control w-full pb-4"
          >
            <label class="label mb-1" for="player-{index}">
              <span class="font-semibold text-secondary/50"
                >Игрок {index + 1}</span
              >
              <span class="badge badge-soft badge-secondary ml-1">
                Клавиша: {player.displayKey}
              </span>
            </label>
            <div class="flex gap-4 items-center w-full">
              <Upload bind:avatar={player.avatar} />
              <input
                data-test-id="input-{index + 1}"
                id="player-{index}"
                type="text"
                placeholder="Введите имя..."
                class="input input-bordered text-secondary w-full focus:input-primary"
                bind:value={player.name}
                onkeydown={(e) => e.key === "Enter" && handleStartGame()}
              />
            </div>
          </div>
        {/each}
      </div>
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
      <div class="card-actions justify-center mt-6">
        <button
          data-test-id="setup-continue-button"
          class="btn btn-primary w-full text-lg"
          onclick={handleStartGame}
        >
          Начать игру
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  @reference "../layout.css";
  div,
  input,
  text {
    @apply transition-colors duration-300 ease-in-out;
  }
</style>

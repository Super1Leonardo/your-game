<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import gameData from "$lib/data/data.json";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { prepareRound, type RawCatQuestion } from "$lib/utils/boardGenerator";
  import { fade, slide } from "svelte/transition"; 
  import ThemeSwitcher from "$lib/components/ui/ThemeSwitcher.svelte";
  import Upload from "$lib/components/ui/Upload.svelte";

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
      })}
    if (newPlayers.length > count) {
      newPlayers.length = count;
    }
    playersInput = newPlayers;
  }

  function handleStartGame() {
    for (const p of playersInput) {
      const trimmedName = p.name.trim();
      if (!trimmedName) {
        addToast({
          data: {testid: "setup-empty-name-alert", title: "Все имена должны быть заполнены!", type: "error"},
        });
        return;
      }
      if (trimmedName.length > 15) {
        addToast({
          data: {testid: "setup-long-name-alert", title: "Имя слишком длинное (максимум 15 символов)!", type: "error"},
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

    const availableCats: RawCatQuestion[] = [...gameData.catQuestions];

    game.round1Themes = prepareRound(gameData.round1, availableCats);
    game.round2Themes = prepareRound(gameData.round2, availableCats);

    game.finalQuestion = {
      id: crypto.randomUUID(),
      type: "final",
      text: gameData.finalQuestion.text,
      answer: gameData.finalQuestion.answer,
      price: 0,
      isPlayed: false,
      secretTheme: gameData.finalQuestion.theme,
    };

    game.phase = "round1";
    game.currentPlayerId = game.players[0].id;

    goto("/game");
  }
</script>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
  <div class="absolute top-1 z-50 mt-8 ">
    <ThemeSwitcher />
  </div>
  <div class="card w-full max-w-lg bg-base-100 shadow-xl">
    <div class="card-body">
      <h1 class="card-title text-4xl text-secondary font-bold justify-center mb-4 mt-6">
        Подготовка игры
      </h1>

      <p class="text-center text-base-content/70 mb-4">
        Выберите количество игроков и введите их имена.
      </p>

      <div class="form-control w-full mb-4">
        <p class="label" id="player-count-label">
          <span class="label-text text-secondary/50 mb-0.5 font-semibold">Количество игроков:</span>
        </p>
        
        <div class="relative w-full">
          <button
            type="button"
            aria-labelledby="player-count-label"
            class="select select-bordered w-full focus:select-primary text-lg flex items-center justify-between"
            onclick={() => (isDropdownOpen = !isDropdownOpen)}
            data-test-id="setup-player-count-select"
          >
            <span class="text-secondary">{playerCount} {playerCount > 4 ? "игроков" : "игрока"}</span>
          </button>

          {#if isDropdownOpen}
            <button 
              tabindex="-1" 
              type="button" 
              class="fixed inset-0 z-40 w-full h-full cursor-default" 
              onclick={() => isDropdownOpen = false}
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
                    class="w-full cursor-pointer flex items-center justify-between rounded-md px-4 py-3 hover:bg-primary hover:text-primary-content transition-colors "
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

      <div class="flex flex-col ">
        {#each playersInput as player, index (player.id)}
          <div
            transition:slide={{ duration: 300 }}
            class="form-control w-full pb-4"
          >
            <label class="label mb-1" for="player-{index}">
              <span class="font-semibold text-secondary/50">Игрок {index + 1}</span>
              <span class="badge badge-soft badge-secondary">
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
      <div class="card-actions justify-center mt-6">
        <button
          data-test-id="setup-continue-button"
          class="btn btn-primary w-full text-lg"
          onclick={handleStartGame}>
          Начать игру
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  @reference "../layout.css";
  div {
    @apply transition-colors duration-300 ease-in-out;
  }

</style>
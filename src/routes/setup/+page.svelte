<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import gameData from "$lib/data/data.json";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { prepareRound, type RawCatQuestion } from "$lib/utils/boardGenerator";

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
    { id: crypto.randomUUID(), name: "", ...AVAILABLE_KEYS[0] },
    { id: crypto.randomUUID(), name: "", ...AVAILABLE_KEYS[1] },
    { id: crypto.randomUUID(), name: "", ...AVAILABLE_KEYS[2] },
  ]);

  // динамическое изменение количества игроков
  function updatePlayerCount(count: number) {
    const newPlayers = [...playersInput];
    while (newPlayers.length < count) {
      const i = newPlayers.length;
      newPlayers.push({
        id: crypto.randomUUID(),
        name: "",
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
  <div class="card w-full max-w-lg bg-base-100 shadow-xl">
    <div class="card-body">
      <h1 class="card-title text-4xl font-bold justify-center mb-4 mt-6">
        Подготовка игры
      </h1>

      <p class="text-center text-base-content/70 mb-4">
        Выберите количество игроков и введите их имена.
      </p>

      <div class="form-control w-full mb-4">
        <label class="label" for="player-count">
          <span class="label-text mb-0.5 font-semibold"
            >Количество игроков:</span>
        </label>
        <select
          id="player-count"
          class="select select-bordered w-full focus:select-primary text-lg"
          bind:value={playerCount}
          onchange={() => updatePlayerCount(playerCount)}
          data-test-id="setup-player-count-select">
          {#each [2, 3, 4, 5, 6] as count}
            <option value={count}>{count} {count > 4 ? "игроков" : "игрока"}</option>
          {/each}
        </select>
      </div>

      <div class="flex flex-col gap-4">
        {#each playersInput as player, index}
          <div
            class="form-control w-full animate-in fade-in slide-in-from-top-2">
            <label class="label mb-1" for="player-{index}">
              <span class="label-text font-semibold">Игрок {index + 1}</span>
              <span class="label-text-alt badge badge-soft badge-secondary">
                Клавиша: {player.displayKey}
              </span>
            </label>
            <input
              data-test-id="input-{index + 1}"
              id="player-{index}"
              type="text"
              placeholder="Введите имя..."
              class="input input-bordered w-full focus:input-primary"
              bind:value={player.name}
              onkeydown={(e) => e.key === "Enter" && handleStartGame()}/>
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

<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import gameData from "$lib/data/data.json";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import type { Theme, Question } from "$lib/types";

  // локальные интерфейсы
  interface RawQuestion {
    cost: number;
    text: string;
    answer: string;
  }
  interface RawTheme {
    theme: string;
    questions: RawQuestion[];
  }
  interface RawCatQuestion {
    theme: string;
    text: string;
    answer: string;
  }

  let playersInput = $state([
    { id: crypto.randomUUID(), name: "", displayKey: "A", eventKey: "a" },
    { id: crypto.randomUUID(), name: "", displayKey: "Пробел", eventKey: " " },
    { id: crypto.randomUUID(), name: "", displayKey: "L", eventKey: "l" },
  ]);

  // подготовка раунда
  function prepareRound(
    rawThemes: RawTheme[],
    catPool: RawCatQuestion[]
  ): Theme[] {
    // парсинг всех вопр
    const themes: Theme[] = rawThemes.map((rt) => ({
      id: crypto.randomUUID(),
      name: rt.theme,
      questions: rt.questions.map((rq) => ({
        id: crypto.randomUUID(),
        type: "normal",
        text: rq.text,
        answer: rq.answer,
        price: rq.cost,
        isPlayed: false,
      })),
    }));

    const allQuestions: Question[] = themes.flatMap((t) => t.questions); // собираем все вопросы
    // выбираем случайно индексы и делаем аукционы и котов
    const specialIndices = new Set<number>();
    while (specialIndices.size < 4) {
      specialIndices.add(Math.floor(Math.random() * allQuestions.length));
    }
    const indices = Array.from(specialIndices);

    allQuestions[indices[0]].type = "auction";
    allQuestions[indices[1]].type = "auction";

    for (let i = 2; i < 4; i++) {
      const q = allQuestions[indices[i]];
      q.type = "cat";

      if (catPool.length > 0) {
        const randomCatIdx = Math.floor(Math.random() * catPool.length);
        const catData = catPool.splice(randomCatIdx, 1)[0];
        // кот вырезан и не повторится
        q.secretTheme = catData.theme;
        q.text = catData.text;
        q.answer = catData.answer;
      }
    }

    return themes;
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
    }));

    const availableCats: RawCatQuestion[] = [...gameData.catQuestions];

    game.round1Themes = prepareRound(gameData.round1, availableCats);
    game.round2Themes = prepareRound(gameData.round2, availableCats);

    // финал
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
    game.currentPlayerId = game.players[0].id; // право выбора у первого игрока

    goto("/game");
  }
</script>

<div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
  <div class="card w-full max-w-lg bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-3xl font-bold justify-center mb-6">
        Подготовка игры
      </h2>

      <p class="text-center text-base-content/70 mb-4">
        Введите имена трех игроков. Запомните свои клавиши — они понадобятся,
        чтобы успеть ответить первыми!
      </p>

      <div class="flex flex-col gap-4">
        {#each playersInput as player, index}
          <div class="form-control w-full">
            <label class="label" for="player-{index}">
              <span class="label-text font-semibold">Игрок {index + 1}</span>
              <span class="label-text-alt badge badge-secondary badge-outline">
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
              onkeydown={(e) => e.key === "Enter" && handleStartGame()}
            />
          </div>
        {/each}
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

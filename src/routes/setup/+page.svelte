<script lang="ts">
  import { goto } from "$app/navigation";
  import { game } from "$lib/state/gameStore.svelte";
  import gameData from "$lib/data/data.json";
  import { addToast } from "$lib/components/ui/Toaster.svelte";
  import { prepareRound } from "$lib/utils/boardGenerator";
  import type { RawSpecialQuestion } from "$lib/types";
  import ThemeSwitcher from "$lib/components/ui/ThemeSwitcher.svelte";

  // Импорт новых компонентов
  import PlayerSetup from "$lib/components/setup/PlayerSetup.svelte";
  import GamePackManager from "$lib/components/setup/GamePackManager.svelte";

  // Состояние игроков хранится здесь, но управляется внутри PlayerSetup
  let playersInput = $state<any[]>([]);

  function handleStartGame() {
    // Валидация имен
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
      // сохранение игроков
      id: p.id,
      name: p.name.trim(),
      key: p.eventKey,
      score: 0,
      avatar: p.avatar,
    }));

    const pack = game.customPack ?? gameData; // либо стор либо загруженный
    const availableCats: RawSpecialQuestion[] = [...pack.catQuestions];

    game.round1Themes = prepareRound(pack.round1, availableCats);
    game.round2Themes = prepareRound(pack.round2, availableCats);
    game.finalQuestion = {
      id: crypto.randomUUID(),
      type: "final",
      text: pack.finalQuestion.text,
      answer: pack.finalQuestion.answer,
      price: 0,
      isPlayed: false,
      secretTheme: pack.finalQuestion.theme,
    };

    game.phase = "round1";
    game.currentPlayerId = game.players[0].id;

    goto("/game");
  }
</script>

<div
  class="min-h-screen bg-base-200 flex transition-colors duration-300 items-center justify-center p-4"
>
  <div class="absolute top-1 z-50 mt-4">
    <ThemeSwitcher />
  </div>
  <div
    class="card w-full transition-colors duration-300 max-w-lg bg-base-100 mt-4 shadow-xl"
  >
    <div class="card-body">
      <h1
        class="card-title text-4xl text-secondary font-bold justify-center mb-4 mt-6"
      >
        Подготовка игры
      </h1>

      <p class="text-center text-base-content/70 mb-4">
        Выберите количество игроков и введите их имена.
      </p>

      <PlayerSetup bind:playersInput />

      <GamePackManager />

      <div class="w-full mb-2">
        <a href="/editor" class="btn btn-outline btn-secondary w-full">
          Редактор вопросов
        </a>
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

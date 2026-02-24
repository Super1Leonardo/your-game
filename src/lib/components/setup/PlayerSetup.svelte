<script lang="ts">
  import { slide, fade } from "svelte/transition";
  import Upload from "$lib/components/ui/Upload.svelte";

  // Принимаем массив игроков от родителя для двусторонней связи
  let { playersInput = $bindable() }: { playersInput: any[] } = $props();

  let isDropdownOpen = $state(false);
  let playerCount = $state(3);

  const AVAILABLE_KEYS = [
    { displayKey: "A", eventKey: "a" },
    { displayKey: "Пробел", eventKey: " " },
    { displayKey: "L", eventKey: "l" },
    { displayKey: "Q", eventKey: "q" },
    { displayKey: "P", eventKey: "p" },
    { displayKey: "Z", eventKey: "z" },
  ];

  // Инициализация при первом маунте (если массив пуст)
  $effect(() => {
    if (playersInput.length === 0) {
      updatePlayerCount(3);
    }
  });

  function updatePlayerCount(count: number) {
    const newPlayers = [...playersInput];
    while (newPlayers.length < count) {
      const i = newPlayers.length;
      newPlayers.push({
        id: crypto.randomUUID(),
        name: "",
        avatar: "", // Важно для экстрафичи
        displayKey: AVAILABLE_KEYS[i].displayKey,
        eventKey: AVAILABLE_KEYS[i].eventKey,
      });
    }
    if (newPlayers.length > count) {
      newPlayers.length = count;
    }
    playersInput = newPlayers;
  }
</script>

<div class="form-control w-full mb-4">
  <label class="label" id="player-count-label" for="player-count-btn">
    <span class="label-text text-secondary/50 mb-0.5 font-semibold"
      >Количество игроков:</span
    >
  </label>

  <div class="relative w-full">
    <button
      type="button"
      aria-labelledby="player-count-label"
      class="select select-bordered w-full focus:select-primary text-lg flex items-center justify-between"
      onclick={() => (isDropdownOpen = !isDropdownOpen)}
      data-test-id="setup-player-count-select"
      id="player-count-btn"
      aria-haspopup="listbox"
      aria-expanded={isDropdownOpen}
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
        role="listbox"
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
    <fieldset
      transition:slide={{ duration: 300 }}
      class="form-control w-full pb-4"
    >
      <label class="label mb-1" for="player-{index}">
        <span class="font-semibold text-secondary/50">Игрок {index + 1}</span>
        <span class="badge badge-soft badge-secondary ml-1"
          >Клавиша: {player.displayKey}</span
        >
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
        />
      </div>
    </fieldset>
  {/each}
</div>

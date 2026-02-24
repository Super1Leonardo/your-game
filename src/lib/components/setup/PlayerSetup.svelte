<script lang="ts">
  import { slide, fade } from "svelte/transition";
  import Upload from "$lib/components/ui/Upload.svelte";
  import { profileStore, deleteProfile } from "$lib/state/profileStore.svelte";

  // Принимаем массив игроков от родителя для двусторонней связи
  let { playersInput = $bindable() }: { playersInput: any[] } = $props();

  let isDropdownOpen = $state(false);
  let playerCount = $state(3);

  // Состояние для открытия дропдаунов выбора профиля (по индексу игрока)
  let openProfileDropdowns = $state<Record<number, boolean>>({});

  const AVAILABLE_KEYS = [
    { displayKey: "A", eventKey: "a" },
    { displayKey: "Пробел", eventKey: " " },
    { displayKey: "L", eventKey: "l" },
    { displayKey: "Q", eventKey: "q" },
    { displayKey: "P", eventKey: "p" },
    { displayKey: "Z", eventKey: "z" },
  ];

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
        avatar: "",
        displayKey: AVAILABLE_KEYS[i]?.displayKey || "?",
        eventKey: AVAILABLE_KEYS[i]?.eventKey || "",
      });
    }
    if (newPlayers.length > count) {
      newPlayers.length = count;
    }
    playersInput = newPlayers;
  }

  function selectProfile(playerIndex: number, profile: any) {
    playersInput[playerIndex].name = profile.name;
    playersInput[playerIndex].avatar = profile.avatar || "";
    openProfileDropdowns[playerIndex] = false; // Закрыть меню
  }

  function toggleProfileDropdown(index: number) {
    openProfileDropdowns[index] = !openProfileDropdowns[index];
  }
</script>

<section class="form-control w-full mb-4">
  <label class="label" id="player-count-label" for="player-count-btn">
    <span class="label-text text-secondary/50 mb-0.5 font-semibold"
      >Количество игроков:</span
    >
  </label>

  <div class="relative w-full">
    <button
      id="player-count-btn"
      type="button"
      aria-haspopup="listbox"
      aria-expanded={isDropdownOpen}
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
        role="listbox"
        transition:fade={{ duration: 150 }}
        class="absolute top-full z-50 mt-2 w-full flex-col rounded-box bg-base-200 p-2 shadow-xl border border-base-content/10"
      >
        {#each [2, 3, 4, 5, 6] as count}
          <li role="option" aria-selected={playerCount === count}>
            <button
              type="button"
              class="w-full cursor-pointer flex items-center justify-between rounded-md
              px-4 py-3 hover:bg-primary hover:text-primary-content transition-colors"
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
</section>

<div class="flex flex-col gap-4">
  {#each playersInput as player, index (player.id)}
    <fieldset
      transition:slide={{ duration: 300 }}
      class="form-control w-full p-0 m-0 border-none relative"
    >
      <legend class="label mb-1 w-full flex">
        <span class="font-semibold text-secondary/50">Игрок {index + 1}</span>
        <div class="flex items-center gap-2">
          {#if profileStore.profiles.length > 0}
            <div class="relative">
              <button
                type="button"
                class="btn btn-xs btn-ghost ml-3 text-secondary"
                onclick={() => toggleProfileDropdown(index)}
              >
                Загрузить профиль ▼
              </button>

              {#if openProfileDropdowns[index]}
                <button
                  type="button"
                  class="fixed inset-0 z-40 cursor-default"
                  onclick={() => (openProfileDropdowns[index] = false)}
                  aria-label="Закрыть список профилей"
                ></button>
                <ul
                  transition:slide={{ duration: 200, axis: "y" }}
                  class="absolute left-3 top-full z-50 mt-1 w-56 p-2 shadow-xl bg-base-200 rounded-box border border-base-content/10 max-h-48 overflow-y-auto"
                >
                  {#each profileStore.profiles as profile}
                    <li
                      class="flex justify-between cursor-pointer items-center p-1 hover:bg-base-300 rounded mb-1"
                    >
                      <button
                        type="button"
                        class="flex-1 text-left cursor-pointer text-sm px-2 truncate"
                        onclick={() => selectProfile(index, profile)}
                      >
                        {profile.name}
                      </button>
                      <button
                        type="button"
                        class="btn btn-ghost btn-xs text-error"
                        aria-label="Удалить профиль"
                        onclick={(e) => {
                          e.stopPropagation();
                          deleteProfile(profile.id);
                        }}
                      >
                        ✕
                      </button>
                    </li>
                  {/each}
                </ul>
              {/if}
            </div>
          {/if}
          <span class="badge badge-soft badge-secondary ml-1"
            >Клавиша: {player.displayKey}</span
          >
        </div>
      </legend>
      <div class="flex gap-4 items-center w-full">
        <Upload bind:avatar={player.avatar} />

        <label for="player-name-{player.id}" class="sr-only"
          >Имя игрока {index + 1}</label
        >
        <input
          id="player-name-{player.id}"
          data-test-id="input-{index + 1}"
          type="text"
          placeholder="Введите имя..."
          class="input input-bordered text-secondary w-full focus:input-primary"
          bind:value={player.name}
          autocomplete="off"
        />
      </div>
    </fieldset>
  {/each}
</div>

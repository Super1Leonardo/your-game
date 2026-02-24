<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import Upload from "$lib/components/ui/Upload.svelte";
  import { profileStore, deleteProfile } from "$lib/state/profileStore.svelte";

  // Принимаем объект игрока
  let {
    player = $bindable(),
    index,
  }: {
    player: any;
    index: number;
  } = $props();

  // Локальное состояние дропдауна профилей (теперь не нужен глобальный массив флагов)
  let isProfileOpen = $state(false);

  function selectProfile(profile: any) {
    player.name = profile.name;
    player.avatar = profile.avatar || "";
    isProfileOpen = false;
  }
</script>

<fieldset
  transition:slide={{ duration: 300 }}
  class="form-control w-full p-0 m-0 border-none relative"
>
  <legend class="label mb-1 w-full flex justify-between">
    <div class="flex gap-4">
      <span class="font-semibold text-secondary/50">Игрок {index + 1}</span>
      {#if profileStore.profiles.length > 0}
        <div class="relative">
          <button
            transition:fade={{ duration: 300 }}
            type="button"
            class="btn btn-xs btn-ghost text-secondary"
            onclick={() => (isProfileOpen = !isProfileOpen)}
          >
            Загрузить профиль ▼
          </button>

          {#if isProfileOpen}
            <button
              type="button"
              class="fixed inset-0 z-40 cursor-default"
              onclick={() => (isProfileOpen = false)}
              aria-label="Закрыть список профилей"
            ></button>
            <ul
              transition:slide={{ duration: 200, axis: "y" }}
              class="absolute left-0 top-full z-50 mt-1 w-56 p-2 shadow-xl bg-base-200 rounded-box border border-base-content/10 max-h-48 overflow-y-auto"
            >
              {#each profileStore.profiles as profile}
                <li
                  class="flex justify-between items-center p-1 hover:bg-base-300 rounded mb-1"
                >
                  <button
                    type="button"
                    class="flex-1 text-left text-sm px-2 truncate"
                    onclick={() => selectProfile(profile)}
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
    </div>

    <span class="badge badge-soft badge-secondary ml-1"
      >Клавиша: {player.displayKey}</span
    >
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

<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
  import DevModeSwitch from "$lib/components/ui/DevModeSwitch.svelte";
  import ThemeSwitcher from "../ui/ThemeSwitcher.svelte";

  let roundTitle = $derived.by(() => {
    if (game.phase === "round1") return "Раунд 1";
    if (game.phase === "round2") return "Раунд 2";
    if (game.phase === "final") return "Финал";
    if (game.phase === "results") return "Итоги";
    return "";
  });
</script>

<header class="bg-base-100 rounded-xl px-4 navbar">
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

    <h1
      class="font-extrabold left-3.5 relative text-3xl drop-shadow-sm whitespace-nowrap"
    >
      {roundTitle}
    </h1>
  </div>

  <div class="navbar-center">
    <ThemeSwitcher />
  </div>

  <div class="navbar-end">
    <DevModeSwitch />
  </div>
</header>

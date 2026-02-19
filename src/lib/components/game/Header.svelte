<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";
  import DevModeSwitch from "$lib/components/ui/DevModeSwitch.svelte";
  import ThemeSwitcher from "../ui/ThemeSwitcher.svelte";

  let roundTitle = $derived.by(() => {
    if (game.phase === "round1") return "Раунд 1";
    if (game.phase === "round2") return "Раунд 2";
    if (game.phase === "final") return "Финальный раунд";
    return "";
  });
</script>

<header class="flex w-full max-w-6xl justify-between items-center">
  <h1 class="font-extrabold text-5xl drop-shadow-sm">
    {roundTitle}
  </h1>
  <ThemeSwitcher />
  <DevModeSwitch />
</header>

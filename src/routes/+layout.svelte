<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { game, loadGame } from "$lib/state/gameStore.svelte";
  import { onMount } from "svelte";

  let { children } = $props();

  onMount(() => {
    loadGame();
  });

  $effect(() => {
    // люборе изменение game
    const serializedState = JSON.stringify(game); // читает все поля для подписки на глубокие изменения
    if (typeof window !== "undefined") {
      localStorage.setItem("igra-state", serializedState);
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Твоя Игра</title>
</svelte:head>

{@render children()}

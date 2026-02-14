<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    game,
    loadGame,
    initStorePersistence,
  } from "$lib/state/gameStore.svelte";
  import { onMount } from "svelte";

  let { children } = $props();
  let isInitialized = $state(false);

  onMount(() => {
    loadGame();
    initStorePersistence(); // трекинг изменений
    isInitialized = true;
  });

  // крч чтобы на старт всегда направляло
  $effect(() => {
    if (isInitialized) {
      const isAtHome = $page.url.pathname === "/";
      const isAtSetup = $page.url.pathname === "/setup";
      const hasNoPlayers = game.players.length === 0;

      if (!isAtHome && !isAtSetup && hasNoPlayers) {
        goto("/");
      }
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>Твоя Игра</title>
</svelte:head>

{#if isInitialized}
  <main class="min-h-screen bg-base-300 text-base-content">
    {@render children()}
  </main>
{:else}
  <div class="flex h-screen w-full items-center justify-center bg-base-100">
    <span class="loading loading-ring loading-lg text-primary"></span>
  </div>
{/if}

<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { goto } from "$app/navigation";
  import {
    game,
    loadGame,
    initStorePersistence,
  } from "$lib/state/gameStore.svelte";
  import {
    loadDevMode,
    initDevStorePersistence,
  } from "$lib/state/devStore.svelte";
  import { onMount } from "svelte";
  import Toaster from "$lib/components/ui/Toaster.svelte";
  import { fly } from "svelte/transition";
  import { page } from "$app/stores";

  let { children } = $props();
  let isInitialized = $state(false);

  onMount(() => {
    loadGame();
    initStorePersistence();
    loadDevMode();
    initDevStorePersistence();
    isInitialized = true;
  });

  $effect(() => {
    if (isInitialized) {
      const isAtHome = $page.url.pathname === "/";
      const isAtSetup = $page.url.pathname === "/setup";
      const isAtEditor = $page.url.pathname === "/editor";
      const hasNoPlayers = game.players.length === 0;

      if (!isAtHome && !isAtSetup && !isAtEditor && hasNoPlayers) {
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
  <main class="min-h-screen bg-base-300 text-base-content overflow-hidden">
    {#key $page.url.pathname}
      <div class="w-full h-full" in:fly={{ y: 30, duration: 400, delay: 50 }}>
        {@render children()}
      </div>
    {/key}
    <Toaster />
  </main>
{:else}
  <div class="flex h-screen w-full items-center justify-center bg-base-100">
    <span class="loading loading-ring loading-lg text-primary"></span>
  </div>
{/if}

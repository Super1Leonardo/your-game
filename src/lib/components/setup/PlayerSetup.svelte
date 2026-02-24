<script lang="ts">
  import PlayerCountSelector from "./PlayerCountSelector.svelte";
  import PlayerInputRow from "./PlayerInputRow.svelte";

  let { playersInput = $bindable() }: { playersInput: any[] } = $props();

  let playerCount = $state(3);

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
</script>

<PlayerCountSelector 
  bind:count={playerCount} 
  onCountChange={updatePlayerCount} 
/>

<div class="flex flex-col gap-4">
  {#each playersInput as player, index (player.id)}
    <PlayerInputRow bind:player={playersInput[index]} {index} />
  {/each}
</div>
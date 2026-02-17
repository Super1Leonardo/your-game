<script lang="ts">
  import { game } from "$lib/state/gameStore.svelte";

  let { onTimeUp }: { onTimeUp: () => void } = $props();

  let timeLeft = $state(30);
  let progress = $state(30); // процент заполнения кольца

  $effect(() => {
    if (!game.timerEndsAt) return;

    let animationFrameId: number;

    function update() {
      if (!game.timerEndsAt) return;

      const now = Date.now();
      const remainingMs = Math.max(0, game.timerEndsAt - now);

      progress = (remainingMs / 30000) * 100;
      timeLeft = Math.ceil(remainingMs / 1000);

      if (remainingMs > 0) {
        animationFrameId = requestAnimationFrame(update);
      } else {
        onTimeUp();
      }
    }

    // Запускаем цикл отрисовки
    animationFrameId = requestAnimationFrame(update);

    // Очистка при размонтировании или паузе
    return () => cancelAnimationFrame(animationFrameId);
  });
</script>

<div
  class="radial-progress text-primary"
  style="--value: {progress}; --size: 5rem; --thickness: 0.5rem;"
  role="progressbar"
  aria-valuenow={timeLeft}
  aria-valuemin="0"
  aria-valuemax="30"
>
  <span class="text-2xl font-bold">{timeLeft}</span>
</div>

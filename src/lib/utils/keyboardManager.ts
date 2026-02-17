import { game } from "$lib/state/gameStore.svelte";

export function initKeyboardManager() {
  const ru_en_map: Record<string, string> = {
    й: "q",
    ц: "w",
    у: "e",
    к: "r",
    е: "t",
    н: "y",
    г: "u",
    ш: "i",
    щ: "o",
    з: "p",
    х: "[",
    ъ: "]",
    ф: "a",
    ы: "s",
    в: "d",
    а: "f",
    п: "g",
    р: "h",
    о: "j",
    л: "k",
    д: "l",
    ж: ";",
    э: "'",
    я: "z",
    ч: "x",
    с: "c",
    м: "v",
    и: "b",
    т: "n",
    ь: "m",
    б: ",",
    ю: ".",
    ".": "/",
  };
  function handleKeydown(e: KeyboardEvent) {
    // игнор если фокус на поле ввода
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    )
      return;
    // блокировка перехвата
    if (
      game.answeringPlayerId !== null || // кто то отвечает
      !game.activeQuestion || // нет активного вопроса
      !game.timerEndsAt // таймер не запущен или на паузе
    )
      return;
    const rawKey = e.key.toLowerCase();
    const normalizedKey = ru_en_map[rawKey] || rawKey;
    const player = game.players.find(
      (p) => p.key.toLowerCase() === normalizedKey
    );

    // игрок нажал кнопку и не ошибся в вопросе
    if (player && !game.attemptedPlayerIds.includes(player.id)) {
      game.answeringPlayerId = player.id;
      game.timerEndsAt = null; // таймер на паузе
    }
  }

  window.addEventListener("keydown", handleKeydown);

  // возвращаем функцию очистки
  return () => {
    window.removeEventListener("keydown", handleKeydown);
  };
}

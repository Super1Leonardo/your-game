import { test, expect } from "@playwright/test";

test.describe("Final round tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      const state = {
        phase: "final",
        players: [
          { id: "p1", name: "Игрок 1", key: "a", score: 100 },
          { id: "p2", name: "Игрок 2", key: "b", score: -50 },
          { id: "p3", name: "Игрок 3", key: "c", score: 200 },
        ],
        finalQuestion: {
          id: "f1",
          type: "final",
          theme: "Финальная тема",
          text: "Текст финального вопроса",
          answer: "Правильный ответ",
          price: 0,
        },
        finalState: null,
      };
      localStorage.setItem("igra-state", JSON.stringify(state));
    });
    await page.goto("/final");
  });

  test("1. Exclude negative score and validate bets", async ({ page }) => {
    await expect(page.getByText("Ставку делает Игрок 1")).toBeVisible();
    await expect(page.getByText("Ставку делает Игрок 2")).not.toBeVisible();

    const betInput = page.getByTestId("final-bet-input");
    const betSubmit = page.getByTestId("final-bet-submit");

    await betInput.fill("500");
    await betSubmit.click();
    await expect(
      page.getByText("Ставка должна быть от 1 до 100"),
    ).toBeVisible();

    await betInput.fill("0");
    await betSubmit.click();
    await expect(
      page.getByText("Ставка должна быть от 1 до 100").nth(1),
    ).toBeVisible();

    await betInput.fill("50");
    await betSubmit.click();
    await expect(page.getByText("Ставку делает Игрок 3")).toBeVisible();
  });

  test("2. Full final flow & Results screen", async ({ page }) => {
    await page.getByTestId("final-bet-input").fill("50");
    await page.getByTestId("final-bet-submit").click();
    await page.getByTestId("final-bet-input").fill("200");
    await page.getByTestId("final-bet-submit").click();

    await expect(page.getByText("Очередь игрока Игрок 1")).toBeVisible();
    await page.getByTestId("final-ready-btn").click();
    await page.getByTestId("final-answer-input").fill("Правильный ответ");
    await page.getByTestId("final-answer-submit").click();

    // третий игрок отвечает неверно
    await expect(page.getByText("Очередь игрока Игрок 3")).toBeVisible();
    await page.getByTestId("final-ready-btn").click();
    await page.getByTestId("final-answer-input").fill("Совсем не тот ответ");
    await page.getByTestId("final-answer-submit").click();

    await expect(page.getByText("Итоги финала")).toBeVisible();
    await page.getByTestId("reveal-next-btn").click();
    await page.getByTestId("reveal-next-btn").click();
    await page.getByTestId("reveal-correct-btn").click();
    await expect(
      page.getByText("Правильный ответ: Правильный ответ"),
    ).toBeVisible();
    await page.getByTestId("finish-game-btn").click();
    await expect(page).toHaveURL("/results");
    // первый чел должен победить
    await expect(page.getByText("Победитель")).toBeVisible();
    await expect(page.locator("h1", { hasText: "Игрок 1" })).toBeVisible();
    await expect(page.getByText("150 баллов")).toBeVisible();
  });
});

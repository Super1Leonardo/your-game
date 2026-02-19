import { test, expect } from "@playwright/test";

test.describe("Game board tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/setup");
    await page.getByTestId("input-1").fill("Игрок 1");
    await page.getByTestId("input-2").fill("Игрок 2");
    await page.getByTestId("input-3").fill("Игрок 3");
    await page.getByTestId("setup-continue-button").click();

    await expect(page).toHaveURL("/game");
  });

  test("1. Cat right question logic", async ({ page }) => {
    await page.getByTestId("dev-mode-switch").click();
    await page.locator("button", { hasText: "Кот в мешке" }).first().click();
    await expect(page).toHaveURL("/question");
    await page.getByRole("combobox").click();
    await page.getByText("Игрок 2", { exact: true }).click();
    await page.getByTestId("cat-confirm-button").click();
    await page.getByTestId("cat-to-bet-button").click();
    await page.getByTestId("cat-bet-500").click();
    await expect(page.getByText("Отвечает: Игрок 2")).toBeVisible();
    const correctAnswer = await page.getByTestId("question-answer").innerText();
    const input = page.getByTestId("question-input");
    await input.waitFor({ state: "visible" });
    await input.fill(correctAnswer);
    await page.getByTestId("question-submit").click();
    await expect(page.getByTestId("success-answer-500")).toBeVisible();
    await expect(page).toHaveURL("/game");
    await expect(page.getByTestId("player-score").nth(1)).toHaveText("500");
  });
});

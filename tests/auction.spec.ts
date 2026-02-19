import { test, expect } from "@playwright/test";

test.describe("Auction tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/setup");
    await page.getByTestId("input-1").fill("Игрок 1");
    await page.getByTestId("input-2").fill("Игрок 2");
    await page.getByTestId("input-3").fill("Игрок 3");
    await page.getByTestId("setup-continue-button").click();
    await expect(page).toHaveURL("/game");
    await page.getByTestId("dev-mode-switch").click();
  });

  test("1. Auction right question logic", async ({ page }) => {
    for (let i = 1; i < 10; i++) {
      await page.getByRole("button", { name: "Добавить 100" }).first().click();
      await page.getByRole("button", { name: "Добавить 100" }).nth(1).click();
      await page.getByRole("button", { name: "Добавить 100" }).nth(2).click();
    }
    await page.locator("button", { hasText: "Аукцион" }).first().click();
    await expect(page).toHaveURL("/question");
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 1"
    );
    const input = page.getByTestId("auction-input");
    const confirm = page.getByTestId("auction-confirm");
    const bet = await page.getByTestId("min-bet").innerHTML();
    await input.fill(bet);
    await confirm.click();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 2"
    );
    await page.pause();
    await page.getByTestId("auction-skip").click();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 3"
    );
    await input.fill(`${Number(bet) + 100}`);
    await confirm.click();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 1"
    );
    await page.getByTestId("auction-skip").click();
    await expect(page.getByTestId("active-player")).toHaveText(
      "Отвечает: Игрок 3"
    );
    const answer = await page.getByTestId("question-answer").innerHTML();
    await page.getByTestId("question-input").fill(answer);
    await page.getByTestId("question-submit").click();
    await expect(page).toHaveURL("/game");
    await expect(
      page.getByTestId(`success-answer-${Number(bet) + 100}`)
    ).toBeVisible();
    await expect(page.getByTestId("player-score").nth(2)).toHaveText(
      `${Number(bet) + 1000}`
    );
  });
});

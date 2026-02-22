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
    for (let i = 1; i < 10; i++) {
      await page.getByRole("button", { name: "Добавить 100" }).first().click();
      await page.getByRole("button", { name: "Добавить 100" }).nth(1).click();
      await page.getByRole("button", { name: "Добавить 100" }).nth(2).click();
    }
  });

  test("1. Auction right question logic", async ({ page }) => {
    await page.locator("button", { hasText: "Аукцион" }).first().click();
    await expect(page).toHaveURL("/question");
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 1",
    );
    const input = page.getByTestId("auction-input");
    const confirm = page.getByTestId("auction-confirm-btn");
    const bet = await page.getByTestId("min-bet").innerHTML();
    await input.fill(bet);
    await confirm.click();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 2",
    );
    await page.getByTestId("auction-skip-btn").click();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 3",
    );
    await input.fill(`${Number(bet) + 100}`);
    await confirm.click();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 1",
    );
    await page.getByTestId("auction-skip-btn").click();
    await expect(page.getByTestId("active-player")).toHaveText(
      "Отвечает: Игрок 3",
    );
    const answer = await page.getByTestId("question-answer").innerHTML();
    await page.getByTestId("question-input").fill(answer);
    await page.getByTestId("question-submit").click();
    await expect(page).toHaveURL("/game");
    await expect(
      page.getByTestId(`success-answer-${Number(bet) + 100}`),
    ).toBeVisible();
    await expect(page.getByTestId("player-score").nth(2)).toHaveText(
      `${Number(bet) + 1000}`,
    );
  });
  test("2. All-in mode", async ({ page }) => {
    await page.getByRole("button", { name: "Убрать 100" }).first().click();
    await page.getByRole("button", { name: "Аукцион" }).first().click();
    await expect(page).toHaveURL("/question");
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 1",
    );
    await page.getByTestId("allin-btn").click();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 2",
    );
    await expect(page.getByTestId("allin-badge")).toBeVisible();
    const input = page.getByTestId("auction-input");
    const confirm = page.getByTestId("auction-confirm-btn");
    const skip = page.getByTestId("auction-skip-btn");
    await input.fill("500");
    await confirm.click();
    await expect(page.getByTestId("allin-notification")).toBeVisible();
    await input.fill("900");
    await confirm.click();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 3",
    );
    await skip.click();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 1",
    );
    await skip.click();
    const answer = await page.getByTestId("question-answer").innerHTML();
    await page.getByTestId("question-input").fill(answer);
    await page.getByTestId("question-submit").click();
    await expect(page).toHaveURL("/game");
    await expect(page.getByTestId(`success-answer-900`)).toBeVisible();
    await expect(page.getByTestId("player-score").nth(1)).toHaveText("1800");
  });
  test("3. Invalid bets", async ({ page }) => {
    await page.locator("button", { hasText: "Аукцион" }).first().click();
    await expect(page).toHaveURL("/question");
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 1",
    );
    const input = page.getByTestId("auction-input");
    const confirm = page.getByTestId("auction-confirm-btn");
    const minBet = await page.getByTestId("min-bet").innerText();
    await input.fill(`${Number(minBet) - 50}`); // меньше минимальной
    await confirm.click();
    await expect(page.getByText(`Минимальная ставка: ${minBet}`)).toBeVisible();

    await input.fill("50000"); // больше чем есть на счету
    await confirm.click();
    await expect(page.getByText("У вас нет столько баллов!")).toBeVisible();
    await expect(page.getByTestId("auction-active-player")).toHaveText(
      "Игрок 1",
    );
  });

  test("4. Wrong answer logic", async ({ page }) => {
    await page.locator("button", { hasText: "Аукцион" }).first().click();
    await expect(page).toHaveURL("/question");

    const input = page.getByTestId("auction-input");
    const confirm = page.getByTestId("auction-confirm-btn");
    const betText = await page.getByTestId("min-bet").innerText();
    const bet = Number(betText);

    await input.fill(`${bet}`);
    await confirm.click();

    await page.getByTestId("auction-skip-btn").click();
    await page.getByTestId("auction-skip-btn").click();
    await expect(page.getByTestId("active-player")).toHaveText(
      "Отвечает: Игрок 1",
    );

    // игрок 1 дает неверный ответ
    await page.getByTestId("question-input").fill("неверный ответ");
    await page.getByTestId("question-submit").click();

    await expect(page).toHaveURL("/game");
    await expect(page.getByTestId(`wrong-answer-${bet}`)).toBeVisible();

    const expectedScore = 900 - bet;
    await expect(page.getByTestId("player-score").first()).toHaveText(
      `${expectedScore}`,
    );
  });
});

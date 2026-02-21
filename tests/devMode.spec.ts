import { test, expect } from "@playwright/test";

test.describe("Dev Mode tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/setup");
    await page.getByTestId("input-1").fill("Игрок 1");
    await page.getByTestId("input-2").fill("Игрок 2");
    await page.getByTestId("input-3").fill("Игрок 3");
    await page.getByTestId("setup-continue-button").click();
    await expect(page).toHaveURL("/game");
    await page.getByTestId("dev-mode-switch").click();
  });

  test("1. Dev mode toggles buttons and reveals special questions on board", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Добавить 100" }).first().click();
    await expect(page.getByTestId("player-score").first()).toHaveText("100");
    await expect(page.getByText("Кот в мешке", { exact: true })).toHaveCount(2);
    await expect(page.getByText("Аукцион", { exact: true })).toHaveCount(2);
  });

  test("2. Dev mode reveals correct answer and special buttons on question page", async ({
    page,
  }) => {
    await page.evaluate(() => {
      // первый вопрос принудительно дефорлтный
      const stateRaw = localStorage.getItem("igra-state");
      if (stateRaw) {
        const state = JSON.parse(stateRaw);
        if (state.round1Themes[0] && state.round1Themes[0].questions[0]) {
          state.round1Themes[0].questions[0].type = "normal";
          localStorage.setItem("igra-state", JSON.stringify(state));
        }
      }
    });
    await page.reload();
    await page
      .getByRole("button", { name: "100", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL("/question");
    const answerElement = page.getByTestId("question-answer");
    await expect(answerElement).toBeVisible();
    await expect(answerElement).not.toBeEmpty();
    await expect(page.getByText("Пауза")).toBeVisible();
    await expect(page.getByText("Закрыть вопрос")).toBeVisible();
    await expect(page.getByText("Пропустить вопрос")).toBeVisible();
  });
});

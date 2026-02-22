import { test, expect } from "@playwright/test";

test.describe("Question tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/setup");
    await page.getByTestId("input-1").fill("Игрок 1");
    await page.getByTestId("input-2").fill("Игрок 2");
    await page.getByTestId("input-3").fill("Игрок 3");
    await page.getByTestId("setup-continue-button").click();

    await expect(page).toHaveURL("/game");
    await page.evaluate(() => {
      // защита чтобы первый вопрос был дефолтным
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
    await expect(
      page.getByText("Нажмите свою клавишу для ответа..."),
    ).toBeVisible();
  });
  test("1. Right answer logic", async ({ page }) => {
    await page.keyboard.press("a");
    await page.getByTestId("dev-mode-switch").click();
    await expect(page.getByText("Отвечает Игрок 1")).toBeVisible();
    await page
      .getByTestId("question-input")
      .fill(await page.getByTestId("question-answer").innerHTML());
    await page.getByTestId("question-submit").click();
    await expect(page).toHaveURL("/game");
    await expect(page.getByTestId("player-score").first()).toHaveText("100");
  });

  test("2. Wrong answer logic", async ({ page }) => {
    await page.keyboard.press("a");
    await expect(page.getByText("Отвечает Игрок 1")).toBeVisible();
    await page.getByTestId("question-input").fill("AAAAAAAA");
    await page.getByTestId("question-submit").click();
    await page.keyboard.press(" ");
    await page.pause();
    await expect(page.getByText("Отвечает Игрок 2")).toBeVisible();
    await page.getByTestId("question-input").fill("HTML");
    await page.getByTestId("question-submit").click();
    await expect(page).toHaveURL("/game");
    await expect(page.getByTestId("wrong-answer-100")).toBeVisible();
    await expect(page.getByTestId("success-answer-100")).toBeVisible();
    await expect(page.getByTestId("player-score").first()).toHaveText("-100");
    await expect(page.getByTestId("player-score").nth(1)).toHaveText("100");
  });

  test("3. Time out logic", async ({ page }) => {
    await page.clock.install();
    await page.clock.fastForward(31000);
    await expect(page).toHaveURL("/game", { timeout: 32000 });
    await expect(page.getByTestId("player-score").first()).toHaveText("0");
    await expect(page.getByTestId("player-score").nth(1)).toHaveText("0");
    await expect(page.getByTestId("player-score").nth(2)).toHaveText("0");
  });
});

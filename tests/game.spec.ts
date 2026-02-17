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

  test("1. Render board and players", async ({ page }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("Раунд 1");
    await expect(heading).toBeVisible();
    expect(
      await page.getByRole("button", { name: "100", exact: true }).count()
    ).toBe(6);
    expect(
      await page.getByRole("button", { name: "200", exact: true }).count()
    ).toBe(6);
    expect(
      await page.getByRole("button", { name: "300", exact: true }).count()
    ).toBe(6);
    expect(
      await page.getByRole("button", { name: "400", exact: true }).count()
    ).toBe(6);
    expect(
      await page.getByRole("button", { name: "500", exact: true }).count()
    ).toBe(6);
  });
  test("2. Dev mode toggles buttons and special questions", async ({
    page,
  }) => {
    await page.getByLabel("Режим разработчика").click();
    await page.getByRole("button", { name: "+100" }).first().click();
    await expect(page.getByTestId("player-score").first()).toHaveText("100");
    await expect(page.getByText("cat", { exact: true })).toHaveCount(2);
    await expect(page.getByText("auction", { exact: true })).toHaveCount(2);
  });
  test("3. State doesn't change after reload", async ({ page }) => {
    await page.getByLabel("Режим разработчика").click();
    await page.getByRole("button", { name: "+100" }).first().click();
    await page.reload();
    await expect(page).toHaveURL("/game");
    await expect(page.getByTestId("player-score").first()).toHaveText("100");
  });
  test("4. Correct redirecting to /question", async ({ page }) => {
    await page
      .getByRole("button", { name: "100", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL("/question");
  });
  test("5. Render board and nominals for Round 2", async ({ page }) => {
    await page.evaluate(() => {
      // меняем local storage
      const stateRaw = localStorage.getItem("igra-state");
      if (stateRaw) {
        const state = JSON.parse(stateRaw);
        state.phase = "round2";
        localStorage.setItem("igra-state", JSON.stringify(state));
      }
    });

    await page.reload();

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toHaveText("Раунд 2");

    expect(
      await page.getByRole("button", { name: "200", exact: true }).count()
    ).toBe(6);
    expect(
      await page.getByRole("button", { name: "400", exact: true }).count()
    ).toBe(6);
    expect(
      await page.getByRole("button", { name: "600", exact: true }).count()
    ).toBe(6);
    expect(
      await page.getByRole("button", { name: "800", exact: true }).count()
    ).toBe(6);
    expect(
      await page.getByRole("button", { name: "1000", exact: true }).count()
    ).toBe(6);
  });
  test("6. Active player indication", async ({ page }) => {
    const activePlayer = page.getByTestId("active-player");
    await expect(activePlayer).toBeVisible();
    await expect(activePlayer).toContainText("Игрок 1");
  });

  test("7. Played questions become disabled", async ({ page }) => {
    await page.evaluate(() => {
      const stateRaw = localStorage.getItem("igra-state");
      if (stateRaw) {
        const state = JSON.parse(stateRaw);
        state.round1Themes[0].questions[0].isPlayed = true;
        localStorage.setItem("igra-state", JSON.stringify(state));
      }
    });
    await page.reload();

    const playedButton = page
      .getByRole("button", { name: "100", exact: true })
      .first();
    await expect(playedButton).toBeDisabled();
  });

  test("8. Round completion screen", async ({ page }) => {
    await page.evaluate(() => {
      const stateRaw = localStorage.getItem("igra-state");
      if (stateRaw) {
        const state = JSON.parse(stateRaw);
        state.round1Themes.forEach((t: any) =>
          t.questions.forEach((q: any) => (q.isPlayed = true))
        );
        localStorage.setItem("igra-state", JSON.stringify(state));
      }
    });
    await page.reload();
    await page.pause();
    await expect(page.getByTestId("round-complete")).toHaveText(
      "Раунд завершен!"
    );
    await expect(
      page.getByRole("button", { name: "Перейти ко 2 раунду" })
    ).toBeVisible();
  });
});

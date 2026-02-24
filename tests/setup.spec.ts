import { test, expect } from "@playwright/test";

test.describe("Setup tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/setup");
  });

  test("1. Setup test 1", async ({ page }) => {
    await expect(page.getByText("Клавиша: A")).toBeVisible();
    await expect(page.getByText("Клавиша: L")).toBeVisible();
    await expect(page.getByText("Клавиша: Пробел")).toBeVisible();
  });

  test("2. Too long name", async ({ page }) => {
    for (let i = 1; i <= 3; i++) {
      await page.getByTestId(`input-${i}`).fill(`Игрок ${i}`);
    }

    for (let i = 1; i <= 3; i++) {
      const input = page.getByTestId(`input-${i}`);
      await input.fill("АААААААААААААААА");
      await page.getByTestId("setup-continue-button").click();

      const toast = page
        .getByTestId("setup-long-name-alert")
        .filter({ hasText: "Имя слишком длинное (максимум 15 символов)!" })
        .first();
      await expect(toast).toBeVisible();

      await input.fill(`Игрок ${i}`);
    }
  });

  test("3. Empty input", async ({ page }) => {
    await page.getByTestId("input-1").fill("");
    await page.getByTestId("input-2").fill(" ");
    await page.getByTestId("input-3").fill("  ");
    await page.getByTestId("setup-continue-button").click();

    const toast = page
      .getByTestId("setup-empty-name-alert")
      .filter({ hasText: "Все имена должны быть заполнены!" })
      .first();
    await expect(toast).toBeVisible();
  });

  test("4. Redirect to game", async ({ page }) => {
    await page.getByTestId("input-1").fill("Игрок 1");
    await page.getByTestId("input-2").fill("Игрок 2");
    await page.getByTestId("input-3").fill("Игрок 3");
    await page.getByTestId("setup-continue-button").click();
    await expect(page).toHaveURL("/game");
  });
});

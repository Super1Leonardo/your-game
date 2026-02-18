import { test, expect } from "@playwright/test";

test.describe("Question tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/setup");
    await page.getByTestId("input-1").fill("Игрок 1");
    await page.getByTestId("input-2").fill("Игрок 2");
    await page.getByTestId("input-3").fill("Игрок 3");
    await page.getByTestId("setup-continue-button").click();

    await expect(page).toHaveURL("/game");
    await page
      .getByRole("button", { name: "100", exact: true })
      .first()
      .click();
    await expect(page).toHaveURL("/question");
  });
  test("1. Right answer logic", async ({ page }) => {
    await page.keyboard.press("a");
    await expect(page.getByText("Отвечает: Игрок 1")).toBeVisible();
  });
});

const { test, expect } = require("@playwright/test");

test("article transition matches its title and survives back navigation", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    addEventListener("pagereveal", (event) => {
      if (!event.viewTransition) return;
      event.viewTransition.ready
        .then(() => {
          window.transitionReady = true;
        })
        .catch((error) => {
          window.transitionError = error.message;
        });
    });
  });
  await page.goto("/");
  const title = page.getByRole("link", {
    name: "Looking inside a model",
    exact: true,
  });
  await title.click();
  await expect(page).toHaveURL(/\/posts\/looking-inside-a-model\/$/);
  await expect
    .poll(() => page.evaluate(() => window.transitionReady))
    .toBe(true);
  expect(await page.evaluate(() => window.transitionError)).toBeUndefined();
  await expect(page.locator(".post .prose")).toBeVisible();
  await page.goBack();
  await expect(title).toBeVisible();
  await expect
    .poll(() => page.locator('.post-list h3[style*="article-title"]').count())
    .toBe(0);
  await title.click();
  await expect(page.locator(".post-header h1")).toHaveText(
    "Looking inside a model",
  );
  expect(errors).toEqual([]);
});

test("search can close during its entrance and reopen with keyboard focus", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Search articles" });
  await opener.click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(opener).toBeFocused();
  await opener.click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.getByRole("button", { name: "Close search" }).click();
  await expect(opener).toBeFocused();
});

test("reduced motion opens and closes search without animations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Search articles" }).click();
  expect(
    await page.locator("dialog").evaluate((el) => el.getAnimations().length),
  ).toBe(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

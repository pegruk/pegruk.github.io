const { test, expect } = require("@playwright/test");
test("search finds article bodies, titles, multiple words and empty results", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search articles" }).click();
  const input = page.getByRole("searchbox");
  await input.fill("intervention");
  await expect(page.locator("#search-results a")).toHaveText([
    "Looking inside a model",
  ]);
  await input.fill("SMALL api");
  await expect(page.locator("#search-results a")).toHaveText([
    "Notes from building a small API",
  ]);
  await input.fill("prédiction");
  await expect(page.locator("#search-results a")).toHaveText([
    "Looking inside a model",
  ]);
  await input.fill("nonexistentword");
  await expect(page.getByRole("status")).toContainText("No articles found");
  await input.fill("");
  await expect(page.getByRole("status")).toContainText("Type to search");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Search articles" }),
  ).toBeFocused();
});
test("search recovers from a failed index request", async ({ page }) => {
  await page.route("**/search.json", (route) =>
    route.fulfill({ status: 503, body: "" }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Search articles" }).click();
  await expect(page.getByRole("status")).toContainText("could not load");
  await page.unroute("**/search.json");
  await page.getByRole("button", { name: "Try again" }).click();
  await page.getByRole("searchbox").fill("model");
  await expect(page.locator("#search-results a")).toHaveCount(1);
});
test("categories filter and reset; theme persists", async ({ page }) => {
  await page.goto("/");
  const articleCount = await page.locator(".post-list li:visible").count();
  await page.getByRole("link", { name: "Categories", exact: true }).click();
  await expect(page).toHaveURL(/\/categories\/$/);
  await page
    .locator(".category-list")
    .getByRole("link", { name: "Backend development 1 post" })
    .click();
  await expect(page.locator(".post-list li:visible")).toHaveCount(1);
  await page.locator("#filter-status a").click();
  await expect(page.locator(".post-list li:visible")).toHaveCount(articleCount);
  await page.emulateMedia({ colorScheme: "light" });
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
test("technical articles render and respect reduced motion on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/posts/looking-inside-a-model/");
  await expect(page.locator("h1")).toHaveText("Looking inside a model");
  await expect(page.locator(".katex").first()).toBeVisible();
  await expect(page.locator('link[href*="katex.min.css"]')).toHaveCount(1);
  await expect(page.locator("pre .token").first()).toBeVisible();
  expect(
    await page
      .locator(".post-header")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "/tmp/pegruk-article-mobile.png",
    fullPage: true,
  });
});
test("article content is available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/posts/looking-inside-a-model/`);
  await expect(
    page.getByRole("heading", { name: "From predictions to mechanisms" }),
  ).toBeVisible();
  await context.close();
});
test("desktop visual review", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({ path: "/tmp/pegruk-home-light.png", fullPage: true });
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.screenshot({ path: "/tmp/pegruk-home-dark.png", fullPage: true });
});

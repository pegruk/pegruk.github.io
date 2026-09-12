const { test, expect } = require("@playwright/test");

test("title travels from its card before the article text fades in", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const result = animate.apply(this, args);
      if (
        this.matches(
          ".traveling-title, .post-meta, .demo-label, .post .prose, .back-link",
        )
      ) {
        result.pause();
        result.currentTime = 0;
      }
      return result;
    };
  });
  await page.goto("/");
  const title = page.getByRole("link", {
    name: "Notes from building a small API",
    exact: true,
  });
  const source = await title.locator("..").boundingBox();
  await title.click();
  await expect(page).toHaveURL(/\/posts\/a-small-api\/$/);
  const movingTitle = page.locator(".traveling-title");
  await expect(movingTitle).toBeVisible();
  expect((await movingTitle.boundingBox()).y).toBeCloseTo(source.y, 0);
  await expect(page.locator(".post .prose")).toHaveCSS("opacity", "0");
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => {
      a.currentTime = 400;
    }),
  );
  const halfway = (await movingTitle.boundingBox()).y;
  const destination = await page
    .locator(".post-header h1")
    .evaluate((el) => el.getBoundingClientRect().top);
  expect(halfway).toBeLessThan(source.y);
  expect(halfway).toBeGreaterThan(destination);
  await expect(page.locator(".post .prose")).toHaveCSS("opacity", "0");
  await page.screenshot({ path: "/tmp/blog-title-moving.png" });
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => {
      a.currentTime = 900;
    }),
  );
  const opacity = await page
    .locator(".post .prose")
    .evaluate((el) => Number(getComputedStyle(el).opacity));
  expect(opacity).toBeGreaterThan(0);
  expect(opacity).toBeLessThan(1);
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => a.finish()),
  );
  await expect(movingTitle).toHaveCount(0);
  await expect(page.locator(".post .prose")).toHaveCSS("opacity", "1");
  await page.goBack();
  await expect(title).toBeVisible();
  await expect(page.locator(".traveling-title")).toHaveCount(0);
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

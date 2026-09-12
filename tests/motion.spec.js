const { test, expect } = require("@playwright/test");

for (const [label, path] of [
  ["About me", "/about/"],
  ["Categories", "/categories/"],
]) {
  test(`${label} moves its navigation label into the page title before revealing content`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const original = Element.prototype.animate;
      Element.prototype.animate = function (...args) {
        const animation = original.apply(this, args);
        if (this.matches(".traveling-title, [data-motion-content]")) {
          animation.pause();
          animation.currentTime = 0;
        }
        return animation;
      };
    });
    await page.goto("/");
    const link = page.getByRole("link", { name: label, exact: true });
    const source = await link.boundingBox();
    await link.click();
    await expect(page).toHaveURL(path);
    const moving = page.locator(".traveling-title");
    await expect(moving).toHaveText(label);
    expect((await moving.boundingBox()).x).toBeCloseTo(source.x, 0);
    await expect(page.locator("[data-motion-content]")).toHaveCSS(
      "opacity",
      "0",
    );
    await page.evaluate(() =>
      document.getAnimations().forEach((a) => {
        a.currentTime = 400;
      }),
    );
    expect((await moving.boundingBox()).x).toBeLessThan(source.x);
    await expect(page.locator("[data-motion-content]")).toHaveCSS(
      "opacity",
      "0",
    );
    await page.evaluate(() =>
      document.getAnimations().forEach((a) => a.finish()),
    );
    await expect(page.locator("[data-motion-title]")).toBeVisible();
    await expect(page.locator("[data-motion-content]")).toHaveCSS(
      "opacity",
      "1",
    );
    await page.reload();
    await expect(page.locator("[data-motion-title]")).toBeVisible();
    await expect(moving).toHaveCount(0);
  });
}

test("a category name moves into its category page title", async ({ page }) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const animation = original.apply(this, args);
      if (this.matches(".traveling-title, [data-motion-content]")) {
        animation.pause();
        animation.currentTime = 0;
      }
      return animation;
    };
  });
  await page.goto("/categories/");
  const link = page.getByRole("link", { name: "Backend development 1 post" });
  const source = await link.boundingBox();
  await link.click();
  await expect(page).toHaveURL("/categories/backend-development/");
  const moving = page.locator(".traveling-title");
  await expect(moving).toHaveText("Backend development");
  expect((await moving.boundingBox()).x).toBeCloseTo(source.x, 0);
  await expect(page.locator("[data-motion-content]")).toHaveCSS("opacity", "0");
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => a.finish()),
  );
  await expect(page.locator("[data-motion-title]")).toHaveText(
    "Backend development",
  );
  await expect(page.locator(".post-list li")).toHaveCount(1);
});

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
  await title.scrollIntoViewIfNeeded();
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

test("back to all posts returns the article title to its card", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const result = animate.apply(this, args);
      if (this.matches(".traveling-title, .home-welcome, .writing")) {
        result.pause();
        result.currentTime = 0;
      }
      return result;
    };
  });
  await page.goto("/posts/a-small-api/");
  const source = await page.locator(".post-header h1").boundingBox();
  await page.getByRole("link", { name: "Back to all posts" }).click();
  await expect(page).toHaveURL(/\/$/);
  const moving = page.locator(".traveling-title");
  await expect(moving).toHaveText("Notes from building a small API");
  expect((await moving.boundingBox()).y).toBeCloseTo(source.y, 0);
  await expect(page.locator(".writing")).toHaveCSS("opacity", "0");
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => {
      a.currentTime = 500;
    }),
  );
  const targetY = await page
    .locator(".post-list .post-title", {
      hasText: "Notes from building a small API",
    })
    .locator("..")
    .evaluate((el) => el.getBoundingClientRect().top);
  expect((await moving.boundingBox()).y).toBeLessThan(targetY);
  expect((await moving.boundingBox()).y).toBeGreaterThan(source.y);
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => a.finish()),
  );
  await expect(moving).toHaveCount(0);
  await expect(page.locator(".writing")).toHaveCSS("opacity", "1");
});

test("category all-posts link moves into the home heading", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const result = animate.apply(this, args);
      if (this.matches(".traveling-title, .home-welcome, .writing")) {
        result.pause();
        result.currentTime = 0;
      }
      return result;
    };
  });
  await page.goto("/categories/backend-development/");
  const source = await page
    .getByRole("link", { name: "All posts", exact: true })
    .boundingBox();
  await page.getByRole("link", { name: "All posts", exact: true }).click();
  await expect(page).toHaveURL("/");
  const moving = page.locator(".traveling-title");
  await expect(moving).toHaveText("All posts");
  expect((await moving.boundingBox()).y).toBeCloseTo(source.y, 0);
  await page.evaluate(() =>
    document.getAnimations().forEach((animation) => animation.finish()),
  );
  await expect(page.locator("#writing-title")).toBeVisible();
});

test("search results use the article title transition", async ({ page }) => {
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      const result = animate.apply(this, args);
      if (this.matches(".traveling-title")) {
        result.pause();
        result.currentTime = 0;
      }
      return result;
    };
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Search articles" }).click();
  await page.getByRole("searchbox").fill("small api");
  const result = page.locator("#search-results").getByRole("link", {
    name: "Notes from building a small API",
    exact: true,
  });
  await result.click();
  await expect(page).toHaveURL("/posts/a-small-api/");
  await expect(page.locator(".traveling-title")).toHaveText(
    "Notes from building a small API",
  );
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

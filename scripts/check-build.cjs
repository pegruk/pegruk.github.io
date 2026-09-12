const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "pegruk-build-"));
try {
  fs.cpSync("src", path.join(temp, "src"), { recursive: true });
  fs.cpSync("scripts", path.join(temp, "scripts"), { recursive: true });
  fs.copyFileSync("eleventy.config.js", path.join(temp, "eleventy.config.js"));
  fs.symlinkSync(
    path.resolve("node_modules"),
    path.join(temp, "node_modules"),
    "dir",
  );
  fs.writeFileSync(
    path.join(temp, "src/posts/published.md"),
    "---\ntitle: Published fixture\ndate: 2026-09-12\ncategories: [Testing]\n---\nSearchable body sentinel.",
  );
  fs.writeFileSync(
    path.join(temp, "src/posts/draft.md"),
    "---\ntitle: Draft fixture\ndate: 2026-09-12\ndraft: true\n---\nSecret draft sentinel.",
  );
  const run = (file, env) =>
    execFileSync(process.execPath, [file], {
      cwd: temp,
      env: { ...process.env, ...env },
      stdio: "pipe",
    });
  run("node_modules/@11ty/eleventy/cmd.cjs", {
    ELEVENTY_ENV: "development",
    PATH_PREFIX: "/blog/",
  });
  const previewIndex = JSON.parse(
    fs.readFileSync(path.join(temp, "_site/search.json")),
  );
  assert(
    fs.existsSync(
      path.join(temp, "_site/posts/looking-inside-a-model/index.html"),
    ),
  );
  run("scripts/build.cjs", { PATH_PREFIX: "/blog/" });
  assert(
    fs.existsSync(
      path.join(temp, "_site/posts/looking-inside-a-model/index.html"),
    ),
  );
  assert(!fs.existsSync(path.join(temp, "_site/posts/draft/index.html")));
  const index = JSON.parse(
    fs.readFileSync(path.join(temp, "_site/search.json")),
  );
  assert.deepEqual(
    index.map((article) => article.url).sort(),
    previewIndex.map((article) => article.url).sort(),
  );
  const published = index.find((article) =>
    article.text.includes("Searchable body sentinel"),
  );
  assert.equal(published.url, "/blog/posts/published/");
  const html = fs.readFileSync(
    path.join(temp, "_site/posts/published/index.html"),
    "utf8",
  );
  assert(html.includes("/blog/assets/style.css"));
  assert(html.includes("/blog/assets/app.js"));
  const categories = fs.readFileSync(
    path.join(temp, "_site/categories/index.html"),
    "utf8",
  );
  assert(categories.includes("/blog/categories/testing/"));
  assert(categories.includes("1 post"));
  const categoryPage = fs.readFileSync(
    path.join(temp, "_site/categories/testing/index.html"),
    "utf8",
  );
  assert(categoryPage.includes("Published fixture"));
  assert(categoryPage.includes("/blog/posts/published/"));
  const about = fs.readFileSync(
    path.join(temp, "_site/about/index.html"),
    "utf8",
  );
  assert(about.includes("data-motion-title"));
  assert(about.includes("About me"));
  assert(about.includes("/blog/categories/"));
  assert(html.includes("/blog/assets/katex/katex.min.css"));
  assert(fs.existsSync(path.join(temp, "_site/assets/katex/katex.min.css")));
  run("scripts/build.cjs", { PATH_PREFIX: "/" });
  const rootIndex = JSON.parse(
    fs.readFileSync(path.join(temp, "_site/search.json")),
  );
  assert.equal(
    rootIndex.find((article) =>
      article.text.includes("Searchable body sentinel"),
    ).url,
    "/posts/published/",
  );
  console.log(
    "Production exclusion, clean rebuild, article output, and root/subpath checks passed.",
  );
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}

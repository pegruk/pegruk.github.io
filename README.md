# Pegruk’s blog

📖 **[Guia completo de uso em português](docs/GUIA-DE-USO.md)** — do primeiro artigo à publicação no GitHub Pages.

A small static blog with Markdown articles, full-text browser search, category filtering, and light/dark themes. Eleventy generates the site; GitHub Pages serves the resulting files.

## Local preview

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:8080. The preview includes the articles in `src/posts/`. Only articles marked with `draft: true` are excluded from production.

```sh
npm run build
```

The production site is generated in `_site/`. Before you publish your first real article, the homepage shows “No posts yet.”

## Write a post

Create `src/posts/my-first-post.md`:

```markdown
---
title: My first post
date: 2026-09-12
categories: [Mechanistic interpretability]
description: A short description for search engines and link previews.
draft: false
---

Your writing goes here.
```

The filename determines the permanent URL: `/posts/my-first-post/`. Keep it unchanged after publishing to preserve links. Dates use `YYYY-MM-DD`; posts appear newest first. Categories are an array of names and populate the Categories menu automatically. Use `draft: true` to exclude a post from all generated pages and search. Future dates are not a scheduling mechanism.

Use ordinary Markdown for links, images, tables, and fenced code blocks with a language name. Use `[^1]` and a corresponding footnote definition for footnotes. Inline math uses `$y = Wx + b$`; display equations use `$$` on separate lines. Prism highlights code and KaTeX renders equations during the build.

Place images in `src/assets/`. For links that work both at the domain root and under a GitHub repository path, use Eleventy’s URL filter:

```markdown
![An informative description]({{ '/assets/my-diagram.png' | url }})
```

The Markdown renderer accepts HTML, so only add content you trust. Search automatically indexes published titles and article bodies; no external service or manual index updates are needed.

## Personalize

Edit `src/_data/site.json` to change the name and default description. Edit `src/about.md` for your biography and real project/contact links. Edit `src/assets/style.css` to adjust typography, spacing, and theme colors.

## Publish on GitHub Pages

1. Create a GitHub repository and push this repository’s `main` branch to it.
2. In repository **Settings → Pages**, select **GitHub Actions** as the build source.
3. Run the included **Deploy blog to GitHub Pages** workflow, or push a commit to `main`.

The workflow discovers the Pages base path and builds for either a user site or a project site. No secrets or application server are needed. A public repository is the default for free hosting. This project does not create a remote repository or publish automatically until you connect it.

To check a project-path build locally:

```sh
PATH_PREFIX=/blog/ npm run build
```

## Checks

```sh
npm test
npm run test:build
```

Browser tests cover search, recovery from loading failures, category filtering, themes, technical content, reduced motion, mobile overflow, and reading without JavaScript. By default they use `/usr/bin/chromium` when available; otherwise install Playwright’s browser with `npx playwright install chromium`. Set `CHROMIUM_PATH` to use a different executable.

Commits use Conventional Commits (`feat:`, `fix:`, `chore:`, `ci:`, `docs:`), grouped by completed changes.

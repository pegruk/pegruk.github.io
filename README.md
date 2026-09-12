# Pegruk’s blog

A static personal blog about AI safety, mechanistic interpretability, and other things.

Built with Eleventy and published through GitHub Pages.

## Commands

- `npm run dev` starts the local site.
- `npm run build` generates the production site in `_site/`.
- `npm test` runs the browser tests.

## Post helper

Run `python3 scripts/blog.py` to open the interactive menu.

Use `python3 scripts/blog.py create "My new article"` to create a post and choose its category.

Use `python3 scripts/blog.py publish` to run the checks and generate the production site.

After reviewing the result, use `python3 scripts/blog.py commit "content: add my new article"` to create the Git commit.

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdown = require("markdown-it")({ html: true, typographer: true })
  .use(require("markdown-it-footnote"))
  .use(require("markdown-it-texmath"), {
    engine: require("katex"),
    delimiters: "dollars",
    katexOptions: { throwOnError: false },
  });
module.exports = function (config) {
  config.setLibrary("md", markdown);
  config.addPlugin(syntaxHighlight);
  config.addPassthroughCopy("src/assets");
  config.addPassthroughCopy({ "node_modules/katex/dist": "assets/katex" });
  config.addFilter("dateLabel", (date) =>
    new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(date)),
  );
  config.addFilter("isoDate", (date) =>
    new Date(date).toISOString().slice(0, 10),
  );
  config.addFilter("json", (value) => JSON.stringify(value));
  config.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("src/posts/*.md")
      .filter(
        (p) =>
          !p.data.draft &&
          (process.env.ELEVENTY_ENV !== "production" || !p.data.demo),
      )
      .sort((a, b) => b.date - a.date),
  );
  config.addCollection("categories", (api) =>
    [
      ...new Set(
        api
          .getFilteredByGlob("src/posts/*.md")
          .filter(
            (p) =>
              !p.data.draft &&
              (process.env.ELEVENTY_ENV !== "production" || !p.data.demo),
          )
          .flatMap((p) => p.data.categories || []),
      ),
    ].sort(),
  );
  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
    dir: { input: "src", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

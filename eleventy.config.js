const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { feedPlugin } = require("@11ty/eleventy-plugin-rss");
const site = require("./src/_data/site.json");
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
  config.addPlugin(feedPlugin, {
    type: "rss",
    outputPath: "/feed.xml",
    collection: { name: "feedPosts", limit: 20 },
    metadata: {
      language: "en",
      title: `${site.name}’s blog`,
      subtitle: site.description,
      base: new URL(process.env.PATH_PREFIX || "/", site.url).href,
      author: { name: site.name },
    },
  });
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
  config.addFilter("categorySlug", (value) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
  );
  config.addFilter("inCategory", (posts, category) =>
    posts.filter((post) => (post.data.categories || []).includes(category)),
  );
  config.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("src/posts/*.md")
      .filter((p) => !p.data.draft && true)
      .sort((a, b) => b.date - a.date),
  );
  // The RSS plugin reverses its source collection before taking the newest 20.
  config.addCollection("feedPosts", (api) =>
    api
      .getFilteredByGlob("src/posts/*.md")
      .filter((post) => !post.data.draft)
      .sort((a, b) => a.date - b.date),
  );
  config.addCollection("categories", (api) =>
    [
      ...new Set(
        api
          .getFilteredByGlob("src/posts/*.md")
          .filter((p) => !p.data.draft && true)
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

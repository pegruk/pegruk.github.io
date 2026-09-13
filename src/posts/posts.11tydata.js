module.exports = {
  layout: "post.njk",
  eleventyComputed: {
    permalink: (data) =>
      data.draft || (data.demo && process.env.ELEVENTY_ENV === "production")
        ? false
        : `/posts/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) =>
      !!data.draft || (data.demo && process.env.ELEVENTY_ENV === "production"),
  },
};

module.exports = {
  layout: 'post.njk',
  eleventyComputed: {
    permalink: data => data.draft || (process.env.ELEVENTY_ENV === 'production' && data.demo) ? false : `/posts/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: data => !!data.draft || (process.env.ELEVENTY_ENV === 'production' && !!data.demo)
  }
};

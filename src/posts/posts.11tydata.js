module.exports = {
  layout: 'post.njk',
  eleventyComputed: {
    permalink: data => data.draft ? false : `/posts/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: data => !!data.draft
  }
};

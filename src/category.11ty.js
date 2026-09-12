const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

module.exports = class {
  data() {
    return {
      layout: "page.njk",
      pagination: {
        data: "collections.categories",
        size: 1,
        alias: "category",
      },
      eleventyComputed: {
        title: (data) => data.category,
        description: (data) => `Articles about ${data.category}.`,
        permalink: (data) => `/categories/${slugify(data.category)}/`,
      },
    };
  }

  render({ category, collections }) {
    const prefix = (process.env.PATH_PREFIX || "/").replace(/\/$/, "");
    const url = (path) => `${prefix}${path}`;
    const posts = collections.posts.filter((post) =>
      post.data.categories?.includes(category),
    );
    const cards = posts
      .map((post) => {
        const title = escapeHtml(post.data.title);
        const description = post.data.description
          ? `<p class="post-excerpt">${escapeHtml(post.data.description)}</p>`
          : "";
        const date = new Intl.DateTimeFormat("en", {
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }).format(post.date);
        return `<li><h3><a class="post-title" href="${url(post.url)}">${title}</a></h3>${description}<div class="card-meta"><time datetime="${post.date.toISOString().slice(0, 10)}">${date}</time><span class="post-category">${escapeHtml(category)}</span></div></li>`;
      })
      .join("");
    return `<p class="categories-description">${posts.length} ${posts.length === 1 ? "post" : "posts"} in this category.</p><ul class="post-list">${cards}</ul><a class="back-link" href="${url("/")}">All posts</a>`;
  }
};

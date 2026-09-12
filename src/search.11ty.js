module.exports = class {
  data() { return { permalink: '/search.json', eleventyExcludeFromCollections: true }; }
  render({ collections }) {
    const prefix = (process.env.PATH_PREFIX || '/').replace(/\/$/, '');
    return JSON.stringify(collections.posts.map(p => ({ title: p.data.title, url: prefix + p.url, categories: p.data.categories || [], text: p.templateContent.replace(/<[^>]*>/g, ' ').replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g, entity => ({'&nbsp;':' ','&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[entity])).replace(/\s+/g, ' ').trim() })));
  }
};

(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const themeButton = document.querySelector("#theme-toggle");
  const systemTheme = matchMedia("(prefers-color-scheme: dark)");
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === "dark" : systemTheme.matches;
  const updateThemeLabel = () =>
    themeButton.setAttribute(
      "aria-label",
      `Switch to ${isDark() ? "light" : "dark"} mode`,
    );
  themeButton.hidden = false;
  updateThemeLabel();
  systemTheme.addEventListener("change", updateThemeLabel);
  let themeTimer;
  themeButton.addEventListener("click", () => {
    clearTimeout(themeTimer);
    root.classList.add("theme-changing");
    root.dataset.theme = isDark() ? "light" : "dark";
    try {
      localStorage.setItem("theme", root.dataset.theme);
    } catch {}
    updateThemeLabel();
    themeTimer = setTimeout(() => root.classList.remove("theme-changing"), 450);
  });

  const list = document.querySelector(".post-list");
  if (list) {
    const category = new URLSearchParams(location.search).get("category");
    if (category) {
      let count = 0;
      for (const row of list.children) {
        row.hidden = !JSON.parse(row.dataset.categories).includes(category);
        if (!row.hidden) count++;
      }
      const status = document.querySelector("#filter-status");
      status.hidden = false;
      status.querySelector("span").textContent = category;
      const empty = document.querySelector("#empty-posts");
      empty.hidden = count > 0;
      empty.textContent = "No posts in this category yet.";
    }
  }
  const dialog = document.querySelector("#search-dialog");
  const openButton = document.querySelector("#search-open");
  const input = document.querySelector("#search-input");
  const results = document.querySelector("#search-results");
  const status = document.querySelector("#search-status");
  const retry = document.querySelector("#search-retry");
  let articles;
  let loading = false;
  const normalize = (text) =>
    text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  function search() {
    results.replaceChildren();
    if (!articles) return;
    const words = normalize(input.value.trim()).split(/\s+/).filter(Boolean);
    if (!words.length) {
      status.textContent = "Type to search all articles.";
      return;
    }
    const matches = articles
      .filter((article) =>
        words.every((word) =>
          normalize(article.title + " " + article.text).includes(word),
        ),
      )
      .sort(
        (a, b) =>
          words.filter((w) => normalize(b.title).includes(w)).length -
          words.filter((w) => normalize(a.title).includes(w)).length,
      );
    status.textContent = matches.length
      ? `${matches.length} ${matches.length === 1 ? "article" : "articles"} found.`
      : "No articles found. Try different words.";
    for (const article of matches) {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = article.url;
      link.textContent = article.title;
      const excerpt = document.createElement("p");
      const firstMatch = normalize(article.text).indexOf(words[0]);
      const start = Math.max(0, firstMatch - 65);
      excerpt.textContent =
        (start ? "…" : "") +
        article.text.slice(start, start + 190) +
        (article.text.length > start + 190 ? "…" : "");
      li.append(link, excerpt);
      results.append(li);
    }
  }
  async function load() {
    if (articles) {
      search();
      return;
    }
    if (loading) return;
    loading = true;
    retry.hidden = true;
    status.textContent = "Loading articles…";
    try {
      const response = await fetch(dialog.dataset.index);
      if (!response.ok) throw new Error("Index unavailable");
      articles = await response.json();
      search();
    } catch {
      status.textContent =
        "Search could not load. Check your connection and try again.";
      retry.hidden = false;
    } finally {
      loading = false;
    }
  }
  openButton.hidden = false;
  let dialogAnimation;
  let closing = false;
  function closeSearch() {
    if (closing || !dialog.open) return;
    if (reducedMotion.matches) {
      dialog.close();
      return;
    }
    closing = true;
    dialogAnimation?.cancel();
    dialogAnimation = dialog.animate(
      [
        { opacity: 1, transform: "translateY(0) scale(1)" },
        { opacity: 0, transform: "translateY(8px) scale(.985)" },
      ],
      { duration: 160, easing: "cubic-bezier(.4, 0, 1, 1)" },
    );
    dialogAnimation.finished
      .then(() => {
        dialog.close();
        closing = false;
      })
      .catch(() => {
        closing = false;
      });
  }
  openButton.addEventListener("click", () => {
    dialog.showModal();
    if (!reducedMotion.matches) {
      dialogAnimation = dialog.animate(
        [
          {
            opacity: 0,
            transform: "translateY(18px) scale(.97)",
            filter: "blur(4px)",
          },
          {
            opacity: 1,
            transform: "translateY(0) scale(1)",
            filter: "blur(0)",
          },
        ],
        { duration: 360, easing: "cubic-bezier(.16, 1, .3, 1)" },
      );
    }
    input.focus();
    load();
  });
  document
    .querySelector("#search-close")
    .addEventListener("click", closeSearch);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSearch();
  });
  dialog.addEventListener("close", () => openButton.focus());
  dialog.addEventListener("click", (event) => {
    const rect = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom)
    )
      closeSearch();
  });
  input.addEventListener("input", search);
  retry.addEventListener("click", load);
})();

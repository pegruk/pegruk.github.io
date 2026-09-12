// Register before the first render so native page transitions can match titles.
(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;

  function matchTitle(url, transition) {
    if (!url) return;
    const link = [...document.querySelectorAll(".post-title")].find(
      (link) => link.href === url,
    );
    const heading = link?.closest("h3");
    if (!heading) return;
    heading.style.viewTransitionName = "article-title";
    transition.finished.then(() => {
      heading.style.removeProperty("view-transition-name");
    });
  }

  addEventListener("pageswap", (event) => {
    if (!event.viewTransition) return;
    if (reducedMotion.matches) {
      event.viewTransition.skipTransition();
      return;
    }
    matchTitle(event.activation?.entry?.url, event.viewTransition);
  });

  addEventListener("pagereveal", (event) => {
    if (!event.viewTransition) return;
    if (reducedMotion.matches) {
      event.viewTransition.skipTransition();
      return;
    }
    root.classList.add("page-transition");
    matchTitle(window.navigation?.activation?.from?.url, event.viewTransition);
    // Keep the fallback entrance suppressed after the native transition ends.
    event.viewTransition.finished.then(() =>
      root.classList.add("page-revealed"),
    );
  });
})();

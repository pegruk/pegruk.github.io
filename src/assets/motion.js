(() => {
  const key = "article-entrance";
  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let entrance;
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) || "null");
    sessionStorage.removeItem(key);
    if (
      saved &&
      saved.url === location.href &&
      Date.now() - saved.time < 10000 &&
      !reducedMotion.matches
    ) {
      entrance = saved;
      root.classList.add("article-entering");
    }
  } catch {}

  // Preserve normal links, new tabs, and browser history.
  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      reducedMotion.matches
    )
      return;
    const link = event.target.closest?.(
      ".post-title, [data-motion-link], [data-return-link]",
    );
    if (!link || link.target === "_blank" || link.hasAttribute("download"))
      return;
    const returnLink = link.matches("[data-return-link]");
    if (returnLink) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const title = returnLink
      ? document.querySelector(".post-header h1")
      : link.closest("h3") || link;
    if (!title) return;
    const rect = title.getBoundingClientRect();
    const style = getComputedStyle(title);
    try {
      sessionStorage.setItem(
        key,
        JSON.stringify({
          url: link.href,
          time: Date.now(),
          direction: returnLink ? "return" : "forward",
          target: link.dataset.motionTarget || null,
          text: returnLink
            ? title.textContent.trim()
            : link.dataset.motionText || link.textContent.trim(),
          left: rect.left,
          top: rect.top,
          width: rect.width,
          fontSize: style.fontSize,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          fontWeight: style.fontWeight,
        }),
      );
    } catch {}
  });

  let overlay;
  let title;
  const animations = [];
  function cleanup() {
    root.classList.remove("article-entering");
    overlay?.remove();
    title?.style.removeProperty("visibility");
    animations.forEach((animation) => animation.cancel());
  }
  const safetyTimer = entrance ? setTimeout(cleanup, 2200) : null;
  addEventListener("pagehide", cleanup);
  addEventListener("pageshow", (event) => {
    if (event.persisted) cleanup();
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) cleanup();
  });

  document.addEventListener("DOMContentLoaded", () => {
    if (!entrance || reducedMotion.matches) {
      cleanup();
      return;
    }
    title =
      entrance.target === "all-posts"
        ? document.querySelector("#writing-title")
        : entrance.direction === "return"
          ? [...document.querySelectorAll(".post-title")]
              .find((link) => link.textContent.trim() === entrance.text)
              ?.closest("h3")
          : document.querySelector(".post-header h1, [data-motion-title]");
    if (
      !title ||
      title.textContent.trim() !== entrance.text ||
      !title.animate
    ) {
      cleanup();
      return;
    }
    try {
      if (entrance.direction === "return") {
        title.scrollIntoView({ block: "center", inline: "nearest" });
      }
      const rect = title.getBoundingClientRect();
      const style = getComputedStyle(title);
      title.style.visibility = "hidden";
      overlay = document.createElement("div");
      overlay.className = "traveling-title";
      overlay.setAttribute("aria-hidden", "true");
      overlay.textContent = title.textContent;
      const destination = {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
      };
      Object.assign(overlay.style, destination, {
        fontFamily: style.fontFamily,
        color: style.color,
      });
      document.body.append(overlay);
      const titleAnimation = overlay.animate(
        [
          {
            left: `${entrance.left}px`,
            top: `${entrance.top}px`,
            width: `${entrance.width}px`,
            fontSize: entrance.fontSize,
            lineHeight: entrance.lineHeight,
            letterSpacing: entrance.letterSpacing,
            fontWeight: entrance.fontWeight,
          },
          destination,
        ],
        { duration: 850, easing: "cubic-bezier(.65, 0, .2, 1)", fill: "both" },
      );
      animations.push(titleAnimation);
      titleAnimation.finished
        .then(() => {
          title.style.visibility = "visible";
          overlay.remove();
        })
        .catch(() => {});

      for (const element of document.querySelectorAll(
        entrance.direction === "return" || entrance.target === "all-posts"
          ? ".home-welcome, .writing"
          : ".post-toc, .post-meta, .demo-label, .post .prose, .post > .back-link, [data-motion-content]",
      )) {
        animations.push(
          element.animate(
            [
              { opacity: 0, transform: "translateY(10px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 650,
              delay: 650,
              easing: "cubic-bezier(.22, 1, .36, 1)",
              fill: "both",
            },
          ),
        );
      }
      Promise.all(animations.map((animation) => animation.finished))
        .then(() => {
          clearTimeout(safetyTimer);
          cleanup();
        })
        .catch(cleanup);
    } catch {
      cleanup();
    }
  });
})();

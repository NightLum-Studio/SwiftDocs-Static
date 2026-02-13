// App bootstrap.

async function initApp() {
  const toggle = document.getElementById("theme-toggle");
  const themeLink = document.getElementById("theme-style");
  const backdrop = document.getElementById("sidebar-backdrop");
  const homeLink = document.getElementById("nav-home");

  if (window.marked) {
    const plugin =
      window.markedAdmonition ||
      (window.markedAdmonition && window.markedAdmonition.default) ||
      (window.markedAdmonition && window.markedAdmonition.markedAdmonition);
    if (typeof plugin === "function") {
      window.marked.use(plugin());
    }
  }

  if (!themeLink || !toggle) {
    await window.loadLanguages();
    return;
  }

  window.initThemeToggle(toggle, themeLink);

  if (homeLink) {
    homeLink.addEventListener("click", event => {
      event.preventDefault();
      window.showHomeScreen();
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", window.closeSidebar);
  }

  window.initSwipeGestures();

  await window.loadHome();
  window.showHomeScreen();

  if (window.matchMedia("(max-width: 1024px)").matches) {
    if (!document.body.classList.contains("home-active")) {
      window.openSidebar();
    }
  }

  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 1024px)").matches) {
      window.closeSidebar();
    }
  });

  await window.loadLanguages();
}

document.addEventListener("DOMContentLoaded", initApp);

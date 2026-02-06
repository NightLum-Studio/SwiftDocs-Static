// App bootstrap.

async function initApp() {
  const toggle = document.getElementById("theme-toggle");
  const themeLink = document.getElementById("theme-style");
  const backdrop = document.getElementById("sidebar-backdrop");

  if (!themeLink || !toggle) {
    await window.loadLanguages();
    return;
  }

  window.initThemeToggle(toggle, themeLink);

  if (backdrop) {
    backdrop.addEventListener("click", window.closeSidebar);
  }

  window.initSwipeGestures();

  if (window.matchMedia("(max-width: 1024px)").matches) {
    window.openSidebar();
  }

  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 1024px)").matches) {
      window.closeSidebar();
    }
  });

  await window.loadLanguages();
}

document.addEventListener("DOMContentLoaded", initApp);

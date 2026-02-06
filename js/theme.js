// Theme toggle and persistence.

function applyTheme(themeName, persist = false, themeLink = null) {
  const link = themeLink || document.getElementById("theme-style");
  const href = `css/${themeName}.css?v=${Date.now()}`;
  if (link) link.setAttribute("href", href);
  document.documentElement.dataset.theme = themeName;
  if (persist) localStorage.setItem("theme", themeName);
  console.log("[Theme] applied:", themeName, "->", href);
}

function initThemeToggle(toggle, themeLink) {
  let saved = localStorage.getItem("theme");
  if (saved !== "dark" && saved !== "light") saved = null;
  const initialTheme = saved || "dark";

  applyTheme(initialTheme, false, themeLink);
  toggle.checked = (initialTheme === "dark");

  toggle.addEventListener("change", () => {
    const theme = toggle.checked ? "dark" : "light";
    applyTheme(theme, true, themeLink);
    if (window.updateDetailPanel) window.updateDetailPanel();
  });
}

window.applyTheme = applyTheme;
window.initThemeToggle = initThemeToggle;

// Shared app state and network helpers.

let currentLang = "en";
let currentPath = "md/en";
let baseURL = "";

if (window.location.hostname.endsWith("github.io")) {
  const parts = window.location.pathname.split("/").filter(Boolean);
  baseURL = parts.length ? `/${parts[0]}` : "";
} else {
  baseURL = "";
}

document.documentElement.style.setProperty("--base-url", baseURL);

async function fetchYaml(file) {
  const res = await fetch(`${baseURL}/${file}?v=${Date.now()}`);
  return jsyaml.load(await res.text());
}

async function loadPage(file) {
  try {
    const res = await fetch(`${baseURL}/${file}?v=${Date.now()}`);
    document.getElementById("content").innerHTML = res.ok
      ? marked.parse(await res.text())
      : "<p>Failed to load file.</p>";
  } catch {
    document.getElementById("content").innerHTML = "<p>Error loading page.</p>";
  }
}

function reloadAll() {
  if (window.loadMenu) window.loadMenu();
  if (window.loadUI) window.loadUI();
}

window.fetchYaml = fetchYaml;
window.loadPage = loadPage;
window.reloadAll = reloadAll;

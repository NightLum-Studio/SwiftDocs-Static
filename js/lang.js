// Language and UI localization.

async function loadLanguages() {
  const langs = await window.loadConfig("languages");
  const select = document.getElementById("lang-select");

  langs.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l.code;
    opt.dataset.path = l.path || l.code;
    opt.textContent = l.name;
    select.appendChild(opt);
  });

  select.onchange = () => {
    const sel = select.selectedOptions[0];
    currentLang = sel.value;
    currentLangFolder = sel.dataset.path;
    window.updateCurrentPath();
    window.reloadAll();
  };

  if (langs.length) {
    currentLang = langs[0].code;
    currentLangFolder = langs[0].path || langs[0].code;
    window.updateCurrentPath();
    window.reloadAll();
  }
}

async function loadUI() {
  const ui = await window.loadConfig("ui");
  const sidebarTitle = document.getElementById("sidebar-title");
  if (sidebarTitle) sidebarTitle.textContent = ui.ui.documentation[currentLang];
  const homeLink = document.getElementById("nav-home");
  if (homeLink) homeLink.textContent = ui.ui.home[currentLang];
  const examplesLink = document.getElementById("nav-examples");
  if (examplesLink) examplesLink.textContent = ui.ui.examples[currentLang];
  if (window.loadSocials) window.loadSocials();
}

window.loadLanguages = loadLanguages;
window.loadUI = loadUI;

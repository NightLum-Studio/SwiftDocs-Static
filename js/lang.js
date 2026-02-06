// Language and UI localization.

async function loadLanguages() {
  const langs = await window.fetchYaml("config/languages.yaml");
  const select = document.getElementById("lang-select");

  langs.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l.code;
    opt.dataset.path = l.path;
    opt.textContent = l.name;
    select.appendChild(opt);
  });

  select.onchange = () => {
    const sel = select.selectedOptions[0];
    currentLang = sel.value;
    currentPath = sel.dataset.path;
    window.reloadAll();
  };

  if (langs.length) {
    currentLang = langs[0].code;
    currentPath = langs[0].path;
    window.reloadAll();
  }
}

async function loadUI() {
  const ui = await window.fetchYaml("config/ui.yaml");
  document.getElementById("sidebar-title").textContent = ui.ui.documentation[currentLang];
  document.getElementById("nav-home").textContent = ui.ui.home[currentLang];
  document.getElementById("nav-examples").textContent = ui.ui.examples[currentLang];
}

window.loadLanguages = loadLanguages;
window.loadUI = loadUI;

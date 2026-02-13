// Menu rendering and detail panel logic.

let detailVariablesCache = null;
let searchCache = new Map();
let searchSeq = 0;
let searchResults = new Map();

function clearSearchHighlights() {
  const content = document.getElementById("content");
  if (!content) return;
  content.querySelectorAll("mark.search-hit").forEach(mark => {
    const text = document.createTextNode(mark.textContent || "");
    mark.replaceWith(text);
  });
}

function getCurrentTheme() {
  return document.documentElement.dataset.theme
    || localStorage.getItem("theme")
    || "dark";
}

async function loadDetailVariables() {
  if (detailVariablesCache) return detailVariablesCache;
  const cfg = await window.loadConfig("docs");
  detailVariablesCache = (cfg && cfg.variables) ? cfg.variables : {};
  return detailVariablesCache;
}

function applyDetailVariables(text, vars, theme) {
  if (!text) return "";
  return text.replace(/\{\$(.+?)\}/g, (match, name) => {
    const key = String(name || "").trim();
    const entry = vars && vars[key];
    if (!entry) return match;
    return entry[theme] || entry.dark || entry.light || match;
  });
}

async function getDetailText(detailElement) {
  if (!detailElement) return "";
  const raw = detailElement.dataset.detail || "";
  const vars = await loadDetailVariables();
  const theme = getCurrentTheme();
  return applyDetailVariables(raw, vars, theme);
}

async function loadMenu() {
  const cfg = await window.loadConfig("docs");
  const docs = cfg && cfg.docs ? cfg.docs : cfg;
  const menuDiv = document.getElementById("menu");
  menuDiv.innerHTML = "";
  searchCache = new Map();
  searchResults = new Map();

  const docMap = new Map();
  const rootItems = [];

  docs.forEach(item => {
    docMap.set(item.key, { ...item, children: [] });
  });

  docs.forEach(item => {
    if (item.branch && docMap.has(item.branch)) {
      docMap.get(item.branch).children.push(docMap.get(item.key));
    } else {
      rootItems.push(docMap.get(item.key));
    }
  });

  async function updateDetailPanel(detailElement) {
    const detailPanel = document.querySelector(".detail-panel");
    const sourceElement = detailElement || document.querySelector(".sidebar a.active");
    const detailContent = await getDetailText(sourceElement);
    if (detailPanel && detailContent) {
      detailPanel.innerHTML = `<h3>Details</h3><p>${window.parseDetailContent(detailContent)}</p>`;
    } else if (detailPanel) {
      detailPanel.innerHTML = `<h3>Details</h3><p>No information available</p>`;
    }
  }

  function renderMenuItems(items, level = 0) {
    items.forEach(item => {
      const a = document.createElement("a");
      a.textContent = item.titles[currentLang] || item.file;
      a.dataset.title = a.textContent.toLowerCase();
      a.dataset.key = item.key;
      a.dataset.file = item.file;
      a.dataset.detail = item.detail || "";

      a.onclick = () => {
        window.loadPageWithSearch(`${currentPath}/${item.file}`);
        setActiveMenuItem(item.file);
        updateDetailPanel(a);
        window.closeSidebar();
      };

      if (level > 0) {
        a.style.paddingLeft = (level * 20) + "px";
        a.style.fontSize = (16 - level * 2) + "px";
        a.style.opacity = 1 - (level * 0.2);
      }

      menuDiv.appendChild(a);

      if (item.children && item.children.length > 0) {
        renderMenuItems(item.children, level + 1);
      }
    });
  }

  function setActiveMenuItem(file) {
    const menuItems = menuDiv.querySelectorAll("a");
    menuItems.forEach(item => {
      if (item.dataset.file === file) {
        item.classList.add("active");
        updateDetailPanel(item);
      } else {
        item.classList.remove("active");
      }
    });
  }

  renderMenuItems(rootItems);

  if (docs.length) {
    const firstFile = `${currentPath}/${docs[0].file}`;
    window.loadPage(firstFile);
    setActiveMenuItem(docs[0].file);
  }

  window.setActiveMenuItem = setActiveMenuItem;
  window.updateDetailPanel = updateDetailPanel;
  setupContentNav(menuDiv);

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    let timer = null;
    searchInput.oninput = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        const query = searchInput.value.trim().toLowerCase();
        const links = Array.from(menuDiv.querySelectorAll("a"));
        if (!query) {
          links.forEach(link => { link.style.display = "block"; });
          searchResults.clear();
          clearSearchHighlights();
          return;
        }

        const seq = ++searchSeq;
        searchResults.clear();

        await Promise.all(links.map(async link => {
          const file = link.dataset.file || "";
          if (!file) return;
          if (!searchCache.has(file)) {
            try {
              const text = await window.fetchText(`${currentPath}/${file}`);
              searchCache.set(file, text.toLowerCase());
            } catch {
              searchCache.set(file, "");
            }
          }
        }));

        if (seq !== searchSeq) return;

        links.forEach(link => {
          const file = link.dataset.file || "";
          const content = searchCache.get(file) || "";
          const idx = content.indexOf(query);
          if (idx >= 0) {
            link.style.display = "block";
            searchResults.set(file, { query, index: idx });
          } else {
            link.style.display = "none";
          }
        });
      }, 200);
    };
  }
}

async function loadPageWithSearch(file) {
  await window.loadPage(file);
  const searchInput = document.getElementById("search-input");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  if (!query) return;
  highlightAndScroll(query);
}

function highlightAndScroll(query) {
  const content = document.getElementById("content");
  if (!content) return;
  // Remove previous highlights safely
  content.querySelectorAll("mark.search-hit").forEach(mark => {
    const text = document.createTextNode(mark.textContent || "");
    mark.replaceWith(text);
  });
  const raw = content.innerHTML;
  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(safeQuery, "gi");
  content.innerHTML = raw.replace(re, match => `<mark class="search-hit">${match}</mark>`);
  const first = content.querySelector(".search-hit");
  if (first) {
    const parentRect = content.getBoundingClientRect();
    const rect = first.getBoundingClientRect();
    const offset = rect.top - parentRect.top + content.scrollTop - 24;
    content.scrollTo({ top: offset, behavior: "smooth" });
  }
}

function setupContentNav(menuDiv) {
  const nav = document.getElementById("content-nav");
  const prevBtn = document.getElementById("nav-prev");
  const nextBtn = document.getElementById("nav-next");
  const content = document.getElementById("content");
  if (!nav || !prevBtn || !nextBtn || !content) return;

  function getVisibleLinks() {
    return Array.from(menuDiv.querySelectorAll("a"))
      .filter(link => link.style.display !== "none");
  }

  function updateButtons() {
    const links = getVisibleLinks();
    const active = menuDiv.querySelector("a.active");
    const idx = links.indexOf(active);
    prevBtn.disabled = idx <= 0;
    nextBtn.disabled = idx < 0 || idx >= links.length - 1;
  }

  function showIfAtBottom() {
    const threshold = 40;
    const atBottom = content.scrollTop + content.clientHeight >= content.scrollHeight - threshold;
    nav.classList.toggle("show", atBottom);
  }

  prevBtn.onclick = () => {
    const links = getVisibleLinks();
    const active = menuDiv.querySelector("a.active");
    const idx = links.indexOf(active);
    if (idx > 0) links[idx - 1].click();
  };

  nextBtn.onclick = () => {
    const links = getVisibleLinks();
    const active = menuDiv.querySelector("a.active");
    const idx = links.indexOf(active);
    if (idx >= 0 && idx < links.length - 1) links[idx + 1].click();
  };

  content.addEventListener("scroll", () => {
    showIfAtBottom();
  });

  updateButtons();
  showIfAtBottom();

  const observer = new MutationObserver(() => {
    updateButtons();
    showIfAtBottom();
  });
  observer.observe(menuDiv, { subtree: true, attributes: true, attributeFilter: ["class", "style"] });
}

window.loadMenu = loadMenu;
window.loadPageWithSearch = loadPageWithSearch;

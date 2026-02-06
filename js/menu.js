// Menu rendering and detail panel logic.

function getCurrentTheme() {
  return document.documentElement.dataset.theme
    || localStorage.getItem("theme")
    || "dark";
}

function getDetailForTheme(detailElement) {
  if (!detailElement) return "";
  const theme = getCurrentTheme();
  if (theme === "light") return detailElement.dataset.detailLight || "";
  return detailElement.dataset.detailDark || "";
}

async function loadMenu() {
  const docs = await window.fetchYaml("config/docs.yaml");
  const menuDiv = document.getElementById("menu");
  menuDiv.innerHTML = "";

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

  function updateDetailPanel(detailElement) {
    const detailPanel = document.querySelector(".detail-panel");
    const sourceElement = detailElement || document.querySelector(".sidebar a.active");
    const detailContent = getDetailForTheme(sourceElement);
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
      a.dataset.key = item.key;
      a.dataset.file = item.file;
      a.dataset.detailDark = item.detail_dark || item.detail || "";
      a.dataset.detailLight = item.detail_light || item.detail || "";

      a.onclick = () => {
        window.loadPage(`${currentPath}/${item.file}`);
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
}

window.loadMenu = loadMenu;

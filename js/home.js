// Home screen with project buttons.

function showHomeScreen() {
  document.body.classList.add("home-active");
  window.closeSidebar();
}

function hideHomeScreen() {
  document.body.classList.remove("home-active");
}

async function loadHome() {
  const config = await window.loadConfig("home");
  const list = (config && config.projects) ? config.projects : [];
  const container = document.getElementById("home-buttons");
  if (!container) return;
  container.innerHTML = "";

  list.forEach(item => {
    const button = document.createElement("button");
    button.className = "home-button";
    button.textContent = item.name || item.key || "Project";
    button.addEventListener("click", () => {
      window.setProjectPath(item.path);
      window.updateCurrentPath();
      hideHomeScreen();
      window.reloadAll();
    });
    container.appendChild(button);
  });
}

window.showHomeScreen = showHomeScreen;
window.hideHomeScreen = hideHomeScreen;
window.loadHome = loadHome;

// Sidebar social links.

async function loadSocials() {
  const config = await window.loadConfig("socials");
  const list = (config && config.socials) ? config.socials : [];
  const container = document.getElementById("sidebar-socials");
  if (!container) return;
  container.innerHTML = "";

  list.forEach(item => {
    const link = document.createElement("a");
    link.href = item.url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = item.name || "";
    link.className = "social-link";

    const icon = document.createElement("span");
    icon.className = `social-icon social-${(item.icon || "").toLowerCase()}`;

    link.appendChild(icon);
    container.appendChild(link);
  });
}

window.loadSocials = loadSocials;

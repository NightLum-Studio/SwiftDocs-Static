// Shared app state and network helpers.

let currentLang = "en";
let currentLangFolder = "en";
let currentProjectPath = "";
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

async function fetchText(file) {
  const res = await fetch(`${baseURL}/${file}?v=${Date.now()}`);
  return res.text();
}

function parseXml(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error("XML parse error");
  }
  return doc;
}

function xmlToObject(doc, key) {
  if (!doc) return null;
  switch (key) {
    case "languages": {
      const items = Array.from(doc.querySelectorAll("language"));
      return items.map(node => ({
        code: node.getAttribute("code") || "",
        path: node.getAttribute("path") || node.getAttribute("code") || "",
        name: node.getAttribute("name") || ""
      }));
    }
    case "ui": {
      const ui = {};
      const nodes = Array.from(doc.documentElement.children);
      nodes.forEach(node => {
        const map = {};
        Array.from(node.children).forEach(child => {
          map[child.getAttribute("lang")] = child.textContent || "";
        });
        ui[node.nodeName] = map;
      });
      return { ui };
    }
    case "docs": {
      const vars = {};
      const varNodes = Array.from(doc.querySelectorAll("variables > var"));
      varNodes.forEach(node => {
        const name = node.getAttribute("name");
        if (!name) return;
        vars[name] = {
          dark: node.getAttribute("dark") || "",
          light: node.getAttribute("light") || ""
        };
      });

      const items = Array.from(doc.querySelectorAll("items > doc, doc"));
      return {
        variables: vars,
        docs: items.map(node => ({
          key: node.getAttribute("key") || "",
          file: node.getAttribute("file") || "",
          branch: node.getAttribute("branch") || "",
          detail: node.getAttribute("detail") || "",
          titles: {
            en: node.getAttribute("title_en") || "",
            de: node.getAttribute("title_de") || ""
          }
        }))
      };
    }
    case "home": {
      const items = Array.from(doc.querySelectorAll("project"));
      return { projects: items.map(node => ({
        name: node.getAttribute("name") || "",
        path: node.getAttribute("path") || ""
      })) };
    }
    case "socials": {
      const items = Array.from(doc.querySelectorAll("social"));
      return { socials: items.map(node => ({
        name: node.getAttribute("name") || "",
        url: node.getAttribute("url") || "",
        icon: node.getAttribute("icon") || ""
      })) };
    }
    default:
      return null;
  }
}

async function getConfigFormat() {
  try {
    const raw = await fetchText("config/format.yaml");
    const cfg = jsyaml.load(raw);
    return (cfg && cfg.format === "xml") ? "xml" : "yaml";
  } catch {
    return "yaml";
  }
}

async function loadConfig(key) {
  const format = await getConfigFormat();
  if (format === "xml") {
    const xmlText = await fetchText(`config/xml/${key}.xml`);
    const doc = parseXml(xmlText);
    return xmlToObject(doc, key);
  }
  return fetchYaml(`config/yaml/${key}.yaml`);
}

async function loadPage(file) {
  try {
    const res = await fetch(`${baseURL}/${file}?v=${Date.now()}`);
    if (!res.ok) {
      document.getElementById("content").innerHTML = "<p>Failed to load file.</p>";
      return;
    }
    const md = await res.text();
    document.getElementById("content").innerHTML = renderMarkdownWithAdmonitions(md);
  } catch {
    document.getElementById("content").innerHTML = "<p>Error loading page.</p>";
  }
}

function renderMarkdownWithAdmonitions(md) {
  if (!window.marked) return md;
  const lines = md.split(/\r?\n/);
  const chunks = [];
  let buf = [];

  function flushBuf() {
    if (buf.length) {
      chunks.push({ type: "md", text: buf.join("\n") });
      buf = [];
    }
  }

  const re = /^\s*>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)?$/i;
  const reAlt = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)?$/i;
  const reAlt2 = /^\s*>\s*!\[(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)?$/i;
  const reAlt3 = /^\s*!\[(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(.*)?$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(re) || line.match(reAlt) || line.match(reAlt2) || line.match(reAlt3);
    if (!m) {
      buf.push(line);
      continue;
    }

    flushBuf();
    const kind = m[1].toLowerCase();
    const rest = (m[2] || "").trim();
    const content = [];
    if (rest) content.push(rest);

    for (i = i + 1; i < lines.length; i++) {
      const l = lines[i];
      if (l.trimStart().startsWith(">")) {
        content.push(l.trimStart().replace(/^>\s?/, ""));
        continue;
      }
      if (l.trim() === "") {
        content.push("");
        continue;
      }
      i -= 1;
      break;
    }

    chunks.push({
      type: "admonition",
      kind,
      text: content.join("\n").trim()
    });
  }

  flushBuf();

  const labels = {
    note: "Note",
    tip: "Tip",
    important: "Important",
    warning: "Warning",
    caution: "Caution"
  };

  let html = "";
  for (const chunk of chunks) {
    if (chunk.type === "md") {
      html += window.marked.parse(chunk.text);
      continue;
    }
    const title = labels[chunk.kind] || chunk.kind;
    const inner = window.marked.parse(chunk.text || "").trim();
    html += `<div class="markdown-alert markdown-alert-${chunk.kind}">` +
      `<div class="markdown-alert-title">${title}</div>` +
      `${inner}` +
      `</div>`;
  }
  return html;
}

function reloadAll() {
  if (window.hasActiveProject && window.hasActiveProject()) {
    if (window.loadMenu) window.loadMenu();
  }
  if (window.loadUI) window.loadUI();
}

function setProjectPath(projectPath) {
  currentProjectPath = projectPath || "";
}

function getProjectPath() {
  return currentProjectPath;
}

function updateCurrentPath() {
  if (currentProjectPath) {
    currentPath = `${currentProjectPath}/${currentLangFolder}`;
  } else {
    currentPath = `md/${currentLangFolder}`;
  }
}

function hasActiveProject() {
  return !!currentProjectPath;
}

window.fetchYaml = fetchYaml;
window.fetchText = fetchText;
window.loadConfig = loadConfig;
window.loadPage = loadPage;
window.reloadAll = reloadAll;
window.setProjectPath = setProjectPath;
window.getProjectPath = getProjectPath;
window.updateCurrentPath = updateCurrentPath;
window.hasActiveProject = hasActiveProject;

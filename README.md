# SwiftDocs Documentation System
![overview.png](Assets/overview.png)

## Key Features
>  ❗NOTE
> 
>Multilingual support (configured via YAML)
>* Dynamic hierarchical menu
>* Light and dark theme switching
>* Markdown content rendering
>* Detail panel with additional information
>* Text formatting with colors and styles

## Quick Start
SwiftDocs was created for projects that need a clean and reliable documentation website without unnecessary complexity. It does not rely on build tools, generators, or heavy frameworks the site is fully static and works seamlessly with GitHub Pages. You can deploy it by simply uploading the files and enabling Pages in your repository.

The documentation structure is designed to stay clear and maintainable as projects grow. SwiftDocs supports multiple languages, uses a dynamic hierarchical navigation menu, and renders Markdown content in a consistent and readable way. Themes can be switched between light and dark modes, and customization is straightforward, without the need for JavaScript frameworks or complex tooling.

This approach makes SwiftDocs suitable for a wide range of projects that need structured, easy-to-maintain documentation from small repositories to larger, long-living projects.
The project is fully ready to deploy on GitHub Pages:

### For GitHub Pages

1. Upload the files to your GitHub repository
2. Enable GitHub Pages in the repository settings:
   Settings → Pages → Build and deployment
   Source: Deploy from a branch
   Branch: main (or your default branch), folder: /root
3. Open the site at: https://your-username.github.io/your-repository

### For Local Development

1. **Clone the repository**:

```bash
git clone <repository-url>
cd swiftdocs
```

2. **Run a local server** (required due to CORS policy):

```bash
# Python 3.x
python -m http.server 8000 --bind 0.0.0.0

# Or using Node.js (if installed)
npx http-server

# Or using PHP
php -S localhost:8000
```

3. **Open in your browser**:

```
http://localhost:8000
```
>⚠️ **Warning**
>   
>**Important**: Do not open `index.html` directly via the file system (`file://`). 
> Browser security policies prevent YAML and Markdown files from loading correctly. 
> Always use an HTTP server.

## Project Configuration

### Adding a New Language

1. Edit `config/languages.yaml`:

```yaml
- code: fr
  path: md/fr
  name: Français
```

2. Create a folder with translation files:

```
md/fr/
├── overview.md
└── tutorial_1.md
```

3. Add translations to `config/ui.yaml`:

```yaml
documentation:
  fr: Documentation
home:
  fr: Accueil
examples:
  fr: Exemples
```

### Configuring the Documentation Menu

Edit `config/docs.yaml` to modify the menu structure:

```yaml
- key: new_section
  titles:
    en: New Section
    de: Neuer Abschnitt
  file: new_section.md
  branch: overview  # Optional: for nested hierarchy
  detail: "@[#ff0000[Important info]]"
```

## Themes

The project includes two themes:

* `dark.css` — dark theme (default)
* `light.css` — light theme

Theme selection is saved in `localStorage`.


## License

This project is released under the MIT License.

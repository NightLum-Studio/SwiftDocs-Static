# SwiftDocs Documentation System
![overview.png](Assets/overview.png)
version: 1.4.0

**Version:** v1.2.1
## Key Features
> [!NOTE]
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

## Documentation

Full documentation is available at:
https://nightlum-studio.github.io/SwiftDocs-Static

## Update

- Migrated to a structured config/yaml and config/xml setup with format selection via config/format.yaml.
- Added a home page with project selection (config/home.yaml).
- Implemented full-text search across .md files with highlighting and auto-scroll.
- Added “previous / next” navigation buttons at the bottom of pages.
- Introduced social icons in the sidebar via config/socials.yaml.
- Updated the detail system with support for variables ({$name}) inside docs.yaml/docs.xml.
- Refactored the codebase into modular JS components (app-base, menu, lang, theme, sidebar, home, socials).
- Introduced a redesigned theme switcher UI with icons.
- Added support for admonitions ([!NOTE], etc.) with a custom parser.
- Improved Markdown styling (code blocks, tables, blockquotes).
- Hid scrollbars for a cleaner UI.
- Added Montserrat as the global font (16px base size).
- Added dedicated styles and logic for Home / Sidebar / Topbar.

## License
This project is released under the MIT License.

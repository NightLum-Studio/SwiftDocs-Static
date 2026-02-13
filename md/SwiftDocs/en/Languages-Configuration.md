This file defines which languages are available in the documentation system and where their content is stored.
SwiftDocs reads this configuration at runtime and builds the language switcher dynamically.

---
#### Basic Example

```yaml
- code: en
  path: en
  name: English

- code: de
  path: de
  name: Deutsch
```
#### Each entry represents one language.

Fields Reference
| Field  | Type   | Required | Description                         |
| ------ | ------ | -------- | ----------------------------------- |
| `code` | string | Yes      | Unique language identifier          |
| `path` | string | Yes      | Relative path to Markdown directory |
| `name` | string | Yes      | Display name in language selector   |


#### UI Translations
```
config/yaml/ui.yaml (or config/xml/ui.xml)
```
Used to translate interface labels.

Example:
```yaml
documentation:
  en: Documentation
  de: Dokumentation

home:
  en: Home
  de: Start
```

### Language Consistency Requirements

For stable behavior:
- All languages should contain the same file structure.
- File names must match across languages.
- Keys in config/yaml/docs.yaml or config/xml/docs.xml must reference files that exist in every language directory.

Recommended pattern:
```bash
md/project-name/
  /en
    overview.md
    installation.md
  /de
    overview.md
    installation.md
```
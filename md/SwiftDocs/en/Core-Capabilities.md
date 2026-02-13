## Documentation Structure

This file defines the navigation menu and page structure.

#### YAML Example
```yaml
variables:
  accent:
    dark: "#fff5c4"
    light: "#4a5568"

docs:
  - key: overview
    titles:
      en: Overview
      de: Übersicht
    file: overview.md
    branch: null
    detail: "@[{$accent}[Important]]"
```

#### XML Example
```xml
<docs>
  <variables>
    <var name="accent" dark="#fff5c4" light="#4a5568" />
  </variables>
  <items>
    <doc key="overview"
         file="overview.md"
         branch=""
         title_en="Overview"
         title_de="Übersicht"
         detail="@[{$accent}[Important]]" />
  </items>
</docs>
```

Available Keys (docs items)
| Key      | Type   | Required | Description                      |
| -------- | ------ | -------- | -------------------------------- |
| `key`    | string | Yes      | Unique identifier of the section |
| `titles` | object | Yes      | Localized titles                 |
| `file`   | string | Yes      | Markdown file name               |
| `branch` | string | No       | Parent section key               |
| `detail` | string | No       | Inline styled annotation         |


## Color Variables
You can define reusable color variables inside the documentation configuration.
These variables can be used in detail blocks and styled annotations.

#### YAML Variables
```yaml
variables:
  accent:
    dark: "#fff5c4"
    light: "#4a5568"
  muted:
    dark: "#bdb08a"
    light: "#6b7280"
```
#### XML Variables
```xml
<variables>
  <var name="accent" dark="#fff5c4" light="#4a5568" />
  <var name="muted" dark="#bdb08a" light="#6b7280" />
</variables>
```

Variable Structure
| Attribute | Description           |
| --------- | --------------------- |
| `name`    | Variable identifier   |
| `dark`    | Value for dark theme  |
| `light`   | Value for light theme |

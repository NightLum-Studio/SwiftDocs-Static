# SwiftDocs Documentation System

![overview.png](Assets/overview.png)


SwiftDocs is a static documentation system designed for structured, multilingual project documentation.  
It is configuration-driven and supports both YAML and XML formats.

The system is suitable for single or multiple projects within the same documentation instance.


##  General Principles


SwiftDocs is built around three core ideas:

- Configuration defines structure
- Content is written in Markdown
- Format is interchangeable (YAML or XML)

The system does not require a build step. All configuration is read from `config/yaml` or `config/xml` based on `config/format.yaml`.

## Configuration Format (YAML / XML)

> [!NOTE]  
> SwiftDocs supports both:
> 
> - yaml
> - xml



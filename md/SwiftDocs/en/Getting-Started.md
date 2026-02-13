## Deployment on GitHub Pages

> [!NOTE]
> ### Procedure
> 1. Upload the project files to the repository.
> 2. Navigate to:
>    Settings → Pages → Build and deployment
> 3. Configure:
>     - Source: Deploy from a branch
>     - Branch: main (or default branch)
>     - Folder: /root
> 4. Access the site at:
>    https://<username>.github.io/<repository>

## Local Development

#### Clone the Repository

```bash
git clone https://github.com/NightLum-Studio/SwiftDocs-Static.git
cd swiftdocs 
``` 
#### Start a Local HTTP Server.

```bash 
# Python 3.x:
python -m http.server 8000 --bind 0.0.0.0

# Node.js:
npx http-server

# PHP:
php -S localhost:8000
```
#### Access the Application
```bash 
http://localhost:8000
```

> [!WARNING]
> Directly opening index.html via file:// is not supported.
> YAML/XML and Markdown files require an HTTP server to load correctly.

---
mode: 'agent'
---
# Goal: Find app (form) folder

Your goal is to locate the application folder relevant to the context, likely a form app.

Use `src/applications/manifest-catalog.json` to check the folder path for each application.

Determine if the application already exists, if so, use the folder path.

If context is not provided, then search context around the current file to the nearest parent with a `manifest.json` file, otherwise search the codebase for best guess.

Apps are located in the `src/applications/` but they might be in a subfolder. You will know if you are in the right folder if it contains a manifest.json file.

Validate that the folder contains a manifest.json, a pages folder, and a config folder. And now use this folder for additional context.

If no context is found, provide a suggestion for a new folder name, such as `src/applications/form-foo-bar`, and confirm with the user before proceeding.
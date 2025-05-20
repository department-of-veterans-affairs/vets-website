---
mode: 'agent'
---
# Goal: Find app (form) folder

Your goal is to locate the application folder relevant to the context, likely a form app.

If the user provides a form number or name, then search using glob pattern `src/applications/**/*<form number or name>*/manifest.json` in the codebase to find the folder. For example if the user provides `4142`, then search for `src/applications/**/*4142*/manifest.json`. The actual application name may have additional characters such as 21-4142, or 4142-v2.

If context is not provided, then search context around the current file to the nearest parent with a `manifest.json` file, otherwise search the codebase for best guess.

Apps are located in the `src/applications/` but they might be in a subfolder. You will know if you are in the right folder if it contains a manifest.json file.

Validate that the folder contains a manifest.json, a pages folder, and a config folder. And now use this folder for additional context.
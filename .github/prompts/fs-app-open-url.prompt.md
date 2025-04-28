# Forms app open URL

1. Determine the {app_folder} we are in [instructions](fs-app-locate-folder.prompt.md). The {app_folder} should be the remaining path after `src/applications`
2. In the folder must contain a manifest.json file, extract the value for the "rootUrl" key.
Open this URL in the browser:
http://localhost:3001/{rootUrl}

Example 1:
User requests: open 4142

Tasks:
- You find `src/applications/simple-forms/21-4142/manifest.json`
- You find key "rootUrl" with value "21-4142-medical-release" in the manifest.json file.
- You open `http://localhost:3001/21-4142-medical-release` in the browser automatically.

Example 2:
User requests: open 686c

Tasks:
- You find `src/applications/686c-674/manifest.json` and `src/applications/686c-674-v1/manifest.json` so you ask the user to choose one.
- You find key "rootUrl" with value "686C-674" in the manifest.json file.
- You open `http://localhost:3001/686C-674` in the browser automatically.
---
mode: 'agent'
---
# Open Form URL

Figure out the URL to open the app in the browser, and tell the user.

1. Determine the {app_folder} we are in with [form-app-info](.github/instructions/form-app-info.instructions.md). The {app_folder} should be the remaining path after `src/applications`.
2. In the {app_folder}, look at the `manifest.json` file, extract the value for the "rootUrl" key. Provide the following url to the user and try to open it in the browser:
http://localhost:3001/{rootUrl}. If we are in a codespace, the URL may be different.
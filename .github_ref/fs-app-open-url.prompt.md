# Forms app open URL

1. Determine the {app_folder} we are in [instructions](fs-app-locate-folder.prompt.md). The {app_folder} should be the remaining path after `src/applications`
2. In the {app_folder}, look at the `manifest.json` file, extract the value for the "rootUrl" key. Provide the following url to the user and try to open it in the browser:
http://localhost:3001/{rootUrl}
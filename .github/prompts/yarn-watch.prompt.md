---
mode: 'agent'
---

# Forms app yarn watch

## Prerequisites:
Look at [form-app](.github/instructions/form-app.instructions.md) for instructions on how to run the app.
Look at [find-app-folder](.github/prompts/find-app-folder.prompt.md) for instructions on how to find the app folder.

## Instructions
1. Determine the {app_folder} we are in [instructions](.github/prompts/find-app-folder.prompt.md). The {app_folder} should be the remaining path after `src/applications`
2. Look at the manifest.json file in the {app_folder} folder and extract the value for the "entryName" key
3. Run `yarn watch --env entry=${entryName},auth,static-pages,login-page,verify,profile`
   If the user wants to run multiple entries, then check the manifest for each app, and run `yarn watch --env entry=${entryName1},${entryName2},auth,static-pages,login-page,verify,profile`
# Forms app yarn watch

Steps:
1. Determine the {app_folder} we are in [instructions](fs-app-locate-folder.prompt.md). The {app_folder} should be the remaining path after `src/applications`
2. Look at the manifest.json file in the {app_folder} folder and extract the value for the "entryName" key
3. Write the value to `.agent/tmp/context/input.txt`. Overrite if it exists. Only a single line. Do not use the terminal or echo commands. Just edit directly in the IDE.
4. Run task `agent-yarn-watch-current-app`
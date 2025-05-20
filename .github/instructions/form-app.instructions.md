---
applyTo: "**/src/applications/**/*"
---
How to determine the app folder/scope.

A form or app, is often referred to as a number, such as `4142`, or a name, such as `21-4142`. The actual application name may have additional characters such as `21-4142`, or `4142-v2`.

An app lives within the `src/applications/{app-name}` folder or `src/applications/sub-folder/{app-name}`

The app folder should contain a `manifest.json` file, a `pages` folder, and a `config` folder. The `manifest.json` file should contain the entry name for the app. The `pages` folder should contain the pages for the app, and the `config` folder should contain the configuration files for the app. If there is no `pages` folder, then either there may be logic directly in `config/form.js`, or there may be a `chapters` folder instead
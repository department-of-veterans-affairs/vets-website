---
applyTo: "**/src/applications/**/*"
---
Understanding common app directory structure

Usually an application is in `src/applications/{app-name}`, but might be in `src/applications/sub-folder/{app-name}`. The app folder should contain a `manifest.json` file, a `pages` folder, and a `config` folder. The `manifest.json` file should contain the entry name for the app. The `pages` folder should contain the pages for the app, and the `config` folder should contain the configuration files for the app. If there is no `pages` folder, then either there may be logic directly in `config/form.js`, or there may be a `chapters` folder instead.

A form or app, is often referred to as a number, such as `4142`, or a name, such as `21-4142`. The actual application name may have additional characters such as `21-4142`, or `4142-v2`.

src/applications/{optional-sub-folder}/{app-name}

|- app-name
|   |- manifest.json # contains information about the `entryName` for yarn watch, and `rootUrl` for opening in the browser
|   |- pages # usually where RJSF pages are defined, but may be omitted, in which case logic may live in `chapters` or directly in the `config/form.js` file
|   |- config
|       |- form.js # where the entry form RJSF is defined, referencing chapters and pages
|   |- containers
|       |- IntroductionPage.jsx
|       |- ConfirmationPage.jsx 
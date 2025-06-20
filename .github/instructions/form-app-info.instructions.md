---
applyTo: "**/src/applications/**/*"
---

### Understanding Common App Directory Structure

An application is usually located in `src/applications/{app-name}` but might also be in `src/applications/sub-folder/{app-name}`.

The app folder typically contains the following:
- **`manifest.json`**: Contains the `entryName` for `yarn watch` and the `rootUrl` for opening the app in the browser.
- **`pages` folder**: Usually where RJSF pages are defined. If omitted, logic may reside in `chapters` or directly in `config/form.js`.
- **`config` folder**: Contains configuration files, including `form.js`, which defines the entry form for RJSF, referencing chapters and pages.
- **`containers` folder**: Includes key components like `IntroductionPage.jsx` and `ConfirmationPage.jsx`.

#### Notes:
- Apps or forms are often referred to by a number (e.g., `4142`) or a name (e.g., `21-4142`). The actual application name may include additional characters, such as `21-4142` or `4142-v2`.

#### Example Glob for Checking an App's `manifest.json` File:
```bash
src/applications/**/*{app-name}*/manifest.json
```

#### Example Directory Structure:
```
|- app-name
|   |- manifest.json
|   |- pages
|   |- config
|       |- form.js
|   |- containers
|       |- IntroductionPage.jsx
|       |- ConfirmationPage.jsx
```
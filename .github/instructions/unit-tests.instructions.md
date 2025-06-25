---
applyTo: "**/src/applications/**/*unit.spec.jsx"
description: Instructions for unit tests in the forms system
---

## Terminal commands for running unit tests
- `yarn test:unit --app-folder {appName} --log-level all`

Example 1: `yarn test:unit --app-folder simple-forms --log-level all`
Example 2: `yarn test:unit --app-folder simple-forms/21-4142 --log-level all`
Example 3: `yarn test:unit --app-folder 686c-674 --log-level all`
Example 4: `yarn test:unit --app-folder appeals/996 --log-level all`

## File structure for unit tests
File structure may be different from app to app. Here are some common patterns for unit tests in the forms system. The `{app_folder}` is the root folder for the form, also known as `"directoryPath"` in the `src/applications/manifest-catalog.json`. It contains a `manifest.json` file.

### Example 1
{appFolder}
└── tests/
    └── config/
        └── form.unit.spec.jsx
    └── pages/
        └── {page-name}.unit.spec.jsx
    └── chapters/
        └── {chapter-name}.unit.spec.jsx
    └── components/
        └── {component-name}.unit.spec.jsx
    └── containers/
        └── {container-name}.unit.spec.jsx
    └── fixtures/
        └── {fixture-name}.json

### Example 2
{appFolder}
└── tests/
    └── e2e/
        └── fixtures/
            └── {fixture-name}.json
        └── {page-name}.cypress.spec.jsx
    └── unit/
        └── config/
            └── form.unit.spec.jsx
        └── containers/
            └── App.unit.spec.jsx
            └── ConfirmationPage.unit.spec.jsx
            └── IntroductionPage.unit.spec.jsx
        └── pages/
            └── {page-name}.unit.spec.jsx

## Instructions for `**/{page-name}.unit.spec.jsx` unit tests
- [ ] Unit tests should check for the title of the page
- [ ] Unit tests should check for expected fields on the page
- [ ] Unit tests should ensure there are no imposter components (each field is related to a web component)

## Instructions for `**/config/form.unit.spec.jsx` unit tests
- Use an existing form as a reference for the structure of the unit tests.

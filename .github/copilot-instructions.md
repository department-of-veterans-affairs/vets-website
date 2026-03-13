# Copilot Instructions
This is a monorepo for VA.gov, with shared code in `src/platform` and individual React applications under `src/applications`.

## General Instructions
- vets-website uses yarn, Javascript, React, RJSF, Redux, React router, platform/forms-system, platform/forms, and the va.gov design system.
- When installing dependencies, always use `yarn install-safe` instead of `yarn install`.
- Uses Webpack for bundling application assets.
- Use prettier conventions with 2 spaces for indentation, single quotes, and trailing commas.
- When using React, prefer web components such as va-button, va-text-input, or VaButton, VaTextInput, instead of HTML elements.
- When using RJSF, prefer web component patterns from `platform/forms-system/src/js/web-component-patterns` for individual fields for both uiSchema and schema such as textUI and textSchema.
- For unit tests, use mocha, chai, sinon, and prefer RTL over Enzyme.
- For E2E tests, use Cypress.
- Prefer functional components and hooks for new components.
- Files should end with a newline.
- The codebase uses curly apostrophes (') in user-facing text content. Always write straight apostrophes (') instead - eslint will auto-fix them to curly apostrophes. Run `yarn lint:js:changed:fix` after making changes.
- Never use Unicode escape sequences (e.g., `\u2019`) to represent curly apostrophes or other special characters. If you need a curly apostrophe in a string (such as a test assertion matching rendered text), paste the literal character (') directly.
- Use `yarn lint:js:working:fix` to fix formatting issues.
- All code should conform to WCAG 2.2 AA and Section 508 accessibility guidelines.

## Development Commands
- Use `yarn install-safe` to fetch dependencies (run when package.json changes)
- Use `yarn build` to build all applications
- Use `yarn build --entry=app1,app2` to build specific applications
- Use `yarn watch` to run the webpack dev server with hot reloading
- Use `yarn watch --env entry=app1,app2` to limit webpack builds to specific apps
- Use `yarn watch --env api=https://dev-api.va.gov` to use a remote API instead of local
- Use `nohup yarn watch --env entry=app-name > /dev/null 2>&1 &` to run the dev server port 3001 in background
- Application entry names are found in each app's `manifest.json` file under `entryName`
- For Codespaces, use `yarn build:codespaces` for building

## Testing Commands
- Use `yarn test:unit` to run all unit tests
- Use `yarn test:unit path/to/test-file.unit.spec.js` to run a specific test file
- Use `yarn test:unit --app-folder app-name` to run tests for a specific app folder
- Use `yarn test:unit --coverage` to run tests with coverage
- Use `yarn test:coverage-app {app-name}` to run coverage for a specific app
- Use `yarn cy:open` to open Cypress UI test runner for a user
- Use `yarn cy:run:auto --spec "..."` to run Cypress tests with auto dev server, no retries, and structured failure output
- Use `yarn cy:run --spec "..."` for standard Cypress run (requires dev server on port 3001)
- Cypress test files follow the pattern `*.cypress.spec.js`
- Prefer `yarn cy:run:auto` over `yarn cy:run` when running Cypress tests
- Prefer Cypress tests over manual browser testing
- Cypress tests require vets-api to NOT be running (APIs are mocked by tests)

## Additional Testing Options
- Use `yarn test:unit --log-level trace` to run tests with stack traces
- Use `yarn test:unit src/applications/path/to/tests/**/*.unit.spec.js` to run tests with glob patterns
- Use `yarn test:unit --help` for test runner usage help
- Use `yarn cy:run:localreports app-folder` to run Cypress tests with reports

## Mock API Development
- Use `yarn mock-api --responses path/to/responses.js` to run mock API server
- Common API responses available in `src/platform/testing/local-dev-mock-api/common.js`
- To simulate login, use `localStorage.setItem('hasSession', true)` in browser console

## Remote API Development
- When using remote API with `yarn watch --env api=https://dev-api.va.gov`, disable CORS in browser
- Note: ID.me will redirect to the API environment (e.g., dev.va.gov)
- Port 3001 is used for local development server

## Common Utilities
- Use `yarn reset:env` to clean environment (node modules, Babel cache, reinstall)
- Use `yarn lint` to run all linters, `yarn lint:js` for JavaScript only
- Use `yarn lint:js:changed:fix` to fix lint issues in changed files
- Use `yarn update:schema` to update vets-json-schema to latest
- Use `yarn new:app` to create new React applications

## Forms
- For understanding valid uiSchema and schema web component patterns, reference `src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.json`.
- For understanding a form's name, directory path, entryName and rootUrl, reference `src/applications/manifest-catalog.json`.

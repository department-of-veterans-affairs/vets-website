# Repository Guidelines

## Project Structure & Module Organization
- Application entry point: `app-entry.jsx` wires the `manifest.json` config, routes, and reducers.
- The new chatbot feature code lives under `chatbot/` (components, hooks, middleware, reducers, routes, utils). All new development should go here.
- The legacy feature code lives under `webchat/` (components, hooks, middleware, reducers, routes, utils) and `chatbot/` (agent-specific logic).
- Shared files live in `shared/`, and JSDoc style type definitions live in `types/`.
- Styles are in `webchat/sass/virtual-agent.scss`. But will eventually migrate to a new location once the legacy code is removed.
- Tests are colocated under `tests/` with `*.unit.spec.jsx` and `*.cypress.spec.js` naming.

## Build, Test, and Development Commands
- `yarn --cwd $(git rev-parse --show-toplevel) watch --env entry=virtual-agent,auth,terms-of-use,static-pages`: run the app locally with required entry points.
- `yarn --cwd $(git rev-parse --show-toplevel) test:unit --app-folder virtual-agent`: run unit tests for this app.
- `yarn test:coverage-app virtual-agent`: generate coverage report for the virtual-agent app.
- `yarn lint` / `yarn lint:js` / `yarn lint:sass`: run repository linters.

## Coding Style & Naming Conventions
- This is an application for VA.gov so the VADS design system is used. Follow existing component patterns and design tokens when styling, and never use tailwind classes.
- JSDoc types should be used for type definitions in components and functions. If a types is shared, place it in `types/`.
- JavaScript/React code uses 2-space indentation and semicolons; follow existing patterns in `webchat/` and `chatbot/`.
- Test files use `*.unit.spec.jsx` for unit tests and `*.cypress.spec.js` for E2E tests.
- Keep file and export names aligned with component names (e.g., `Chatbox.jsx` exports `Chatbox`).

## Testing Guidelines
- Unit tests run through the repo test runner (`yarn test:unit`), using Testing Library + Chai/Sinon patterns.
- E2E tests run with Cypress; keep specs in `tests/e2e/`.
- Use `yarn test:coverage-app virtual-agent` for coverage when touching UI logic.

## Commit & Pull Request Guidelines
- Recent commits use short, imperative summaries and often include an issue/PR number, e.g., `fix widget spacing (#12345)`.
- PRs should describe scope, list testing performed, and link related issues.
- Include screenshots or recordings for UI changes in the webchat experience.

## Notes for Contributors
- The app entry name is `virtual-agent` (see `manifest.json`); use it in `yarn watch` and test commands.
- For broader repo setup, see `/Users/oddball/Documents/GitHub/va-gov/vets-website/README.md` and `CONTRIBUTING.md`.

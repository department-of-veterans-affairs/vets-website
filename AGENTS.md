# AGENTS.md - VA.gov Frontend Development Guide

This guide provides essential information for AI coding agents working on the VA.gov frontend monorepo.

## Repository Overview

This is the VA.gov frontend monorepo containing React applications under `src/applications/` and shared platform code in `src/platform/`.

**Key Technologies:**

- **Framework:** React 17 with Redux for state management
- **Language:** JavaScript (JSX), limited TypeScript usage
- **Build:** Webpack 5 with Babel transpilation
- **Package Manager:** Yarn 1.19.1 with workspaces
- **Node:** v14.15.0 - v16 (required)
- **Testing:** Mocha/Chai/Sinon for unit tests, Cypress for E2E
- **Design System:** VA.gov Design System web components

## Build & Development Commands

### Installation & Setup

```bash
yarn install-safe          # Always use instead of yarn install
yarn reset:env             # Clean environment and reinstall
```

### Development Server

```bash
yarn watch                                      # Dev server with hot reload (port 3001)
yarn watch --env entry=app1,app2               # Watch specific apps only
yarn watch --env api=https://dev-api.va.gov    # Use remote API
nohup yarn watch --env entry=app-name > /dev/null 2>&1 &  # Run in background
```

### Building

```bash
yarn build                          # Build all applications
yarn build --entry=app1,app2        # Build specific apps
yarn build:production               # Production build
yarn build:codespaces              # Codespaces-specific build
```

### Linting & Formatting

```bash
yarn lint                          # Run all linters (JS + SASS)
yarn lint:js                      # JavaScript linting only
yarn lint:js:changed:fix          # Fix JS lint in changed files (USE AFTER CHANGES)
yarn lint:js:working:fix          # Fix JS lint in working files
yarn lint:sass                    # SASS linting only
```

## Testing Commands

### Unit Testing

```bash
yarn test:unit                                    # Run all unit tests
yarn test:unit path/to/test.unit.spec.js         # Run specific test file
yarn test:unit --app-folder app-name             # Test specific app
yarn test:coverage                               # Run with coverage
yarn test:coverage-app {app-name}                # Coverage for specific app
yarn test:unit --log-level trace                 # Run with stack traces
```

### E2E Testing (Cypress)

```bash
# Step 1: Ensure dev server is running
nohup yarn watch --env entry=app-name > /dev/null 2>&1 &

# Step 2: Run tests
yarn cy:run                                      # Run all tests headless
yarn cy:run --spec "path/to/test.cypress.spec.js"  # Run specific test
yarn cy:open                                     # Open Cypress UI

# Note: vets-api must NOT be running (tests mock APIs)
```

## Code Style Guidelines

### File Naming Conventions

- **Components:** PascalCase (e.g., `UserProfile.jsx`)
- **Utilities:** camelCase (e.g., `formatDate.js`)
- **Unit Tests:** `*.unit.spec.jsx` or `*.unit.spec.js`
- **E2E Tests:** `*.cypress.spec.js`
- **Constants:** UPPER_SNAKE_CASE in files
- **CSS/SCSS:** kebab-case (e.g., `user-profile.scss`)

### JavaScript/React Conventions

```javascript
// Prettier settings (enforced automatically)
// - 2 spaces indentation
// - Single quotes for strings
// - Trailing commas
// - Files must end with newline

// Prefer functional components with hooks
const MyComponent = () => {
  const [state, setState] = useState();
  // Component logic
};

// Use VA Design System web components
import {
  VaButton,
  VaTextInput,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
// Preferred over: <button>, <input>

// Apostrophes: Write straight ('), ESLint auto-converts to curly (')
const message = "Don't worry"; // Write this
// ESLint converts to: "Don't worry"
```

### Import Order & Organization

```javascript
// 1. External dependencies
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// 2. VA Design System components
import { VaButton } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

// 3. Platform imports
import { apiRequest } from 'platform/utilities/api';

// 4. Application imports
import { fetchUserData } from '../actions';

// 5. Styles
import '../styles/MyComponent.scss';
```

### Forms Development (RJSF)

```javascript
// Use web component patterns from platform
import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

// Reference patterns catalog for valid patterns:
// src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.json
```

### Error Handling

```javascript
try {
  const response = await apiRequest('/endpoint');
  return response.data;
} catch (error) {
  // Log to Sentry in production
  recordEvent({ event: 'api-error', 'error-key': error.message });
  // Show user-friendly message
  dispatch(setErrorMessage('We're having trouble loading your information'));
}
```

### Redux Patterns

```javascript
// Action creators
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const fetchUserSuccess = user => ({
  type: FETCH_USER_SUCCESS,
  payload: user,
});

// Reducers - use immutable updates
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
      return { ...state, user: action.payload, loading: false };
    default:
      return state;
  }
};
```

## Application Structure

Each application in `src/applications/` should have:

- `manifest.json` - Defines entry points and configuration
- `app-entry.jsx` - Application entry point
- `routes.jsx` - React Router configuration
- `reducers/` - Redux reducers
- `actions/` - Redux actions
- `components/` - React components
- `tests/` - Unit and E2E tests
- `sass/` or `styles/` - Application styles

## Accessibility Requirements

**ALL code must conform to:**

- WCAG 2.2 AA standards
- Section 508 compliance
- Use semantic HTML and ARIA attributes appropriately
- Test with screen readers
- Ensure keyboard navigation works

## Mock API Development

```bash
yarn mock-api --responses path/to/responses.js
# Common responses: src/platform/testing/local-dev-mock-api/common.js
# Simulate login: localStorage.setItem('hasSession', true) in browser console
```

## Git Workflow & Pre-commit Hooks

- Pre-commit hooks automatically:
  - Fix linting issues
  - Regenerate manifest catalog if changed
  - Regenerate web component patterns catalog if changed
- After making changes, run: `yarn lint:js:changed:fix`
- Commit messages should be descriptive and reference ticket numbers

## Important Notes

1. **NEVER use `yarn install`** - Always use `yarn install-safe`
2. **Port 3001** is the standard dev server port
3. **Files must end with newline** (enforced by linter)
4. **Prefer RTL over Enzyme** for React testing
5. **Use web components** from VA Design System over HTML elements
6. **Check manifests**: Application configs in `src/applications/manifest-catalog.json`
7. **Form patterns**: Reference `web-component-patterns-catalog.json`
8. **Cypress requires** dev server running but NOT vets-api

## Quick Reference for Common Tasks

- **Find app entry name:** Check app's `manifest.json` file
- **Run single test:** `yarn test:unit path/to/specific.unit.spec.js`
- **Fix formatting:** `yarn lint:js:working:fix`
- **Check what apps exist:** `yarn apps` or check `manifest-catalog.json`
- **Create new app:** `yarn new:app`
- **Update schema:** `yarn update:schema`

For detailed documentation, see README.md and CONTRIBUTING.md in the repository root.

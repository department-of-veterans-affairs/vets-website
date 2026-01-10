# Node 18 + JSDOM 22 + MSW 2.x Migration Guide

## Overview

This document describes the migration of vets-website from:
- **Node 14 → Node 18** (environment runs Node 20)
- **JSDOM 15.2.1 → JSDOM 22.1.0**
- **MSW 0.35.0 → MSW 2.x** (2.6.0 specified, 2.12.7 installed)

## Summary of Changes

### Configuration Files

| File | Change |
|------|--------|
| `.nvmrc` | Updated to Node 18 |
| `package.json` | Updated engines to Node 18+ |
| `yarn.lock` | Updated dependencies |
| `config/mocha.json` | Removed blob-polyfill, added `exit:true` |
| `src/platform/testing/package.json` | JSDOM 22.1.0, MSW 2.6.0 |

### Core Test Infrastructure

| File | Changes |
|------|---------|
| `src/platform/testing/unit/mocha-setup.js` | JSDOM 22 compatibility, MSW v2 API |
| `src/platform/testing/unit/helpers.js` | New `mockLocation()` helper |
| `src/platform/testing/unit/msw-adapter.js` | Shared server singleton pattern |

### Platform Test Files Updated

35 files total, including tests in:
- `forms-system/`
- `forms/`
- `utilities/`
- `site-wide/`
- `user/`
- `mhv/`
- `monitoring/`
- `startup/`

---

## Breaking Changes & Migration Patterns

### 1. JSDOM 22: `window.location` is Non-Configurable

**Problem:** In JSDOM 22, `window.location` cannot be redefined using `Object.defineProperty`, `delete window.location`, or `sinon.stub(window, 'location')`.

**Error Message:**
```
TypeError: Cannot redefine property: location
```

**Old Pattern (broken):**
```javascript
// These no longer work in JSDOM 22:
delete window.location;
window.location = { pathname: '/path', assign: sinon.spy() };

// Or:
sinon.stub(window, 'location').value({ pathname: '/path' });
```

**New Pattern:**
```javascript
import { mockLocation } from 'platform/testing/unit/helpers';

describe('MyTest', () => {
  let restoreLocation;

  beforeEach(() => {
    restoreLocation = mockLocation('http://localhost/my-path?query=value');
  });

  afterEach(() => {
    restoreLocation?.();
  });

  it('should work with mocked location', () => {
    expect(window.location.pathname).to.equal('/my-path');
    expect(window.location.search).to.equal('?query=value');
  });
});
```

### 2. mockLocation() Helper Details

The `mockLocation()` function in `src/platform/testing/unit/helpers.js` supports two modes:

#### Same-Origin URLs (uses history API)
```javascript
// For same-origin URLs, uses history.replaceState internally
const restore = mockLocation('http://localhost/path');
// window.location.pathname === '/path'
restore(); // Restores original location
```

#### Cross-Origin URLs (uses window proxy with sinon spies)
```javascript
// For cross-origin URLs, creates a window proxy
const restore = mockLocation('https://dev.va.gov/path');

// Access location properties
window.location.pathname; // '/path'
window.location.origin;   // 'https://dev.va.gov'

// Test navigation methods (sinon spies)
window.location.assign('/new-path');
expect(window.location.assign.calledWith('/new-path')).to.be.true;

window.location.replace('/other-path');
expect(window.location.replace.calledWith('/other-path')).to.be.true;

restore(); // Restores original window
```

### 3. MSW v2 Migration

**Old Pattern (MSW v1):**
```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/data', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ data: 'value' }));
  }),
  rest.post('/api/submit', (req, res, ctx) => {
    return res(ctx.status(204));
  }),
  rest.get('/api/error', (req, res, ctx) => {
    return res.networkError('Network error');
  }),
);
```

**New Pattern (MSW v2):**
```javascript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'platform/testing/unit/msw-adapter';

const server = setupServer(
  http.get('/api/data', () => {
    return HttpResponse.json({ data: 'value' }, { status: 200 });
  }),
  http.post('/api/submit', () => {
    return new HttpResponse(null, { status: 204 });
  }),
  http.get('/api/error', () => {
    return HttpResponse.error(); // No message parameter
  }),
);
```

#### Key MSW v2 Changes:

| v1 | v2 |
|----|-----|
| `rest.get/post/etc` | `http.get/post/etc` |
| `(req, res, ctx) => res(ctx.json(data))` | `() => HttpResponse.json(data)` |
| `res(ctx.status(200), ctx.json(data))` | `HttpResponse.json(data, { status: 200 })` |
| `res(ctx.status(204))` | `new HttpResponse(null, { status: 204 })` |
| `res.networkError('message')` | `HttpResponse.error()` |
| Import from `msw/node` | Import from `platform/testing/unit/msw-adapter` |

#### Network Error Message Change:
```javascript
// MSW v1: Custom error message
res.networkError('Custom error message');
// Error: Custom error message

// MSW v2: Fixed error message
HttpResponse.error();
// Error: Failed to fetch
```

**Test assertion update:**
```javascript
// Old:
expect(error.message).to.equal('Custom error message');

// New:
expect(error.message).to.equal('Failed to fetch');
```

### 4. Shared MSW Server Singleton

**Problem:** Only ONE MSW server instance can be running at a time. The global mocha-setup.js starts a server, so tests must use the shared singleton.

**Solution:** Import `setupServer` from `msw-adapter` instead of `msw/node`:

```javascript
// WRONG - creates duplicate server
import { setupServer } from 'msw/node';

// CORRECT - uses shared singleton
import { setupServer } from 'platform/testing/unit/msw-adapter';
```

The adapter provides:
- `setupServer()` - Returns wrapped server that prevents duplicate listen/close
- `getSharedServer()` - Get the shared server instance
- `createGetHandler()`, `createPostHandler()` - Helper functions
- `jsonResponse()`, `networkError()` - Response helpers

### 5. Node 20 ESM/CJS Compatibility

**Problem:** Node 20 has stricter ESM/CJS interop. Direct mocha calls may fail with:
```
Error: Cannot require() ES Module in a cycle
```

**Solution:** Always set `BABEL_ENV=test`:
```bash
# The run-unit-tests-local.js script already sets this
yarn test:unit --app-folder myapp

# For direct mocha calls, set environment variables:
BABEL_ENV=test NODE_ENV=test npx mocha --config config/mocha.json 'path/to/tests'
```

### 6. Memory Requirements

Large test suites may require increased heap size:
```bash
NODE_OPTIONS="--max-old-space-size=4096" yarn test:unit --app-folder myapp
```

---

## Test Results Summary

### Platform Tests: ✅ All Passing

| Suite | Passing | Pending |
|-------|---------|---------|
| forms-system | 1186 | 11 |
| forms | 394 | 1 |
| utilities | 414 | 1 |
| site-wide | 256 | 0 |
| user | 518 | 0 |
| mhv | 332 | 1 |
| monitoring | 68 | 0 |
| **Total** | **3168** | **14** |

---

## Application Test Migration

Application tests that use the old patterns will need to be updated. Common patterns to search for:

```bash
# Find tests using old location patterns
grep -r "delete window.location" src/applications
grep -r "sinon.stub(window, 'location')" src/applications
grep -r "Object.defineProperty.*location" src/applications

# Find tests using old MSW patterns
grep -r "from 'msw/node'" src/applications
grep -r "rest\." src/applications --include="*.spec.js*"
grep -r "res(ctx\." src/applications
```

### Known Application Test Issues

Some application tests may fail due to:

1. **Location stubbing** - Need `mockLocation()` helper
2. **JSDOM navigation not implemented** - Tests expecting `window.location = '/path'` to actually navigate will see "Not implemented: navigation" error. These tests need to mock the navigation intention rather than expect actual navigation.
3. **MSW v1 patterns** - Need conversion to MSW v2 API

---

## Files Modified

### Infrastructure
- `.nvmrc`
- `package.json`
- `yarn.lock`
- `config/mocha.json`
- `src/platform/testing/package.json`
- `src/platform/testing/unit/mocha-setup.js`
- `src/platform/testing/unit/helpers.js`
- `src/platform/testing/unit/msw-adapter.js`

### Platform Test Files
- `src/platform/forms-system/src/js/patterns/minimal-header/minimalHeader.unit.spec.jsx`
- `src/platform/forms/tests/mock-sip-handlers.js`
- `src/platform/forms/tests/save-in-progress/SaveInProgressDevModal.unit.spec.jsx`
- `src/platform/forms/tests/save-in-progress/actions.unit.spec.jsx`
- `src/platform/mhv/secondary-nav/tests/MhvSecondaryNavMenu.unit.spec.jsx`
- `src/platform/mhv/tests/components/MhvRegisteredUserGuard.unit.spec.jsx`
- `src/platform/mhv/tests/components/MhvServiceRequiredGuard.unit.spec.jsx`
- `src/platform/mhv/tests/hooks/useMyHealthAccessGuard.unit.spec.jsx`
- `src/platform/monitoring/DowntimeNotification/tests/DowntimeApproaching.unit.spec.jsx`
- `src/platform/site-wide/side-nav/tests/components/NavItemRow.unit.spec.jsx`
- `src/platform/site-wide/user-nav/tests/actions/index.unit.spec.jsx`
- `src/platform/site-wide/user-nav/tests/components/SearchHelpSignIn.unit.spec.jsx`
- `src/platform/site-wide/user-nav/tests/containers/AutoSSO.unit.spec.jsx`
- `src/platform/site-wide/user-nav/tests/containers/Main.unit.spec.jsx`
- `src/platform/site-wide/user-nav/tests/mocks/msw-mocks.js`
- `src/platform/startup/tests/react.unit.spec.jsx`
- `src/platform/user/tests/authentication/authentication-hooks.unit.spec.jsx`
- `src/platform/user/tests/authentication/components/CreateAccountLink.unit.spec.jsx`
- `src/platform/user/tests/authentication/components/LoginHeader.unit.spec.jsx`
- `src/platform/user/tests/authentication/components/SessionTimeoutAlert.unit.spec.jsx`
- `src/platform/user/tests/authentication/components/VerifyAccountLink.unit.spec.jsx`
- `src/platform/user/tests/authentication/utilities.unit.spec.jsx`
- `src/platform/user/tests/authorization/components/RequiredLoginView.unit.spec.jsx`
- `src/platform/user/tests/profile/utilities/index.unit.spec.jsx`
- `src/platform/user/widgets/representative-status/tests/repStatusApi.unit.spec.jsx`
- `src/platform/utilities/tests/api/index.unit.spec.jsx`
- `src/platform/utilities/tests/sso/sso.unit.spec.jsx`

---

## Troubleshooting

### "Cannot redefine property: location"
Use `mockLocation()` helper instead of direct location manipulation.

### "Failed to fetch" instead of custom error message
MSW v2 uses a fixed error message. Update test assertions.

### "already patched" or duplicate server errors
Import `setupServer` from `platform/testing/unit/msw-adapter`.

### "Cannot require() ES Module in a cycle"
Ensure `BABEL_ENV=test` is set when running tests.

### Out of memory errors
Add `NODE_OPTIONS="--max-old-space-size=4096"` to test command.

### "Not implemented: navigation"
JSDOM doesn't implement actual navigation. Tests expecting `window.location = '/path'` to navigate need to be refactored to mock the navigation behavior.

# Node.js and DOM Library Upgrade Path

## Executive Summary

This document outlines a recommended incremental upgrade path from Node 14 + jsdom 15 to Node 22 + jsdom 24 (or happy-dom). The key insight is to **decouple the DOM library upgrade from the Node upgrade** by using jsdom 20, which supports both Node 14 and Node 22.

## Current State

| Component | Version | Status |
|-----------|---------|--------|
| Node.js | 14.x | ❌ EOL since April 2023 |
| jsdom | 15.2.1 | Outdated |
| Test Runner | Mocha + Chai | Current |

## Target State

| Component | Version | Status |
|-----------|---------|--------|
| Node.js | 22.x (LTS "Jod") | ✅ Active LTS until April 2027 |
| jsdom | 24.x (or happy-dom) | Current |

## Why Not Upgrade Directly?

The current upgrade branch attempted to jump from Node 14 + jsdom 15 to Node 18 + happy-dom. This introduced two major breaking changes simultaneously:

1. **Node.js runtime changes** (14 → 18)
2. **DOM library API changes** (jsdom → happy-dom)

This made debugging test failures difficult because it was unclear which change caused each failure.

## Node.js LTS Schedule (as of January 2026)

| Version | Codename | Status | End of Life |
|---------|----------|--------|-------------|
| Node 18 | Hydrogen | ❌ EOL | April 2025 |
| Node 20 | Iron | ⚠️ Maintenance | April 2026 |
| Node 22 | Jod | ✅ Active LTS | April 2027 |
| Node 24 | Krypton | ✅ Active LTS | April 2028 |

**Recommendation**: Target Node 22 for maximum support runway.

## DOM Library Compatibility Matrix

| Library | Version | Node 14 | Node 18+ | Node 22+ |
|---------|---------|---------|----------|----------|
| jsdom | 15.x | ✅ | ✅ | ✅ |
| jsdom | 16.x | ✅ | ✅ | ✅ |
| jsdom | 20.x | ✅ | ✅ | ✅ |
| jsdom | 22.x | ❌ | ✅ | ✅ |
| jsdom | 24.x | ❌ | ✅ | ✅ |
| happy-dom | 13+ | ❌ | ✅ | ✅ |

**Key Insight**: jsdom 20.x is the bridge version that works on both Node 14 and Node 22.

---

## Recommended Upgrade Path

### Phase 1: Upgrade jsdom 15 → 20 (on Node 14)

**Goal**: Fix DOM library breaking changes while staying on current Node version.

**Steps**:
1. Update `src/platform/testing/package.json`: change jsdom from `^15.2.1` to `^20.0.3`
2. Run `yarn install`
3. Run unit tests and fix failures
4. Commit and merge

**Expected Breaking Changes (jsdom 15 → 20)**:

| Change | Impact | Mitigation |
|--------|--------|------------|
| Shared constructors removed (v16) | `instanceof` checks across windows may fail | Use duck typing or check constructor names |
| `dom.runVMScript()` removed (v16) | Direct API usage breaks | Replace with `dom.getInternalVMContext()` |
| Promise/TypeError realm change (v18) | `instanceof Promise` may fail | Use `Promise.resolve(val) === val` pattern |
| `crypto.getRandomValues()` added (v20) | Conflicts with polyfills | Remove custom polyfills |
| Focus/blur behavior improvements | Test assertions may fail | Update test expectations |

**Test Fix Priority**:
1. Fix `instanceof` and constructor comparison issues first
2. Fix focus/blur/event handling tests
3. Fix any crypto-related tests

### Phase 2: Upgrade Node 14 → 22

**Goal**: Upgrade Node.js runtime with DOM tests already passing.

**Steps**:
1. Update `.nvmrc` or equivalent to Node 22
2. Update `package.json` engines field:
   ```json
   "engines": {
     "node": ">=22.0.0"
   }
   ```
3. Update CI/CD pipeline Node version
4. Run `yarn install` (regenerates lockfile for new Node)
5. Run full test suite
6. Fix any Node-specific breaking changes
7. Commit and merge

**Expected Breaking Changes (Node 14 → 22)**:
- Native fetch API available (may conflict with polyfills)
- Updated V8 engine (new JavaScript features, stricter behavior)
- OpenSSL 3.x (may affect crypto operations)
- ES modules improvements

### Phase 3 (Optional): Upgrade jsdom 20 → 24 or Switch to happy-dom

**Goal**: Get on latest DOM library for best spec compliance and performance.

**Steps**:
1. Choose target library:
   - **jsdom 24**: More stable API, better spec compliance, slower
   - **happy-dom**: Faster, less stable API, more breaking changes
2. Update dependency
3. Fix any remaining test failures
4. Commit and merge

---

## Detailed jsdom Changelog (v15 → v20)

### v15 → v16 (Biggest Breaking Change)

- **Node.js v10 minimum**
- **Shared constructors removed**: Each `Window` creates new instances of all web platform globals
- **`dom.runVMScript()` removed**: Use `dom.getInternalVMContext()` instead
- **Globals exposure changed**: With `runScripts` disabled, JS globals are aliased from Node.js
- Added: `Range`, `Selection`, `StaticRange`, `AbstractRange`, `window.getSelection()`
- Added: Working constructors for `Comment`, `Text`, `DocumentFragment`
- Fixed: `<template>` works correctly in XML documents
- Fixed: Character encoding detection for `<meta charset>`

### v16 → v17

- **Node.js v12 minimum**
- Minor fixes only

### v17 → v18

- **SSL certificate checking for WebSockets**: Now respects `strictSSL` option
- **Promise/TypeError realm change**: Created in jsdom's realm, not Node.js's
- Fixed: Moving elements between HTML/XML documents

### v18 → v19

- **`nodeLocation()` behavior change**: Returns `undefined` for fragment-parsed nodes
- Fixed: `window.close()` inside load event no longer crashes

### v19 → v20

- **Node.js v14 minimum**
- Added: `crypto.getRandomValues()`
- Added: `HTMLFormControlsCollection`, `RadioNodeList`
- Added: `signal` option to `addEventListener()`
- Fixed: `:root` pseudoclass

---

## Implementation Checklist

### Phase 1: jsdom Upgrade
- [x] Create feature branch from main
- [x] Update jsdom version in `src/platform/testing/package.json` (already at ^20.0.3)
- [x] Run `yarn install` (already done)
- [x] Run `yarn test:unit --app-folder <app>` for each platform module
- [x] Document and categorize test failures
- [x] Fix `instanceof` and constructor issues
  - **Global fix**: Added `HTMLElement` and `Element` getters in `mocha-setup.js` to always return current window's constructors
  - This handles jsdom 16+ breaking change where each window has separate constructors
  - `Element` getter fixes React component library bindings' `attachProps` function
- [x] Fix focus/blur test assertions
  - Fixed by the global HTMLElement getter (affected `getFocusableElements` tests)
  - Updated `ui.unit.spec.jsx` to capture offsets in `beforeEach` instead of describe block
- [x] Fix EventTarget validation errors
  - **Global fix**: Added `global.window` getter/setter proxy in `mocha-setup.js`
  - Tests using `Object.create(global.window)` now work correctly
  - Properties are copied to real window instead of replacing it, preserving EventTarget functionality
- [x] Fix axe-core compatibility
  - **Helper fix**: Updated `axeCheck` in `helpers.js` to re-require axe-core for each test
  - axe-core captures window/document at module load time; re-requiring ensures it uses current JSDOM
  - Added `global.document` getter/setter in `mocha-setup.js` for consistency and temporary overrides
- [x] Fix event handling tests (no changes needed - existing failures are pre-existing)
- [x] Remove crypto polyfills if present
  - jsdom 20 adds `crypto.getRandomValues()` - existing code already handles this correctly
  - Removed obsolete `customElements` mock in `dispute-debt` test
  - **Global fix**: Made `window.crypto` writable in `mocha-setup.js` for tests that mock it
- [x] Run full test suite
- [x] Update any affected documentation
- [ ] Create PR and merge

#### Files Changed in Phase 1
1. `src/platform/testing/unit/mocha-setup.js` - Added global fixes:
   - HTMLElement and Element getters for constructor isolation
   - Window getter/setter proxy for EventTarget preservation
   - Document getter/setter for axe-core compatibility and temporary overrides
   - Made `window.location` and `window.crypto` writable for test mocking
   - Global `addEventListener`/`removeEventListener` stubs for modules that call them at load time (e.g., web-vitals)
2. `src/platform/testing/unit/axe-plugin.js` - Re-require axe-core for each .accessible() call
3. `src/platform/forms-system/test/config/helpers.js` - Re-require axe-core for each axeCheck call
4. `src/platform/forms-system/test/js/utilities/ui.unit.spec.jsx` - Move offset capture to beforeEach
5. `src/applications/dispute-debt/tests/containers/NeedsHelp.unit.spec.jsx` - Remove obsolete customElements mock
6. `.github/workflows/continuous-integration.yml` - Added workflow_dispatch for full test runs
7. `src/platform/utilities/oauth/mockCrypto.js` - Added `setupMockCrypto()` helper, fixed `digest()` to return ArrayBuffer
8. `src/platform/utilities/tests/oauth/utilities.unit.spec.jsx` - Use setupMockCrypto helper
9. `src/platform/utilities/tests/oauth/crypto.unit.spec.jsx` - Use setupMockCrypto helper
10. `src/applications/caregivers/tests/test-helpers/dom-extensions.js` - Move prototype extension to beforeEach hook
11. `script/run-all-app-tests.sh` - New script for parallel test execution across all applications

#### Pre-existing Test Issues (NOT jsdom-related)
These test failures exist on the `main` branch and are unrelated to the jsdom upgrade:

| Application | Issue | Root Cause |
|-------------|-------|------------|
| benefits-optimization-pingwind | scrollTo stub on wrong object | Test stubs `document.body.scrollTo` instead of `window.scrollTo` |
| check-in | Date formatting 1 hour off | Timezone-dependent test (fails in non-UTC) |
| claims-status | TIMEOUT | Slow tests exceeding timeout |
| user-testing | Year validation failure | Date-dependent test (2025 vs 2026) |
| mhv-medications | "Found multiple elements" | Query returns multiple matches |
| representative-form-upload | sessionStorage stub already wrapped | Sinon stub conflict |

### Phase 2: Node Upgrade
- [ ] Create feature branch
- [ ] Update Node version in `.nvmrc`, `package.json`, CI configs
- [ ] Run `yarn install`
- [ ] Run full test suite
- [ ] Fix any Node-specific failures
- [ ] Update Dockerfile if applicable
- [ ] Update CI/CD pipelines
- [ ] Create PR and merge

### Phase 3: Optional Further Upgrades
- [ ] Evaluate jsdom 24 vs happy-dom
- [ ] Update dependency
- [ ] Fix test failures
- [ ] Create PR and merge

---

## Risk Mitigation

1. **Incremental approach**: Each phase is independently mergeable
2. **Rollback capability**: Each phase can be reverted without affecting others
3. **Test isolation**: DOM library changes tested separately from Node changes
4. **CI validation**: All changes validated in CI before merge

## Timeline Estimate

| Phase | Estimated Effort | Risk |
|-------|------------------|------|
| Phase 1: jsdom upgrade | 2-3 weeks | Medium (most test fixes here) |
| Phase 2: Node upgrade | 1 week | Low (tests already passing) |
| Phase 3: Optional upgrade | 1 week | Low |

**Total**: 4-5 weeks

---

## References

- [jsdom Changelog](https://github.com/jsdom/jsdom/blob/main/Changelog.md)
- [Node.js Release Schedule](https://github.com/nodejs/Release)
- [Node.js EOL Dates](https://endoflife.date/nodejs)

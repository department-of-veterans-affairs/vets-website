---
name: cypress
description: Run a Cypress E2E test with automatic dev server management, enhanced error output, and failure diagnosis.
allowed-tools: Bash, Read, Glob, Grep
---

# /cypress — Run Cypress E2E tests

Run Cypress E2E tests with automatic dev server management, structured output, and intelligent failure diagnosis.

## Usage

The user can provide a full spec path, an app name, a form number, or a glob:
```
/cypress src/applications/simple-forms/21-0845/tests/e2e/0845-auth-disclose.cypress.spec.js
/cypress 0845
/cypress adapted-housing
/cypress simple-forms/26-4555
```

## Steps

### 1. Resolve the spec file(s)

If the argument is a full `.cypress.spec.js` path, use it directly.

Otherwise, search for matching spec files from the vets-website root:

```bash
find src/applications -path "*<arg>*" -name "*.cypress.spec.js" 2>/dev/null
```

If multiple specs match, list them and ask the user which to run (unless they said "all").

### 2. Run the test

Use `cy:run:auto`, which starts a dev server on a free port, runs with no retries/video, and tears down after:

```bash
yarn cy:run:auto --spec "<spec-path>" --summary-only
```

This handles everything: resolves entryName, finds a free port, starts `yarn watch`, waits for compilation, runs Cypress, and cleans up after.

**Fast mode:** If the user already has a dev server running on port 3001 (check with `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001`), you can skip the auto server for faster iteration (~5s vs ~60s):

```bash
yarn cy:run --no-retry --no-video --spec "<spec-path>" --summary-only
```

### 3. Handle results

**On PASSED:** Report success with test count and duration. Keep it brief.

**On FAILED:** The summary output includes:
- **COMMAND LOG** — the full Cypress sidebar command sequence (every cy.get, cy.click, assertion)
- **SCREENSHOTS** — paths to failure screenshot images
- **DIAGNOSTICS** — automatic detection of common issues

Do the following:
1. Read the COMMAND LOG to understand what sequence of actions led to the failure
2. Read the error message to understand what specifically broke
3. If screenshot paths are listed, **read the screenshot image files** — they show the actual page state at failure time (red validation errors, missing elements, wrong page)
4. Correlate command log + error + screenshot to diagnose the root cause
5. Report concisely: what the test tried to do, what broke, what the page showed, and your fix recommendation

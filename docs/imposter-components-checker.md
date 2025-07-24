# Imposter Components Checker

This script helps identify "imposter components" - native HTML elements that should be replaced with VA web components for better accessibility and consistency.

## Usage

```bash
yarn cy:checkImposterComponents --path <application-folder-or-file-path>
```

### Examples

```bash
# Check a specific application (all tests)
yarn cy:checkImposterComponents --path "appeals/995"

# Check a form application (all tests)
yarn cy:checkImposterComponents --path "simple-forms/20-10207"

# Check an application with subfolders (all tests)
yarn cy:checkImposterComponents --path "financial-status-report"

# Check a specific test file
yarn cy:checkImposterComponents --path "appeals/995/tests/e2e/995-mst.cypress.spec.js"

# Check a specific test file in a subfolder
yarn cy:checkImposterComponents --path "simple-forms/20-10207/tests/e2e/10207-pp.cypress.spec.js"
```

## What it does

1. Runs Cypress e2e tests for the specified application folder or specific test file
2. Scans pages for native HTML elements that should be VA web components
3. Generates a report showing:
   - Element type (button, input, etc.)
   - Suggested VA web component replacement
   - Location (page path, ID, class, text content)

### Supported path types

- **Application folder**: Runs all `.cypress.spec.js` files in the application
- **Specific test file**: Runs only the specified `.cypress.spec.js` file

## Elements it checks for

- `button` → `va-button`
- `input` → `va-text-input` (or `va-checkbox` for checkboxes)
- `select` → `va-select`
- `textarea` → `va-textarea`
- `a` → `va-link`

## Output

The script will:
- Display results in the console with color coding
- Save detailed results to `cypress/component-usage-report.json`
- Group results by component type for easy review

## Integration with existing tests

You can also enable imposter component checking in individual test files by adding the `checkForImposterComponents: true` option to your `testConfig`:

```javascript
const testConfig = createTestConfig(
  {
    // ... other config
    checkForImposterComponents: true,
  },
  manifest,
  formConfig,
);
```

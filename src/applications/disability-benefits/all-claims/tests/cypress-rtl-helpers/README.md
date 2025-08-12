# Cypress RTL Helpers

A comprehensive set of helper functions that promote React Testing Library (RTL) best practices while working with Cypress. These helpers abstract common patterns in VA.gov form testing and provide consistent, accessible ways to interact with form elements.

## Module Structure

```bash
cypress-rtl-helpers/
├── index.js              # Barrel file - main entry point
├── constants.js          # Shared constants (timeouts, selectors, etc.)
├── navigation.js         # Navigation-related helpers
├── form-interactions.js  # Form interaction helpers
├── components.js         # VA Web Components specific helpers
├── disability-helpers.js # Disability form specific helpers
├── mocking.js           # Test setup and mocking helpers
├── assertions.js        # Assertion helpers
└── README.md            # This file
```

## Usage

### Import individual helpers

```javascript
import {
  next,
  selectNo,
  modalVisible,
  setupMocks,
} from './cypress-rtl-helpers';
```

### Import everything

```javascript
import * as helpers from './cypress-rtl-helpers';

// Use as:
helpers.next();
helpers.selectNo();
```

### Import specific modules

```javascript
import {
  next,
  navigateThrough,
} from './cypress-rtl-helpers/navigation';
import {
  selectNo,
  fillText,
} from './cypress-rtl-helpers/form-interactions';
```

## Helper Categories

### Navigation Helpers (`navigation.js`)

- `next()` - Clicks the Continue button
- `back()` - Clicks the Back button
- `navigateThrough(pageNames)` - Navigates through multiple pages
- `waitForPath(pathInclude)` - Waits for navigation to complete
- `skipWizard()` - Skips the intro wizard
- `startApp()` - Starts the disability application
- `goToToxicExposure()` - Navigates to toxic exposure section

### Form Interaction Helpers (`form-interactions.js`)

- `selectRadio(labelText)` - Selects a radio by label
- `fillText(labelText, value)` - Fills a text input
- `fillTextarea(labelText, value)` - Fills a textarea
- `selectOption(labelText, optionText)` - Selects dropdown option
- `check(labelText)` - Checks a checkbox
- `uncheck(labelText)` - Unchecks a checkbox
- `selectNo(options)` - Selects "No" radio option
- `selectYes(options)` - Selects "Yes" radio option
- `selectValue(value)` - Selects radio by value attribute
- `fillService(dates, periodIndex)` - Fills military service dates
- `fillCondition(cause, description)` - Fills condition follow-up

### VA Components Helpers (`components.js`)

- `clickVA(componentSelector)` - Interacts with VA web components
- `checkboxState(value, shouldBeChecked)` - Verifies VA checkbox state
- `modalButton(buttonText, options)` - Clicks button in VA modal
- `modalVisible(shouldBeVisible, options)` - Verifies modal visibility
- `modalContains(expectedContent, options)` - Verifies modal content
- `alertExists(status, text, options)` - Verifies VA alert

### Disability-Specific Helpers (`disability-helpers.js`)

- `addCondition(condition, index)` - Adds a disability condition

### Mocking Helpers (`mocking.js`)

- `setupMocks(options)` - Sets up standard API mocks

### Assertion Helpers (`assertions.js`)

- `textExists(text)` - Verifies text exists on page

## Best Practices

1. **Use accessible queries**: These helpers prioritize accessible queries like `findByRole`, `findByLabelText`, and `findByText`.

2. **Handle async operations**: The helpers include appropriate waits and retries for async operations.

3. **Support VA components**: Special handling for VA web components that use Shadow DOM.

4. **Provide clear logs**: Helpers include logging to make test debugging easier.

5. **Error handling**: Helpers validate required parameters and provide clear error messages.

## Contributing

When adding new helpers:

1. Place them in the appropriate module file
2. Export them from that module
3. Re-export them from `index.js`
4. Document them in this README
5. Add JSDoc comments for better IDE support

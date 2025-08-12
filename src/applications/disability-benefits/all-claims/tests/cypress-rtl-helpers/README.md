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
  clickContinue,
  selectNo,
  verifyModalVisibility,
  setupStandardMocks,
} from './cypress-rtl-helpers';
```

### Import everything

```javascript
import * as helpers from './cypress-rtl-helpers';

// Use as:
helpers.clickContinue();
helpers.selectNo();
```

### Import specific modules

```javascript
import {
  clickContinue,
  navigateThroughPages,
} from './cypress-rtl-helpers/navigation';
import {
  selectNo,
  fillTextInput,
} from './cypress-rtl-helpers/form-interactions';
```

## Helper Categories

### Navigation Helpers (`navigation.js`)

- `clickContinue()` - Click the Continue button
- `clickBack()` - Click the Back button
- `navigateThroughPages(pageNames)` - Navigate through multiple pages
- `waitForPageNavigation(pathInclude)` - Wait for navigation to complete
- `skipWizard()` - Skip the intro wizard
- `startApplication()` - Start the disability application
- `navigateToToxicExposureConditions()` - Navigate to toxic exposure section

### Form Interaction Helpers (`form-interactions.js`)

- `selectRadioOption(labelText)` - Select a radio by label
- `fillTextInput(labelText, value)` - Fill a text input
- `fillTextarea(labelText, value)` - Fill a textarea
- `selectDropdownOption(labelText, optionText)` - Select dropdown option
- `checkCheckbox(labelText)` - Check a checkbox
- `uncheckCheckbox(labelText)` - Uncheck a checkbox
- `selectNo(options)` - Select "No" radio option
- `selectYes(options)` - Select "Yes" radio option
- `selectRadioByValue(value)` - Select radio by value attribute
- `fillServicePeriod(dates, periodIndex)` - Fill military service dates
- `fillConditionFollowUp(cause, description)` - Fill condition follow-up

### VA Components Helpers (`components.js`)

- `interactWithVAComponent(componentSelector)` - Interact with VA web components
- `verifyVACheckboxState(value, shouldBeChecked)` - Verify VA checkbox state
- `clickModalButton(buttonText, options)` - Click button in VA modal
- `verifyModalVisibility(shouldBeVisible, options)` - Verify modal visibility
- `verifyModalContent(expectedContent, options)` - Verify modal content
- `verifyAlert(status, text, options)` - Verify VA alert

### Disability-Specific Helpers (`disability-helpers.js`)

- `addDisabilityCondition(condition, index)` - Add a disability condition

### Mocking Helpers (`mocking.js`)

- `setupStandardMocks(options)` - Set up standard API mocks

### Assertion Helpers (`assertions.js`)

- `verifyTextExists(text)` - Verify text exists on page

## Best Practices

1. **Use accessible queries**: These helpers prioritize accessible queries like `findByRole`, `findByLabelText`, and `findByText`.

2. **Handle async operations**: The helpers include appropriate waits and retries for async operations.

3. **Support VA components**: Special handling for VA web components that use Shadow DOM.

4. **Provide clear logs**: Helpers include logging to make test debugging easier.

5. **Error handling**: Helpers validate required parameters and provide clear error messages.

## Migration from Old Structure

The original `cypress-rtl-helpers.js` file has been preserved for backward compatibility. It now re-exports all helpers from the modular structure. For new tests, import directly from the modular structure for better tree-shaking and clearer imports.

### Old way (still works)

```javascript
import { clickContinue, selectNo } from './cypress-rtl-helpers';
```

### New way (recommended)

```javascript
import { clickContinue } from './cypress-rtl-helpers/navigation';
import { selectNo } from './cypress-rtl-helpers/form-interactions';
```

## Contributing

When adding new helpers:

1. Place them in the appropriate module file
2. Export them from that module
3. Re-export them from `index.js`
4. Document them in this README
5. Add JSDoc comments for better IDE support

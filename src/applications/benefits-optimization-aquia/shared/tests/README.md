# BIO Cypress Test Helpers

RTL-inspired Cypress helpers for testing Benefits Optimization Aquia (BIO) forms.

## Overview

These helpers provide a consistent, reliable way to interact with BIO custom components and va-* web components in Cypress e2e tests. They handle the complexity of shadow DOM traversal and web component interactions.

## Installation

Import the helpers you need in your Cypress spec file:

```javascript
import {
  clickContinue,
  fillVeteranInformation,
  fillVeteranContactInformation,
  fillTextInput,
  fillMemorableDate,
  fillAddress,
  selectRadio,
  fillTextarea,
} from '@bio-aquia/shared/tests/cypress-helpers';
```

## API Reference

### Field Filling Functions

#### `fillTextInput(name, value)`

Fill a `va-text-input` web component.

```javascript
fillTextInput('firstName', 'John');
fillTextInput('employerName', 'Acme Corp');
```

#### `fillMemorableDate(name, dateString)`

Fill a `va-memorable-date` web component with a date in `YYYY-MM-DD` format.

```javascript
fillMemorableDate('dateOfBirth', '1980-01-15');
fillMemorableDate('beginningDate', '2020-01-01');
```

#### `fillTextarea(name, value)`

Fill a `va-textarea` web component.

```javascript
fillTextarea('remarks', 'Additional information here');
fillTextarea('concessions', 'Flexible schedule provided');
```

#### `selectRadio(label, value)`

Select a radio option in a `va-radio` component by finding the radio group by its label text.

```javascript
selectRadio('Was a lump sum payment made?', 'yes');
selectRadio('Currently employed', 'true');
```

#### `selectRadioByValue(value)`

Select a radio option directly by its value attribute, without needing to find the parent radio group.
This is useful when the label is dynamic or you want a simpler selector.

```javascript
selectRadioByValue('yes');
selectRadioByValue('no');
```

#### `selectRadioAndWait(value, waitTime)`

Select a radio option and wait for React state to update and render conditional fields.
This method properly triggers the web component's custom event that React listens for.
Use this when selecting a radio triggers conditional rendering.

```javascript
// Select 'yes' and wait 1000ms for conditional fields to appear
selectRadioAndWait('yes', 1000);

// Select 'no' and wait default 500ms
selectRadioAndWait('no');
```

#### `fillAddress(prefix, address)`

Fill an address using BIO `AddressField` component.

```javascript
fillAddress('employerAddress', {
  street: '123 Main St',
  street2: 'Suite 100',
  city: 'Springfield',
  state: 'IL',
  postalCode: '62701',
  country: 'USA',
});
```

### Navigation Functions

#### `clickContinue()`

Click the Continue button on BIO custom page template.

```javascript
clickContinue();
```

#### `clickBack()`

Click the Back button on BIO custom page template.

```javascript
clickBack();
```

#### `clickUpdate()`

Click the Update button on BIO review page.

```javascript
clickUpdate();
```

### Common Page Filling Functions

#### `fillVeteranInformation(data)`

Fill the veteran information page (firstName, lastName, dateOfBirth).

```javascript
cy.get('@testData').then(data => {
  fillVeteranInformation(data);
});
```

Expected data structure:
```json
{
  "veteranInformation": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1980-01-15"
  }
}
```

#### `fillVeteranContactInformation(data)`

Fill the veteran contact information page (ssn, vaFileNumber).

```javascript
cy.get('@testData').then(data => {
  fillVeteranContactInformation(data);
});
```

Expected data structure:
```json
{
  "veteranContactInformation": {
    "ssn": "123-45-6789",
    "vaFileNumber": "12345678"
  }
}
```

### Advanced Functions

#### `fillBIOPage(data)`

Automatically detect field types and fill them appropriately. Useful for simple pages.

```javascript
cy.get('@testData').then(testData => {
  fillBIOPage({
    firstName: testData.firstName,
    lastName: testData.lastName,
    dateOfBirth: testData.dateOfBirth,
  });
});
```

#### `createBIOPageHooks(pageDataMap)`

Create page hooks for multiple pages at once (useful for forms with many similar pages).

```javascript
const pageHooks = createBIOPageHooks({
  'page-1': data => data.page1Data,
  'page-2': data => data.page2Data,
  'page-3': data => data.page3Data,
});
```

## Usage Example

### Complete Page Hook Example

```javascript
import {
  clickContinue,
  fillVeteranInformation,
  fillTextInput,
  fillMemorableDate,
  selectRadio,
} from '@bio-aquia/shared/tests/cypress-helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: 'applications/my-form/tests/fixtures/data',
    dataSets: ['minimal-test', 'maximal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByTestId('start-form-link').click();
        });
      },
      'veteran-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillVeteranInformation(data);
          });
          clickContinue();
        });
      },
      'employer-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const empInfo = data.employerInformation;
            fillTextInput('employerName', empInfo.employerName);
            fillAddress('employerAddress', empInfo.employerAddress);
          });
          clickContinue();
        });
      },
      'employment-dates': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const dates = data.employmentDates;
            fillMemorableDate('beginningDate', dates.beginningDate);
            selectRadio('currentlyEmployed', dates.currentlyEmployed ? 'true' : 'false');
          });
          clickContinue();
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
      cy.login(mockUser);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
```

## Best Practices

1. **Always use helpers for web components** - They handle shadow DOM complexity
2. **Check for null/undefined** - Helpers safely handle missing data
3. **Use semantic names** - Field names should match the component's `name` attribute
4. **Combine with @testData** - Always access test data through the Cypress alias
5. **Call clickContinue() after filling** - Don't forget to navigate to the next page

## Troubleshooting

### Field not found

If a helper can't find a field, check:
1. The field's `name` attribute in the component
2. The field is rendered (not conditionally hidden)
3. The component has finished hydrating (web components take time to load)

### Date not filling correctly

Make sure the date is in `YYYY-MM-DD` format:
- ✅ `"2023-01-15"`
- ❌ `"01/15/2023"`
- ❌ `"2023-1-15"`

### Radio not selecting

Radio values should match exactly:
- For boolean fields: `'true'` or `'false'` (strings)
- For yes/no fields: `'yes'` or `'no'`

## Contributing

When adding new helpers:
1. Follow the RTL-inspired naming convention (`fill*`, `select*`, `click*`)
2. Handle null/undefined values gracefully
3. Add JSDoc comments with examples
4. Update this README with usage examples

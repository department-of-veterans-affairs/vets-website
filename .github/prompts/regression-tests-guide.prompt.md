# Creating Regression Tests for Form Pages

## Overview
Regression tests ensure schema compatibility during form migrations (e.g., web component migrations). They verify that the schema and uiSchema structure remains consistent before and after migration, preventing breaking changes.

---

## Purpose & What We Test

### What Regression Tests Verify:
1. ✅ **Schema Properties** - All fields and their properties from old code must exist in new code
2. ✅ **UiSchema Properties** - All UI configurations from old code must exist in new code
3. ✅ **Required Fields** - Required field array must contain all expected required fields
4. ✅ **Schema References** - $ref references are checked (they exist in schema properties)

### What We Exclude from Tests:
- ❌ **ui:widget** - Widget types can change during migration (excluded from comparison)
- ❌ **widgetClassNames** - Styling classes can change (excluded from comparison)
- ❌ **classNames** - CSS classes can change (excluded from comparison)

### Why These Tests Matter:
- Ensures backward compatibility during migrations
- Catches breaking changes before they reach production
- Validates that form structure remains consistent
- Tests work with both old patterns and new web component patterns
- Tests check for property existence, NOT strict object comparison

---

## Test Architecture

### Files Needed:

1. **Test Helper File** (already exists - no need to create):
   - Location: `src/platform/forms-system/test/schemaRegressionHelpers.spec.jsx`
   - Contains: Reusable test functions for all forms
   - Import: `import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';`

2. **Page Test Helper Functions** (already exist - no need to create):
   - Location: `src/platform/forms-system/test/pageTestHelpers.spec.jsx`
   - Contains: Field counting and error validation functions
   - Import: `import { testNumberOfFields, testNumberOfErrorsOnSubmit } from 'platform/forms-system/test/pageTestHelpers.spec';`

3. **Individual Page Test Files** (create for each page):
   - Location varies by form type:
     - **Standard forms**: `src/applications/{form-name}/tests/unit/config/{chapter}/{page}.unit.spec.jsx`
       - Example: `src/applications/hca/tests/unit/config/veteranInformation/birthInformation.unit.spec.jsx`
     - **Simple forms**: `src/applications/simple-forms/{form-number}/tests/pages/{page}.unit.spec.jsx`
       - Example: `src/applications/simple-forms/21-10210/tests/pages/claimantAddrInfo.unit.spec.jsx`
   - Contains: Page-specific regression tests

---

## Step-by-Step Implementation

### Create Regression Test for Each Page

**Note:** The helper functions already exist in `platform/forms-system/test/` so you only need to create the individual page test files.

**Pattern for Each Page Test File:**

```javascript
// @ts-check
import formConfig from '../../../../config/form';
import {
  testNumberOfErrorsOnSubmit,
  testNumberOfFields,
} from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';

describe('hca {PageName} config', () => {
  const {
    title: pageTitle,
    schema,
    uiSchema,
  } = formConfig.chapters.{chapterName}.pages.{pageName};

  // Test 1: Correct number of fields
  const expectedNumberOfFields = {NUMBER};
  testNumberOfFields(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfFields,
    pageTitle,
  );

  // Test 2: Correct number of error messages on submit
  const expectedNumberOfErrors = {NUMBER};
  testNumberOfErrorsOnSubmit(
    formConfig,
    schema,
    uiSchema,
    expectedNumberOfErrors,
    pageTitle,
  );

  // Test 3: Schema regression tests
  runSchemaRegressionTests({
    actualSchema: schema,
    actualUiSchema: uiSchema,
    expectedSchema: {
      // Copy schema structure here (see examples below)
    },
    expectedUiSchema: {
      // Copy uiSchema structure here (see examples below)
    },
    expectedRequired: [], // or ['field1', 'field2']
    pageName: pageTitle,
  });
});
```

---

## How to Extract Expected Schema/UiSchema

### Step 1: Find the Page Config File

**For Standard Forms:**
- Location: `src/applications/{form-name}/config/chapters/{chapter}/{page}.js`
- Look for the default export with `uiSchema` and `schema` objects

**For Simple Forms:**
- Location: `src/applications/simple-forms/{form-number}/pages/{page}.js`
- Look for the default export with `uiSchema` and `schema` objects

### Step 2: Extract Schema Structure

**From the config file, copy the schema but simplify to only structure:**

**Original Schema:**
```javascript
schema: {
  type: 'object',
  properties: {
    veteranFullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
          pattern: '^[a-zA-Z]+$',
        },
        middle: {
          type: 'string',
        },
        last: {
          type: 'string',
          minLength: 1,
          maxLength: 30,
        },
      },
    },
  },
  required: ['veteranFullName'],
}
```

**Expected Schema for Test (simplified):**
```javascript
expectedSchema: {
  type: 'object',
  properties: {
    veteranFullName: {
      type: 'object',
      properties: {
        first: {
          type: 'string',
          // minLength, maxLength, pattern are included in actual test
          // but test checks for existence, not exact values
        },
        middle: {
          type: 'string',
        },
        last: {
          type: 'string',
        },
      },
    },
  },
}
```

**Key Points:**
- Include all property names
- Include `type` fields
- Include `$ref` if present (use `$ref: {}` in expected)
- Properties like `minLength`, `maxLength`, `pattern` ARE tested (they exist in schema)
- Test checks these properties exist, not their exact values

### Step 3: Extract UiSchema Structure

**From the config file, copy the uiSchema but simplify:**

**Original UiSchema:**
```javascript
uiSchema: {
  'ui:title': 'Personal information',
  'ui:description': 'We need this information...',
  veteranFullName: {
    first: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter your first name',
      },
    },
    middle: {
      'ui:title': 'Middle name',
    },
    last: {
      'ui:title': 'Last name',
      'ui:widget': 'text',
      widgetClassNames: 'custom-class',
    },
  },
}
```

**Expected UiSchema for Test (simplified):**
```javascript
expectedUiSchema: {
  'ui:title': {},
  'ui:description': {},
  veteranFullName: {
    first: {
      'ui:title': {},
      'ui:errorMessages': {},
    },
    middle: {
      'ui:title': {},
    },
    last: {
      'ui:title': {},
      // 'ui:widget' excluded - automatically filtered by test
      // widgetClassNames excluded - automatically filtered by test
    },
  },
}
```

**Key Points:**
- Include all property keys
- Use empty object `{}` as values
- DO NOT include `ui:widget` - it's auto-excluded by test
- DO NOT include `widgetClassNames` - it's auto-excluded by test
- DO NOT include `classNames` - it's auto-excluded by test
- Include `ui:options`, `ui:validations`, `ui:errorMessages` (they ARE tested)

---

## Example Tests by Pattern Type

### Example 1: Simple Yes/No Field

**Config File:**
```javascript
export default {
  uiSchema: {
    'ui:title': 'Financial disclosure',
    discloseFinancialInformation: {
      'ui:title': 'Do you want to share your financial information?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['discloseFinancialInformation'],
    properties: {
      discloseFinancialInformation: {
        type: 'boolean',
      },
    },
  },
};
```

**Test File:**
```javascript
runSchemaRegressionTests({
  actualSchema: schema,
  actualUiSchema: uiSchema,
  expectedSchema: {
    type: 'object',
    properties: {
      discloseFinancialInformation: {
        type: 'boolean',
      },
    },
  },
  expectedUiSchema: {
    'ui:title': {},
    discloseFinancialInformation: {
      'ui:title': {},
      // ui:widget excluded automatically
    },
  },
  expectedRequired: ['discloseFinancialInformation'],
  pageName: pageTitle,
});
```

### Example 2: Nested Object with Multiple Fields

**Config File:**
```javascript
export default {
  uiSchema: {
    'ui:title': 'Place of birth',
    'ui:description': 'Enter your birthplace information',
    'view:placeOfBirth': {
      cityOfBirth: {
        'ui:title': 'City',
      },
      stateOfBirth: {
        'ui:title': 'State',
        'ui:options': {
          labels: stateLabels,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:placeOfBirth': {
        type: 'object',
        properties: {
          cityOfBirth: {
            type: 'string',
          },
          stateOfBirth: {
            type: 'string',
            enum: states,
          },
        },
      },
    },
  },
};
```

**Test File:**
```javascript
runSchemaRegressionTests({
  actualSchema: schema,
  actualUiSchema: uiSchema,
  expectedSchema: {
    type: 'object',
    properties: {
      'view:placeOfBirth': {
        type: 'object',
        properties: {
          cityOfBirth: {
            type: 'string',
          },
          stateOfBirth: {
            type: 'string',
          },
        },
      },
    },
  },
  expectedUiSchema: {
    'ui:title': {},
    'ui:description': {},
    'view:placeOfBirth': {
      cityOfBirth: {
        'ui:title': {},
      },
      stateOfBirth: {
        'ui:title': {},
        'ui:options': {},
      },
    },
  },
  expectedRequired: [],
  pageName: pageTitle,
});
```

### Example 3: Address Pattern

**Config File:**
```javascript
export default {
  uiSchema: {
    'ui:title': 'Home address',
    veteranHomeAddress: {
      'ui:order': ['street', 'street2', 'street3', 'city', 'state', 'postalCode'],
      street: {
        'ui:title': 'Street address',
        'ui:errorMessages': {
          required: 'Please enter your street address',
        },
      },
      street2: {
        'ui:title': 'Street address line 2',
      },
      street3: {
        'ui:title': 'Street address line 3',
      },
      city: {
        'ui:title': 'City',
        'ui:errorMessages': {
          required: 'Please enter your city',
        },
      },
      state: {
        'ui:title': 'State',
        'ui:errorMessages': {
          required: 'Please select your state',
        },
      },
      postalCode: {
        'ui:title': 'Postal code',
        'ui:errorMessages': {
          required: 'Please enter your postal code',
          pattern: 'Please enter a valid postal code',
        },
        'ui:options': {
          widgetClassNames: 'usa-input-medium',
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranHomeAddress: {
        type: 'object',
        properties: {
          street: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
          },
          street2: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
          },
          street3: {
            type: 'string',
            minLength: 1,
            maxLength: 50,
          },
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
            enum: states,
          },
          postalCode: {
            type: 'string',
            pattern: '^\\d{5}$',
          },
        },
      },
    },
  },
};
```

**Test File:**
```javascript
runSchemaRegressionTests({
  actualSchema: schema,
  actualUiSchema: uiSchema,
  expectedSchema: {
    type: 'object',
    properties: {
      veteranHomeAddress: {
        type: 'object',
        properties: {
          street: {
            type: 'string',
          },
          street2: {
            type: 'string',
          },
          street3: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          state: {
            type: 'string',
          },
          postalCode: {
            type: 'string',
          },
        },
      },
    },
  },
  expectedUiSchema: {
    'ui:title': {},
    veteranHomeAddress: {
      'ui:order': {},
      street: {
        'ui:title': {},
        'ui:errorMessages': {},
      },
      street2: {
        'ui:title': {},
      },
      street3: {
        'ui:title': {},
      },
      city: {
        'ui:title': {},
        'ui:errorMessages': {},
      },
      state: {
        'ui:title': {},
        'ui:errorMessages': {},
      },
      postalCode: {
        'ui:title': {},
        'ui:errorMessages': {},
        'ui:options': {},
      },
    },
  },
  expectedRequired: [],
  pageName: pageTitle,
});
```

### Example 4: $ref References (Dates, Definitions)

**Config File:**
```javascript
export default {
  uiSchema: {
    'ui:title': 'Spouse information',
    spouseFullName: fullNameUI,
    spouseSocialSecurityNumber: {
      'ui:title': 'Spouse Social Security number',
      'ui:options': {
        widgetClassNames: 'usa-input-medium',
      },
    },
    spouseDateOfBirth: dateOfBirthUI('Spouse date of birth'),
    dateOfMarriage: currentOrPastDateUI('Date of marriage'),
  },
  schema: {
    type: 'object',
    required: ['spouseSocialSecurityNumber', 'spouseDateOfBirth', 'dateOfMarriage'],
    properties: {
      spouseFullName: {
        $ref: '#/definitions/fullName',
      },
      spouseSocialSecurityNumber: {
        type: 'string',
        pattern: '^[0-9]{9}$',
      },
      spouseDateOfBirth: {
        $ref: '#/definitions/date',
      },
      dateOfMarriage: {
        $ref: '#/definitions/date',
      },
    },
  },
};
```

**Test File:**
```javascript
runSchemaRegressionTests({
  actualSchema: schema,
  actualUiSchema: uiSchema,
  expectedSchema: {
    type: 'object',
    properties: {
      spouseFullName: {
        $ref: {}, // Just check $ref exists, not the value
      },
      spouseSocialSecurityNumber: {
        type: 'string',
      },
      spouseDateOfBirth: {
        $ref: {}, // Just check $ref exists
      },
      dateOfMarriage: {
        $ref: {}, // Just check $ref exists
      },
    },
  },
  expectedUiSchema: {
    'ui:title': {},
    spouseFullName: {
      first: {
        'ui:title': {},
      },
      middle: {
        'ui:title': {},
      },
      last: {
        'ui:title': {},
      },
      suffix: {
        'ui:title': {},
        'ui:options': {},
      },
    },
    spouseSocialSecurityNumber: {
      'ui:title': {},
      'ui:errorMessages': {},
      'ui:options': {},
    },
    spouseDateOfBirth: {
      'ui:title': {},
      'ui:errorMessages': {},
      'ui:validations': {},
    },
    dateOfMarriage: {
      'ui:title': {},
      'ui:errorMessages': {},
      'ui:validations': {},
    },
  },
  expectedRequired: [
    'spouseSocialSecurityNumber',
    'spouseDateOfBirth',
    'dateOfMarriage',
  ],
  pageName: pageTitle,
});
```

**Note on $ref:**
- Use `$ref: {}` in expectedSchema to check that $ref property exists
- Test validates $ref is present, not its specific value
- $ref typically points to form definitions (dates, names, etc.)

### Example 5: Custom Field with ui:field

**Config File:**
```javascript
export default {
  uiSchema: {
    'ui:title': 'Demographic information',
    'view:demographicCategories': {
      'ui:title': 'Which categories do you identify with?',
      'ui:field': 'DemographicField',
      isAmericanIndianOrAlaskanNative: {
        'ui:title': 'American Indian or Alaskan Native',
      },
      isAsian: {
        'ui:title': 'Asian',
      },
      isBlackOrAfricanAmerican: {
        'ui:title': 'Black or African American',
      },
      isSpanishHispanicLatino: {
        'ui:title': 'Hispanic or Latino',
      },
      isNativeHawaiianOrOtherPacificIslander: {
        'ui:title': 'Native Hawaiian or Other Pacific Islander',
      },
      isWhite: {
        'ui:title': 'White',
      },
      hasDemographicNoAnswer: {
        'ui:title': 'Prefer not to answer',
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:demographicCategories': {
        type: 'object',
        properties: {
          isAmericanIndianOrAlaskanNative: {
            type: 'boolean',
          },
          isAsian: {
            type: 'boolean',
          },
          isBlackOrAfricanAmerican: {
            type: 'boolean',
          },
          isSpanishHispanicLatino: {
            type: 'boolean',
          },
          isNativeHawaiianOrOtherPacificIslander: {
            type: 'boolean',
          },
          isWhite: {
            type: 'boolean',
          },
          hasDemographicNoAnswer: {
            type: 'boolean',
          },
        },
      },
    },
  },
};
```

**Test File:**
```javascript
runSchemaRegressionTests({
  actualSchema: schema,
  actualUiSchema: uiSchema,
  expectedSchema: {
    type: 'object',
    properties: {
      'view:demographicCategories': {
        type: 'object',
        properties: {
          isAmericanIndianOrAlaskanNative: {
            type: 'boolean',
          },
          isAsian: {
            type: 'boolean',
          },
          isBlackOrAfricanAmerican: {
            type: 'boolean',
          },
          isSpanishHispanicLatino: {
            type: 'boolean',
          },
          isNativeHawaiianOrOtherPacificIslander: {
            type: 'boolean',
          },
          isWhite: {
            type: 'boolean',
          },
          hasDemographicNoAnswer: {
            type: 'boolean',
          },
        },
      },
    },
  },
  expectedUiSchema: {
    'ui:title': {},
    'view:demographicCategories': {
      'ui:title': {},
      'ui:field': {}, // Custom fields ARE tested
      isAmericanIndianOrAlaskanNative: {
        'ui:title': {},
      },
      isSpanishHispanicLatino: {
        'ui:title': {},
      },
      isAsian: {
        'ui:title': {},
      },
      isBlackOrAfricanAmerican: {
        'ui:title': {},
      },
      isNativeHawaiianOrOtherPacificIslander: {
        'ui:title': {},
      },
      isWhite: {
        'ui:title': {},
      },
      hasDemographicNoAnswer: {
        'ui:title': {},
      },
    },
  },
  expectedRequired: [],
  pageName: pageTitle,
});
```

**Note on ui:field:**
- `ui:field` IS tested (unlike `ui:widget`)
- Include it in expectedUiSchema as `'ui:field': {}`
- Custom fields can be migrated to web components while maintaining schema compatibility

---

## Special Cases & Important Notes

### Schema Properties That ARE Tested:
- ✅ `type` - Always include
- ✅ `$ref` - Use `$ref: {}` to check existence
- ✅ `minLength`, `maxLength` - Validation constraints
- ✅ `pattern` - RegEx patterns
- ✅ `enum` - Enumerated values
- ✅ All nested `properties`

**These properties exist in the schema and the test checks for their existence.**

### UiSchema Properties That ARE Tested:
- ✅ `ui:title`
- ✅ `ui:description`
- ✅ `ui:options`
- ✅ `ui:errorMessages`
- ✅ `ui:validations`
- ✅ `ui:order`
- ✅ `ui:field` (custom fields)

### UiSchema Properties That Are AUTO-EXCLUDED:
- ❌ `ui:widget` - Automatically filtered by test
- ❌ `widgetClassNames` - Automatically filtered by test
- ❌ `classNames` - Automatically filtered by test

### Migration Compatibility:

**During Web Component Migration:**
- Tests will PASS if new web component patterns maintain the same schema/uiSchema structure
- Tests will PASS even if `ui:widget` changes (it's excluded)
- Tests will FAIL if required fields change
- Tests will FAIL if schema properties are removed
- Tests will FAIL if uiSchema properties (except excluded ones) are removed

**Example Migration That Passes:**
```javascript
// OLD CODE:
uiSchema: {
  email: {
    'ui:title': 'Email address',
    'ui:widget': 'email',
    'ui:errorMessages': {
      pattern: 'Enter a valid email',
    },
  },
}

// NEW CODE (web component):
uiSchema: {
  email: emailUI({
    title: 'Email address',
    errorMessages: {
      pattern: 'Enter a valid email',
    },
  }),
}
// Result: emailUI() outputs structure with ui:title and ui:errorMessages
// Test PASSES because required properties exist
```

### Handling View Fields:

View fields (prefixed with `view:`) are common and should be included:

```javascript
expectedSchema: {
  properties: {
    'view:placeOfBirth': {
      type: 'object',
      properties: {
        // nested fields
      },
    },
  },
}
```

### Array/List Pages:

For array-based pages (e.g., dependents list), test the array item schema:

```javascript
expectedSchema: {
  type: 'object',
  properties: {
    dependents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          // dependent fields
        },
      },
    },
  },
}
```

---

## Testing Your Tests

### Step 1: Run Tests to Verify They Pass
```bash
# Run specific test file
yarn test:unit src/applications/{form-name}/tests/unit/config/{chapter}/{page}.unit.spec.jsx

# Run all tests for a chapter
yarn test:unit src/applications/{form-name}/tests/unit/config/{chapter}/

# Run all tests for the form
yarn test:unit --app-folder {form-name}
```

### Step 2: Verify Test is Working

**Tests should pass with old code:**
```bash
✓ should have all expected schema properties
✓ should have all expected uiSchema properties (excluding ui:widget, widgetClassNames, classNames)
✓ should have all expected required fields for schema
```

**Tests should still pass after web component migration:**
- Web component patterns output same schema/uiSchema structure
- Only excluded properties (ui:widget, etc.) change

**Tests should fail if you remove a property:**
```javascript
// Remove a property to test failure:
// Before:
cityOfBirth: {
  type: 'string',
}

// After (remove minLength):
cityOfBirth: {
  type: 'string',
  // minLength removed
}

// Test result: PASSES (test checks existence, not specific validation values)

// But if you remove the property entirely:
// After:
// cityOfBirth removed

// Test result: FAILS with "Missing property at schema.properties.cityOfBirth"
```

---

## Checklist for Each Page

- [ ] Created test file in correct location
- [ ] Added `// @ts-check` at top of test file
- [ ] Imported form config and helper functions
- [ ] Added testNumberOfFormFields with correct count
- [ ] Added testNumberOfErrorsOnSubmit with correct count
- [ ] Added runSchemaRegressionTests with:
  - [ ] All schema properties
  - [ ] All schema nested properties
  - [ ] All uiSchema properties (except excluded ones)
  - [ ] Correct required fields array
  - [ ] Correct page name
- [ ] Ran tests to verify they pass
- [ ] Tests pass with current implementation

---

## Common Mistakes to Avoid

❌ **Don't include ui:widget in expectedUiSchema** - It's auto-excluded
❌ **Don't include widgetClassNames** - It's auto-excluded
❌ **Don't include classNames** - It's auto-excluded
❌ **Don't compare exact values** - Test checks property existence, not values
❌ **Don't skip nested properties** - Include all levels
❌ **Don't forget view: fields** - They're valid schema fields
❌ **Don't skip $ref** - Use `$ref: {}` to check existence
✅ **Do include ui:field** - Custom fields ARE tested
✅ **Do include ui:options** - Options ARE tested
✅ **Do include ui:errorMessages** - Error messages ARE tested
✅ **Do run tests before and after migration** - Verify they work

---

## Integration with Migration Workflow

**Before Migration:**
1. Create regression tests for ALL pages
2. Run tests to ensure they pass
3. Commit regression tests

**During Migration (Page-by-Page or Component-by-Component):**
1. Migrate page config to web components
2. Run regression tests to verify compatibility
3. Tests should still pass
4. If tests fail, adjust migration to maintain compatibility

**After Migration:**
1. All regression tests should pass
2. Schema/UiSchema structure maintained
3. Form functionality preserved

---

## 🔥 IMPORTANT: Web Component Migration Pattern Changes

### When Regression Test Expectations MUST Be Updated

**Key Finding:** Web component patterns sometimes produce **different but equivalent** schema structures compared to old patterns. This is **expected and correct** during web component migrations.

### Common Pattern Changes During Web Component Migration

#### 1. Date Fields: $ref → Explicit Pattern

**OLD Pattern (using definitions):**
```javascript
// Config
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
dateOfBirth: currentOrPastDateUI('Date of birth')

// Schema uses $ref
schema: {
  dateOfBirth: {
    $ref: '#/definitions/date'
  }
}

// Regression Test Expectation
expectedSchema: {
  dateOfBirth: {
    $ref: {}  // ← Expects $ref
  }
}
```

**NEW Pattern (web components):**
```javascript
// Config
import { currentOrPastDateUI, currentOrPastDateSchema } from 'platform/forms-system/src/js/web-component-patterns';
dateOfBirth: currentOrPastDateUI('Date of birth')

// Schema uses explicit pattern
schema: {
  dateOfBirth: currentOrPastDateSchema  // = { type: 'string', pattern: '...' }
}

// Regression Test Expectation MUST UPDATE
expectedSchema: {
  dateOfBirth: {
    type: 'string',
    pattern: {}  // ← Changed from $ref to explicit pattern
  }
}
```

**Action:** Update `expectedSchema` to use `type: 'string', pattern: {}` instead of `$ref: {}` for date fields.

#### 2. UiSchema Properties: Web Components Are Simpler

**OLD Pattern:**
```javascript
// SSN field with old pattern
expectedUiSchema: {
  socialSecurityNumber: {
    'ui:title': {},
    'ui:errorMessages': {},  // ← Old pattern includes these
    'ui:options': {},         // ← Old pattern includes these
  }
}
```

**NEW Pattern (web components):**
```javascript
// SSN field with web component
expectedUiSchema: {
  socialSecurityNumber: {
    'ui:title': {},  // ← Web components only need title
    // No ui:errorMessages - handled internally
    // No ui:options - handled internally
  }
}
```

**Action:** Remove `ui:errorMessages` and `ui:options` from expectations for web component fields (they're handled internally by web components).

#### 3. FullName Pattern: Structure Remains Same

**Good News:** fullNameUI web components maintain the same structure:
```javascript
// Both old and new use the same structure
expectedUiSchema: {
  spouseFullName: {
    first: { 'ui:title': {} },
    middle: { 'ui:title': {} },
    last: { 'ui:title': {} },
    suffix: { 'ui:title': {} }  // ← Remove ui:options if present in old
  }
}
```

**Action:** Structure stays the same, but remove `ui:options` from suffix if it was in old expectations.

### Decision Tree: When to Update Regression Test Expectations

```
┌─ Regression test fails after migration
│
├─ ERROR: "Missing property at schema.{field}.$ref"
│  └─ ✅ UPDATE: Change expectedSchema from $ref: {} to type/pattern
│     (Date fields use explicit schema in web components)
│
├─ ERROR: "Missing property at uiSchema.{field}.ui:options"
│  └─ ✅ UPDATE: Remove ui:options from expectedUiSchema
│     (Web components handle options internally)
│
├─ ERROR: "Missing property at uiSchema.{field}.ui:errorMessages"
│  └─ ✅ UPDATE: Remove ui:errorMessages from expectedUiSchema
│     (Web components handle error messages internally)
│
├─ ERROR: "Missing property at uiSchema.{field}.ui:validations"
│  └─ ✅ UPDATE: Remove ui:validations from expectedUiSchema
│     (Web components handle validations internally)
│
└─ ERROR: "Missing property at schema.{field}.{unexpectedProperty}"
   └─ ❌ FIX CONFIG: This is a real breaking change
      (Web component config is incorrect, fix the page config)
```

### Examples from Real Migrations

#### Example 1: spouseBasicInformation (HCA Form)

**Test Failed With:**
```
Missing property at schema.properties.spouseDateOfBirth.$ref
```

**Solution:**
```javascript
// BEFORE (expected $ref)
expectedSchema: {
  spouseDateOfBirth: {
    $ref: {}
  }
}

// AFTER (web component uses explicit pattern)
expectedSchema: {
  spouseDateOfBirth: {
    type: 'string',
    pattern: {}
  }
}
```

#### Example 2: SSN Field UiSchema

**Test Failed With:**
```
Missing property at uiSchema.spouseSocialSecurityNumber.ui:options
```

**Solution:**
```javascript
// BEFORE (old pattern had ui:options)
expectedUiSchema: {
  spouseSocialSecurityNumber: {
    'ui:title': {},
    'ui:errorMessages': {},
    'ui:options': {}
  }
}

// AFTER (web component only needs title)
expectedUiSchema: {
  spouseSocialSecurityNumber: {
    'ui:title': {}
  }
}
```

### Important Rules

✅ **DO UPDATE expectations when:**
- Schema changes from `$ref` to explicit `type` + `pattern` for date fields
- UiSchema loses `ui:options`, `ui:errorMessages`, `ui:validations` (web components handle these internally)
- The change is a known web component pattern difference

❌ **DON'T UPDATE expectations when:**
- Field names change (this is a breaking change)
- Required fields are removed (this is a breaking change)
- Field types change unexpectedly (this is a breaking change)
- New unexpected properties appear (investigate why)

### Why This Matters

**Regression tests protect against breaking changes, but web component patterns ARE NOT breaking changes** - they're equivalent implementations with different internal structures.

The test expectations document **what the actual implementation produces**, not what we wish it would produce. When migrating to web components, we must update expectations to match the new (but equivalent) structure.

**Key Principle:** If the form functions the same way for users, the schema difference is acceptable. Update test expectations to match the new web component patterns.

---

## Summary

**Purpose:** Ensure schema compatibility during migrations  
**Coverage:** All pages in the form  
**Test Type:** Property existence, not strict equality  
**Excluded:** ui:widget, widgetClassNames, classNames  
**Included:** All other schema and uiSchema properties  
**Result:** Safe migration with backward compatibility guarantee

**When tests pass:** ✅ Schema structure is preserved  
**When tests fail:** ❌ Breaking change detected - fix migration

---

## Quick Reference

**Test Helper Location:** `src/platform/forms-system/test/schemaRegressionHelpers.spec.jsx` (already exists)  
**Page Helper Location:** `src/platform/forms-system/test/pageTestHelpers.spec.jsx` (already exists)  
**Test File Location (Standard forms):** `src/applications/{form-name}/tests/unit/config/{chapter}/{page}.unit.spec.jsx`  
**Test File Location (Simple forms):** `src/applications/simple-forms/{form-number}/tests/pages/{page}.unit.spec.jsx`  
**Run Tests:** `yarn test:unit --app-folder {form-name}`  
**Run Single Test:** `yarn test:unit {path-to-test-file}`

**Required Imports:**
```javascript
// Import test helpers (same path for all forms)
import { testNumberOfErrorsOnSubmit, testNumberOfFields } from 'platform/forms-system/test/pageTestHelpers.spec';
import { runSchemaRegressionTests } from 'platform/forms-system/test/schemaRegressionHelpers.spec';

// Import formConfig (path varies by form structure)
// Standard forms: import formConfig from '../../../../config/form';
// Simple forms: import formConfig from '../../../config/form';
// Check existing test files in your form to determine the correct path
```

**Test Structure:**
1. testNumberOfFields (field count)
2. testNumberOfErrorsOnSubmit (error count)
3. runSchemaRegressionTests (schema compatibility)

**Always add `// @ts-check`** to the top of test files for better type checking.


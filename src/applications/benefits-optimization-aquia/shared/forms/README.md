# Form Utilities

## Overview

Data processing utilities that work with VA.gov's form system. Provides date
transformation functions for ensuring consistent data formatting before form
submission.

## Directory Structure

```bash
forms/
├── data-processors/
│   ├── data-processors.js       # Date transformation utilities
│   ├── data-processors.unit.spec.jsx
│   └── index.js
├── index.js             # Main exports
└── README.md            # This documentation
```

### Data Processors

The `data-processors` module provides utilities for transforming form data before submission:

- **`transformDates`** - Converts date objects to ISO string format (YYYY-MM-DD)
  - Handles both Date objects and custom date structures with month/day/year properties
  - Supports custom formatters for specific date formats
  - Used for ensuring consistent date formatting across forms

### Directory Organization

Each form utility follows a consistent structure:

- **Utility file** (`[utility-name].js`) - Implementation
- **Test file** (`[utility-name].unit.spec.jsx`) - Unit tests
- **Barrel file** (`index.js`) - Named exports

This organization provides:

- **Co-location** - Tests live next to their utilities
- **Encapsulation** - Each utility is self-contained
- **Clean imports** - Barrel files provide clean import paths

## Integration with VA.gov

VA.gov provides the form infrastructure:

- `RoutedSavableApp` for save-in-progress
- Redux for state management
- `createRoutesWithSaveInProgress` for navigation

We provide thin enhancements:

- Data processors for date transformations
- Form hooks for section management (see `/hooks/` directory)

## Core Hooks (Located in `/hooks/`)

### Current Hooks

#### `use-form-validation.js`

**Purpose**: Zod-based form validation with error management

```javascript
const { validate, validateField, errors, clearErrors } = useFormValidation(schema);
```

**Features**:

- Full form validation with Zod
- Individual field validation
- Error state management
- Validation error transformation

#### `use-form-section.js`

**Purpose**: Section-based form management with persistence

```javascript
const {
  localData,
  handleFieldChange,
  handleContinue,
  errors,
  formSubmitted
} = useFormSection({
  sectionName: 'personalInfo',
  schema: personalInfoSchema,
  defaultData: {},
  data: formData,
  setFormData
});
```

**Features**:

- Section-level data management
- Automatic persistence integration
- Field change handling with validation
- Form submission state tracking

### Available Advanced Hooks

#### `use-multi-step-form.js` (in `/forms/multi-step-controller.js`)

**Purpose**: Orchestrate multi-step form flows

```javascript
const {
  currentStep,
  totalSteps,
  goToStep,
  goNext,
  goBack,
  canProceed,
  formData,
  updateStepData,
  submitForm
} = useMultiStepForm({
  steps: formSteps,
  initialData: {},
  onSubmit: handleSubmit
});
```

**Features**:

- 🔄 Step navigation with validation
- 🔄 Progress tracking
- 🔄 Conditional step routing
- 🔄 Form-wide data management
- 🔄 Step completion validation

#### `use-conditional-fields.js` (in `/hooks/`)

**Purpose**: Dynamic field visibility and requirements

```javascript
const {
  visibleFields,
  requiredFields,
  disabledFields,
  evaluateConditions
} = useConditionalFields({
  conditions: fieldConditions,
  formData: currentData
});
```

**Features**:

- Field visibility logic
- Dynamic requirement changes
- Dependent field calculations
- Complex conditional expressions

#### `use-auto-save.js` (in `/hooks/`)

**Purpose**: Enhanced auto-save with conflict resolution

```javascript
const {
  saveStatus,
  lastSaved,
  conflicts,
  resolveConflict,
  forceSave
} = useFormAutoSave({
  formId: 'FORM_ID',
  data: formData,
  saveInterval: 30000
});
```

**Features**:

- 🔄 Automatic periodic saves
- 🔄 Conflict detection and resolution
- 🔄 Network error handling
- 🔄 Save status indicators

#### `use-form-persistence.js` (in `/hooks/`)

**Purpose**: Form data persistence and restoration

```javascript
const {
  prefillData,
  prefillSources,
  applyPrefill,
  skipPrefill
} = useFormPrefill({
  formId: 'FORM_ID',
  userId: currentUser.id,
  sections: ['personalInfo', 'address']
});
```

**Features**:

- 🔄 User profile integration
- 🔄 Previous form data reuse
- 🔄 Selective prefilling
- 🔄 Data freshness validation

## Core Utilities (Located in `/utils/`)

### Current Utilities

#### `zod-integration.js`

**Purpose**: Zod error transformation for user-friendly messages

```javascript
export const zodErrorToMessage = (zodError) => {
  // Transforms Zod errors to readable messages
};

export const formatIssuePath = (path) => {
  // Internal helper: Formats Zod issue paths to dot-notation with array indices
  // Example: ['address', 0, 'street'] > 'address[0].street'
};
```

#### `component-props.js`

**Purpose**: Standardize VA component props

```javascript
export const createVAComponentProps = (baseProps, validationState) => {
  // Creates consistent props for VA components
};
```

#### `error-transformations.js`

**Purpose**: Transform and normalize errors for VA web components

```javascript
// Factory functions for creating consistent error transformations
export const createNormalizer = (invalidPatterns = []) => {
  // Creates error normalizer functions that filter out invalid patterns
};

export const createDefaultErrorProps = (extraProps = {}) => {
  // Creates default error props for VA components with aria-invalid
};

// Exported transformation map for all VA component types
export const ERROR_TRANSFORMATIONS = {
  'va-text-input': { normalizeError, getErrorProps },
  'va-select': { normalizeError, getErrorProps },
  // ... configurations for all VA component types
};
```

#### `debug-utils.js`

**Purpose**: Development debugging utilities

```javascript
export const logFormState = (formData, errors, metadata) => {
  // Development-only logging
};
```

### Planned Advanced Utilities

#### `form-serialization.js`

**Purpose**: Form data serialization/deserialization

```javascript
export const serializeFormData = (formData, schema) => {
  // Serialize for storage/transmission
};

export const deserializeFormData = (serializedData, schema) => {
  // Deserialize with validation
};
```

#### `conditional-logic.js`

**Purpose**: Field dependency and conditional logic engine

```javascript
export const evaluateCondition = (condition, formData) => {
  // Evaluate complex conditional expressions
};

export const buildDependencyGraph = (conditions) => {
  // Build field dependency relationships
};
```

#### `form-analytics.js`

**Purpose**: Form completion and interaction tracking

```javascript
export const trackFormStart = (formId, userId) => {
  // Track form initiation
};

export const trackFieldInteraction = (fieldName, action, value) => {
  // Track field-level interactions
};

export const trackFormCompletion = (formId, completionData) => {
  // Track successful submissions
};
```

#### `accessibility-helpers.js`

**Purpose**: Accessibility validation and enhancement

```javascript
export const validateA11y = (formElement) => {
  // Accessibility validation
};

export const announceToScreenReader = (message) => {
  // Screen reader announcements
};

export const manageFocusFlow = (currentField, direction) => {
  // Focus management for form navigation
};
```

## Helper Functions (Located in `/utils/`)

### Current Utils

#### `zod-helpers.js`

**Purpose**: Zod-specific utility functions

```javascript
export const flattenZodError = (zodError) => {
  // Flatten nested Zod errors
};

export const createPageValidator = (schema, namespace) => {
  // Create page-level validators
};

export const createValidationErrorHandler = (schema, namespace) => {
  // Handle validation errors with context
};
```

### Planned Utils

#### `validation-rules.js`

**Purpose**: Common validation patterns

```javascript
export const createSSNValidator = (options = {}) => {
  // SSN validation with options
};

export const createPhoneValidator = (format = 'US') => {
  // Phone validation for different formats
};

export const createDateRangeValidator = (minDate, maxDate) => {
  // Date range validation
};
```

#### `form-data-transformers.js`

**Purpose**: Data transformation utilities

```javascript
export const normalizePhoneNumber = (phone) => {
  // Normalize phone number format
};

export const formatDateForSubmission = (dateObject) => {
  // Convert date objects to submission format
};

export const sanitizeFormData = (formData) => {
  // Remove empty/undefined values
};
```

## Available Context Providers (`/forms/providers/`)

### `FormProvider` (in `form-provider.jsx`)

**Purpose**: Global form context and configuration

```javascript
<FormProvider
  formId="FORM_ID"
  config={{
    autoSave: true,
    saveInterval: 30000,
    validateOnBlur: true,
    showProgress: true
  }}
>
  <FormApplication />
</FormProvider>
```

### `FormDataProvider.js` (Planned)

**Purpose**: Global form data management

```javascript
<FormDataProvider formId="FORM_21_2008" initialData={{}}>
  <MultiStepForm />
</FormDataProvider>
```

### `ValidationProvider.js` (Planned)

**Purpose**: Global validation context

```javascript
<ValidationProvider schemas={formSchemas} errorTransforms={customTransforms}>
  <FormPages />
</ValidationProvider>
```

## Integration Patterns

### Simple Form Page

```javascript
import { useFormSection } from '@bio-aquia/shared/hooks';
import { personalInfoSchema } from '@bio-aquia/shared/schemas';
import { TextInputField, NavigationButtons } from '@bio-aquia/shared/components';

export const PersonalInfoPage = ({ data, setFormData, goForward, goBack }) => {
  const {
    localData,
    handleFieldChange,
    handleContinue,
    errors,
    formSubmitted
  } = useFormSection({
    sectionName: 'personalInfo',
    schema: personalInfoSchema,
    defaultData: { firstName: '', lastName: '' },
    data,
    setFormData
  });

  return (
    <div>
      <TextInputField
        name="firstName"
        label="First Name"
        value={localData.firstName}
        onChange={handleFieldChange}
        error={errors.firstName}
        forceShowError={formSubmitted}
      />
      <NavigationButtons
        onBack={goBack}
        onContinue={() => handleContinue(goForward)}
      />
    </div>
  );
};
```

### Multi-Step Form with Conditional Logic

```javascript
import { useMultiStepForm, useConditionalFields } from '@bio-aquia/shared/hooks';

export const ComplexForm = () => {
  const {
    currentStep,
    formData,
    goNext,
    goBack,
    updateStepData
  } = useMultiStepForm({
    steps: formSteps,
    onSubmit: handleSubmit
  });

  const { visibleFields, requiredFields } = useConditionalFields({
    conditions: fieldConditions,
    formData
  });

  // Render current step with conditional logic
};
```

## Performance Considerations

### Lazy Loading

- Components load only when needed
- Schema validation on-demand
- Chunk splitting for form utilities

### Memoization

- Memoized validation functions
- Cached error transformations
- Optimized re-renders

### Bundle Size

- Tree-shakeable exports
- Minimal dependencies
- Optional advanced features

## Testing Strategy

### Unit Testing

- All hooks with comprehensive test scenarios
- Utility functions with edge cases
- Schema validation with various inputs

### Integration Testing

- Full form flows
- Multi-step navigation
- Error handling scenarios

### Accessibility Testing

- Screen reader compatibility
- Keyboard navigation
- Focus management
- ARIA compliance

## Migration Strategy

### Gradual Adoption

1. **Phase 1**: Use current hooks and utilities
2. **Phase 2**: Add advanced hooks as needed
3. **Phase 3**: Migrate to context providers
4. **Phase 4**: Full multi-step form integration

### Backward Compatibility

- Maintain current API surface
- Add new features as optional
- Provide migration utilities
- Document breaking changes

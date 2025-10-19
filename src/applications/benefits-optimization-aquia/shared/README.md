# Shared Form Utilities

A thin integration layer between VA.gov's form system and AQ applications, providing enhanced validation and consistent component patterns.

## Overview

The `@bio-aq/shared` module enhances VA.gov's robust form system with Zod validation for better error messages, VA web component adapters for consistent error handling, and reusable field components. We integrate with VA's infrastructure, not duplicate it.

## Share Utility Philosophy

- **Integration, not duplication** - Use VA.gov's form system, enhance it
- **Thin abstraction layer** - Minimal wrapper around VA components
- **Validation enhancement** - Better error messages with Zod
- **Composable components** - Mix and match as needed

## Current Applications

### Memorial Forms (`aq-memorials`)

- **2008-burial-flags-21** - Burial flag request form
- **memorial-medallion-40-1330m** - Memorial medallion application

### Health Forms (`aq-health`)

- **nursing-assist-21-0779** - Nursing assistance application

## Documentation

### Core Architecture

- **[Components](./components/README.md)** - Reusable form components with VA web component integration
- **[Schemas](./schemas/README.md)** - Zod validation schemas with user-friendly messages

## Share Utility Structure

```bash
src/applications/benefits-optimization-aquia/shared/
├── components/          # Reusable UI components
│   ├── atoms/           # Form fields with VA web component integration
│   │   └── [component-name]/
│   │       ├── [component-name].jsx
│   │       ├── [component-name].unit.spec.jsx
│   │       └── index.js
│   ├── molecules/       # Composite components (address, fullname, etc.)
│   │   └── [component-name]/
│   │       ├── [component-name].jsx
│   │       ├── [component-name].unit.spec.jsx
│   │       └── index.js
│   ├── templates/       # PageTemplate for VA CustomPage pattern
│   │   └── page-template/
│   │       ├── page-template.jsx
│   │       ├── page-template.unit.spec.jsx
│   │       └── index.js
│   ├── pages/           # Page components
│   │   └── base-form-page/
│   │       ├── base-form-page.jsx
│   │       ├── base-form-page.unit.spec.jsx
│   │       └── index.js
│   ├── error-boundary/  # React error boundary wrapper
│   │   ├── error-boundary.jsx
│   │   ├── error-boundary.unit.spec.jsx
│   │   └── index.js
│   ├── save-in-progress/ # Save-in-progress resume controls
│   │   ├── save-in-progress.jsx
│   │   ├── save-in-progress.unit.spec.jsx
│   │   └── index.js
│   └── index.js         # Barrel exports
├── forms/               # Data processing utilities
│   ├── data-processors/
│   │   ├── data-processors.js
│   │   ├── data-processors.unit.spec.jsx
│   │   └── index.js
│   ├── section-patterns/
│   │   ├── section-patterns.js
│   │   ├── section-patterns.unit.spec.jsx
│   │   └── index.js
│   └── index.js         # Barrel exports
├── hooks/               # Integration hooks
│   ├── use-field-validation/
│   │   ├── use-field-validation.js
│   │   ├── use-field-validation.unit.spec.jsx
│   │   └── index.js
│   ├── use-form-section/
│   │   ├── use-form-section.js
│   │   ├── use-form-section.unit.spec.jsx
│   │   └── index.js
│   ├── use-form-validation/
│   │   ├── use-form-validation.js
│   │   ├── use-form-validation.unit.spec.jsx
│   │   └── index.js
│   └── index.js         # Barrel exports
├── schemas/             # Zod validation schemas
│   ├── address/
│   │   ├── address.js
│   │   ├── address.unit.spec.jsx
│   │   └── index.js
│   ├── contact/
│   │   ├── contact.js
│   │   ├── contact.unit.spec.jsx
│   │   └── index.js
│   ├── name/
│   │   ├── name.js
│   │   ├── name.unit.spec.jsx
│   │   └── index.js
│   ├── personal-info/
│   │   ├── personal-info.js
│   │   ├── personal-info.unit.spec.jsx
│   │   └── index.js
│   ├── regex-patterns/
│   │   ├── regex-patterns.js
│   │   ├── regex-patterns.unit.spec.jsx
│   │   └── index.js
│   └── index.js         # Barrel exports
├── utils/               # VA integration utilities
│   ├── component-props/
│   │   ├── component-props.js
│   │   ├── component-props.unit.spec.jsx
│   │   └── index.js
│   ├── debug-utils/
│   │   ├── debug-utils.js
│   │   ├── debug-utils.unit.spec.jsx
│   │   └── index.js
│   ├── error-constants/
│   │   ├── error-constants.js
│   │   ├── error-constants.unit.spec.jsx
│   │   └── index.js
│   ├── error-handler/
│   │   ├── error-handler.js
│   │   ├── error-handler.unit.spec.jsx
│   │   └── index.js
│   ├── error-handling/
│   │   ├── error-handling.js
│   │   ├── error-handling.unit.spec.jsx
│   │   └── index.js
│   ├── error-transformations/
│   │   ├── error-transformations.js
│   │   ├── error-transformations.unit.spec.jsx
│   │   └── index.js
│   ├── form-error/
│   │   ├── form-error.js
│   │   ├── form-error.unit.spec.jsx
│   │   └── index.js
│   ├── logger/
│   │   ├── logger.js
│   │   ├── logger.unit.spec.jsx
│   │   └── index.js
│   ├── zod-helpers/
│   │   ├── zod-helpers.js
│   │   ├── zod-helpers.unit.spec.jsx
│   │   └── index.js
│   ├── zod-integration/
│   │   ├── zod-integration.js
│   │   ├── zod-integration.unit.spec.jsx
│   │   └── index.js
│   └── index.js         # Barrel exports
├── index.js             # Main barrel exports
└── README.md            # This documentation
```

### Directory Organization Pattern

Each module follows a consistent structure:

- **Component/module file** - Implementation (`.jsx` or `.js`)
- **Test file** - Unit tests (`.unit.spec.jsx`)
- **Barrel file** - Named exports (`index.js`)

This organization provides:

- **Co-location** - Tests live next to their components
- **Encapsulation** - Each module is self-contained
- **Clean imports** - Barrel files provide clean import paths
- **Scalability** - Easy to add new modules following the pattern

## Quick Start

### Using Share Utility Components

```javascript
// Import components from bio-aquia/shared
import {
  TextInputField,
  FullnameField,
  AddressField,
  NavigationButtons,
} from '@bio-aquia/shared/components';

// Import validation schemas
import {
  personalInfoSchema,
  addressSchema,
  contactSchema,
} from '@bio-aquia/shared/schemas';

// Import form management hooks
import { useFormSection, useFormValidation } from '@bio-aquia/shared/hooks';
```

### Building a Form Page

```javascript
// Using PageTemplate for consistent page structure
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { personalInfoSchema } from '@bio-aquia/shared/schemas';

export const PersonalInfoPage = ({ data, setFormData, goForward, goBack }) => {
  return (
    <PageTemplate
      title="Personal Information"
      subtitle="Please provide your personal details"
      data={data}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={personalInfoSchema}
      sectionName="personalInfo"
      defaultData={{ firstName: '', lastName: '' }}
    >
      {({ localData, handleFieldChange, errors, formSubmitted }) => (
        <>
          <TextInputField
            name="firstName"
            label="First Name"
            value={localData.firstName}
            onChange={handleFieldChange}
            error={errors.firstName}
            forceShowError={formSubmitted}
            required
          />
          <TextInputField
            name="lastName"
            label="Last Name"
            value={localData.lastName}
            onChange={handleFieldChange}
            error={errors.lastName}
            forceShowError={formSubmitted}
            required
          />
        </>
      )}
    </PageTemplate>
  );
};
```

## Component Library

### Atomic Components (Form Fields)

| Component               | Purpose               | Features                           |
| ----------------------- | --------------------- | ---------------------------------- |
| `TextInputField`             | Text input            | VA web component, Zod validation   |
| `SelectField`           | Dropdown              | Options, validation, accessibility |
| `CheckboxField`         | Single checkbox       | VA styling, validation             |
| `CheckboxGroupField`    | Multiple checkboxes   | Group validation                   |
| `RadioField`            | Radio buttons         | Exclusive selection                |
| `DateField`             | Date picker           | VA date component                  |
| `MemorableDateField`    | Month/day/year        | Separate inputs                    |
| `PhoneField`            | Phone number          | Formatting, validation             |
| `SSNField`              | Social Security       | Masking, validation                |
| `TextareaField`         | Multi-line text       | Character limits                   |
| `FileUploadField`       | File upload           | VA file component                  |
| `SignatureField`        | Digital signature     | Capture and validation             |
| `PrivacyAgreementField` | Privacy/certification | Customizable content               |

### Molecular Components (Composite)

| Component           | Purpose             | Combines                          |
| ------------------- | ------------------- | --------------------------------- |
| `FullnameField`     | Complete name entry | First, middle, last, suffix       |
| `AddressField`      | Complete address    | Street, city, state, ZIP, country |
| `NavigationButtons` | Form navigation     | Back, continue buttons            |

### Template Components (Page-Level)

| Component      | Purpose           | Features                                                                     |
| -------------- | ----------------- | ---------------------------------------------------------------------------- |
| `PageTemplate` | Form page wrapper | Consistent layout, navigation, form section management, render props support |

## Validation Schemas

### Core Schemas (Universal)

- **Personal Info** - Names, SSN, DOB, VA file numbers
- **Address** - US/international/military address validation
- **Contact** - Phone, email with format validation

### Domain-Specific Components

Domain-specific components and schemas live in their respective applications:

- **Memorial components** - `/src/applications/aq-memorials/shared-components/`
- **Health components** - `/src/applications/aq-health/shared-components/`
- **Application-specific** - Within each application's components folder

## Development Status

### Current Features (Production Ready)

- 18+ atomic form components with VA web component integration
- Zod-based validation with user-friendly error messages
- Form section management with save-in-progress
- Comprehensive address validation (US/international/military)
- Accessibility compliance (WCAG 2.1 AA)

### In Progress (Phase 1 - Memorial Forms)

- Memorial medallion form integration
- Veteran service information schemas
- ✅ Enhanced error handling and boundaries (completed)
- ✅ Development-only logging system (completed)

### Planned (Future Phases)

- Health form schemas and components
- Multi-step form orchestration
- Conditional field logic
- Advanced accessibility features
- TypeScript migration
- Performance optimizations

## Known Issues & TODOs

### Critical Issues

- **Form ID Context** - ✅ Resolved with FormProvider context
- **Development Logging** - ✅ Implemented environment-aware logging (dev-only)
- **Error Boundaries** - ✅ Added FormErrorBoundary component

### Quality Improvements

- ESLint suppressions need resolution
- Enhanced error handling patterns
- Accessibility enhancements

## Testing

### Component Testing

```bash
# Run Share Utility component tests
yarn test:unit src/applications/benefits-optimization-aquia/shared/

# Run specific component tests
yarn test:unit src/applications/benefits-optimization-aquia/shared/components/atoms/text-input-field.spec.js
```

### Integration Testing

```bash
# Run form integration tests
yarn test:unit --app-folder 2008-burial-flags-21
```

### Accessibility Testing

```bash
# Run accessibility tests
yarn test:unit --coverage
```

## Performance

### Bundle Impact

- **Atomic components**: ~15KB gzipped
- **Form utilities**: ~8KB gzipped
- **Validation schemas**: ~5KB gzipped
- **Total Share Utility overhead**: ~28KB gzipped

### Optimization Features

- Tree-shakeable exports
- Component lazy loading
- Memoized validation functions
- Debounced user input

## Contributing

### Development Workflow

1. Follow atomic design principles
2. Use Zod for all validation
3. Implement VA web components
4. Ensure WCAG 2.1 AA compliance
5. Add comprehensive tests

### Code Quality Standards

- 90% test coverage minimum
- ESLint compliance
- Accessibility validation
- Performance benchmarks

### Adding New Components

1. Create component in appropriate atoms/molecules directory
2. Add Zod schema validation
3. Implement comprehensive tests
4. Update barrel exports
5. Add Storybook documentation

## Support

### Module Documentation

- **Components**: [Component Documentation](./components/README.md)
- **Forms**: [Form System Documentation](./forms/README.md)
- **Schemas**: [Schema Organization](./schemas/README.md)
- **Hooks**: See hooks section in this document

### Getting Help

- Review existing documentation
- Check the Known Issues & TODOs section above
- Follow development patterns from 2008-burial-flags-21

## Success Metrics

### Current Achievement (Baseline)

- ✅ **100% component reuse** in 2008-burial-flags-21
- ✅ **WCAG 2.1 AA compliance** across all components
- ✅ **Zod validation** with user-friendly error messages
- ✅ **VA web component** integration throughout

### Share Utility Goals

- **Reusability**: 80%+ component reuse across forms
- **Development Speed**: 50% faster new form development
- **Consistency**: Uniform UX across all AQ forms
- **Maintainability**: Single source of truth for form patterns
- **Accessibility**: 100% WCAG 2.1 AA compliance

## Share Utility Architecture

**Key Principle**: We integrate with VA.gov's form system, not duplicate it. VA.gov provides:

- Save-in-progress (via RoutedSavableApp)
- Form state management (via Redux)
- Multi-step navigation (via createRoutesWithSaveInProgress)
- Form configuration (via formConfig)
- User authentication and prefill
- Analytics and monitoring

### Integration with VA.gov Form System

#### How It Works

1. **VA.gov provides the framework:**

   - `RoutedSavableApp` manages form state and save-in-progress
   - `createRoutesWithSaveInProgress` handles navigation
   - Redux stores manage form data
   - `CustomPage` pattern passes data/setFormData to pages

2. **Share Utility provides enhancements:**

   - Zod schemas for better validation messages
   - VA component adapters for consistent error display
   - PageTemplate for consistent page structure
   - Reusable field components

3. **Forms use both:**

   ```javascript
   // Uses VA's CustomPage pattern
   export const PersonalInfoPage = ({ data, setFormData, goForward }) => {
     return (
       // Share Utility PageTemplate
       <PageTemplate
         data={data}
         setFormData={setFormData}
         goForward={goForward}
         schema={personalInfoSchema} // Share Utility schema
         sectionName="personalInfo"
       >
         {/* Share Utility components that use VA web components */}
         <FullnameField />
         <SSNField />
       </PageTemplate>
     );
   };
   ```

### What We DON'T Build

The VA.gov platform already provides these features - we use them, not duplicate them:

- ❌ Save-in-progress system (use RoutedSavableApp)
- ❌ Form state management (use Redux reducers)
- ❌ Multi-step navigation (use createRoutesWithSaveInProgress)
- ❌ User authentication (use VA's auth system)
- ❌ Form prefill (use VA's prefill system)
- ❌ Analytics tracking (use VA's analytics)
- ❌ Session management (use VA's session system)
- ❌ Form submission (use VA's submit handlers)
- ❌ File upload backend (use VA's file system)
- ❌ Form versioning (use formConfig.version)

### What We DO Build

Thin integration layers that enhance VA's system:

- ✅ Zod schemas for better error messages
- ✅ VA component adapters for consistent error handling
- ✅ Reusable field components with validation
- ✅ PageTemplate for consistent structure
- ✅ Data processors for common transformations
- ✅ Form-specific business logic (in app, not platform)

## Form Patterns and Helpers

This section outlines the patterns and helpers available in bio-aquia/shared, based on the proven patterns from 2008-burial-flags-21.

### Core Pattern: CustomPage with useFormSection

The burial-flags form uses a consistent pattern across all pages:

```jsx
const YourPage = ({ data, setFormData, goForward, goBack }) => {
  const {
    localData,
    handleFieldChange,
    handleContinue,
    errors,
    formSubmitted,
  } = useFormSection({
    sectionName: 'sectionName',
    schema: yourZodSchema,
    defaultData: {
      /* default values */
    },
    data,
    setFormData,
    dataProcessor: optionalDataProcessor, // e.g., date formatting
  });

  return (
    <PageTemplate
      title="Page Title"
      data={data}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={yourZodSchema}
      sectionName="sectionName"
    >
      {/* Your form fields */}
    </PageTemplate>
  );
};
```

### Available Hooks

#### useFormSection

Core hook for managing form sections with automatic namespacing, validation, and persistence.

```jsx
import { useFormSection } from '@bio-aquia/shared/hooks';

const {
  localData, // Current section data
  handleFieldChange, // Field change handler
  handleContinue, // Continue with validation
  errors, // Validation errors
  formSubmitted, // Form submission state
  validate, // Manual validation
} = useFormSection({
  sectionName, // Section namespace
  schema, // Zod validation schema
  defaultData, // Default values
  data, // Full form data
  setFormData, // Update function
  dataProcessor, // Optional data processor
});
```

#### useFieldValidation

Handles individual field validation with debouncing and touch state.

```jsx
import { useFieldValidation } from '@bio-aquia/shared/hooks';

const {
  validateField,
  touchField,
  error,
  isValidating,
  touched,
} = useFieldValidation(zodSchema);
```

#### useFormValidation

Handles form-level validation with comprehensive error collection.

```jsx
import { useFormValidation } from '@bio-aquia/shared/hooks';

const { errors, validate, clearErrors, setError } = useFormValidation(
  zodSchema,
);
```

### Data Processors

Generic utilities for transforming form data:

```jsx
import {
  transformDates,
  transformBooleans,
  sanitizeFormData,
  normalizeValue,
  formatValue,
} from '@bio-aquia/shared/forms';
```

#### Example: Date Processing

```jsx
const ensureDateStrings = formData => {
  return transformDates(formData, ['dateOfBirth', 'dateOfDeath']);
};
```

### Page Template

Generic wrapper for form pages with navigation:

```jsx
import { PageTemplate } from '@bio-aquia/shared/components/templates';

<PageTemplate
  title="Your Page Title"
  data={data}
  setFormData={setFormData}
  goForward={goForward}
  goBack={goBack}
  schema={schema} // Optional - enables validation
  sectionName="section" // Required if using schema
  dataProcessor={processor} // Optional data transformation
>
  {/* Your form fields */}
</PageTemplate>;
```

### Form Components

#### Atoms

- `TextInputField` - Basic text input
- `SSNField` - Social Security Number field
- `DateField` - Date input
- `MemorableDateField` - Memorable date with month/day/year
- `CheckboxField` - Single checkbox
- `CheckboxGroupField` - Multiple checkboxes
- `RadioField` - Radio button group
- `SelectField` - Dropdown select
- `TextAreaField` - Multi-line text
- `PhoneField` - Phone number input

#### Molecules

- `FullnameField` - First, middle, last name inputs
- `AddressField` - Complete address with validation
- `NavigationButtons` - Back/Continue buttons

### Validation Utilities

```jsx
import {
  createPageValidator,
  createValidationErrorHandler,
  zodErrorToMessage,
} from '@bio-aquia/shared/utils';
```

### Section Management Patterns

```jsx
import {
  createSectionData,
  mergeWithDefaults,
  extractSectionData,
  updateSectionData,
} from '@bio-aquia/shared/forms';

// Use these utilities for managing form section data
const sectionData = extractSectionData(formData, 'sectionName');
const mergedData = mergeWithDefaults(sectionData, defaultData);
const updatedForm = updateSectionData(formData, 'sectionName', newData);
```

### Best Practices

1. **Always use useFormSection** for form pages - it handles validation, persistence, and namespacing
2. **Use Zod schemas** for validation - they integrate seamlessly with the form system
3. **Use data processors** for transforming data (e.g., date formatting) before saving
4. **Use PageTemplate** for consistent layout and navigation
5. **Keep form logic generic** - don't hardcode business logic in platform utilities

### Migration from Burial Flags

If migrating from burial-flags patterns:

1. Import hooks from `@bio-aquia/shared/hooks` instead of local paths
2. Import components from `@bio-aquia/shared/components/atoms` and `@bio-aquia/shared/components/molecules`
3. Import utilities from `@bio-aquia/shared/utils`
4. Use `PageTemplate` for page wrapping
5. Keep business logic in your application, not in platform utilities

### Example: Complete Page

```jsx
import PropTypes from 'prop-types';
import React from 'react';
import { z } from 'zod';

import { TextInputField, SSNField } from '@bio-aquia/shared/components/atoms';
import { FullnameField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { useFormSection } from '@bio-aquia/shared/hooks';

const personalInfoSchema = z.object({
  fullName: z.object({
    first: z.string().min(1, 'First name is required'),
    last: z.string().min(1, 'Last name is required'),
    middle: z.string().optional(),
  }),
  ssn: z.string().regex(/^\d{9}$/, 'Must be 9 digits'),
  vaFileNumber: z.string().optional(),
});

export const PersonalInfoPage = ({ data, setFormData, goForward, goBack }) => {
  const {
    localData,
    handleFieldChange,
    handleContinue,
    errors,
    formSubmitted,
  } = useFormSection({
    sectionName: 'personalInfo',
    schema: personalInfoSchema,
    defaultData: {
      fullName: { first: '', middle: '', last: '' },
      ssn: '',
      vaFileNumber: '',
    },
    data,
    setFormData,
  });

  return (
    <PageTemplate
      title="Personal Information"
      data={data}
      setFormData={setFormData}
      goForward={goForward}
      goBack={goBack}
      schema={personalInfoSchema}
      sectionName="personalInfo"
    >
      <FullnameField
        value={localData.fullName}
        onChange={handleFieldChange}
        errors={errors.fullName || {}}
        required
        forceShowError={formSubmitted}
      />

      <SSNField
        name="ssn"
        value={localData.ssn}
        onChange={handleFieldChange}
        error={errors.ssn}
        required
        forceShowError={formSubmitted}
      />

      <TextInputField
        name="vaFileNumber"
        label="VA file number (if known)"
        value={localData.vaFileNumber}
        onChange={handleFieldChange}
        error={errors.vaFileNumber}
        forceShowError={formSubmitted}
      />
    </PageTemplate>
  );
};

PersonalInfoPage.propTypes = {
  data: PropTypes.object,
  setFormData: PropTypes.func,
  goForward: PropTypes.func,
  goBack: PropTypes.func,
};
```

### Usage Example in Form Config

```javascript
// In 2008-burial-flags-21/config/form.js
import { VA_FORM_IDS } from 'platform/forms/constants';
import { createPageValidator } from '@bio-aquia/shared/utils';

// Uses VA's form config structure
export default {
  formId: VA_FORM_IDS.FORM_21_2008,
  version: 0,
  rootUrl: manifest.rootUrl,
  trackingPrefix: '2008-burial-flags-21-',

  // VA handles save-in-progress, we just provide validation
  pages: {
    personalInfo: {
      path: 'personal-information',
      title: 'Personal Information',
      CustomPage: PersonalInformationPage,
      // Our enhancement: Zod validation
      pagePerItemValidation: createPageValidator(personalInfoSchema),
    },
  },
};
```

# Components

Reusable form components built with VA Design System web components. These
components are generic and can be shared across multiple forms.

## Structure

```bash
components/
├── atoms/                # Basic form field components
│   └── [component-name]/
│       ├── [component-name].jsx
│       ├── [component-name].unit.spec.jsx
│       └── index.js
├── molecules/            # Composite components combining atoms
│   └── [component-name]/
│       ├── [component-name].jsx
│       ├── [component-name].unit.spec.jsx
│       └── index.js
├── templates/            # Page-level templates for consistent layout
│   └── page-template/
│       ├── page-template.jsx
│       ├── page-template.unit.spec.jsx
│       └── index.js
├── error-boundary/       # React error boundary wrapper
│   ├── error-boundary.jsx
│   ├── error-boundary.unit.spec.jsx
│   └── index.js
├── save-in-progress/ # Save-in-progress resume controls
│   ├── save-in-progress.jsx
│   ├── save-in-progress.unit.spec.jsx
│   └── index.js
└── index.js              # Barrel exports
```

### Component Organization

Each component follows a consistent directory structure:

- **Component file** (`[component-name].jsx`) - Implementation
- **Test file** (`[component-name].unit.spec.jsx`) - Unit tests
- **Barrel file** (`index.js`) - Named export

This structure provides:

- **Co-location** - Tests live next to their components
- **Encapsulation** - Each component is self-contained
- **Clean imports** - Barrel files provide clean import paths

## Atoms

Field-level components that integrate VA web components with form validation. Each atom is organized in its own directory:

- `checkbox-field/` - Single checkbox with validation
- `checkbox-group-field/` - Multiple checkboxes with group validation
- `currency-field/` - Currency input with formatting
- `date-field/` - Date input with formatting validation
- `file-upload-field/` - File upload with size and type validation
- `memorable-date-field/` - Month/Day/Year date inputs
- `number-field/` - Numeric input with validation
- `phone-field/` - Phone number input with formatting
- `privacy-agreement-field/` - Privacy agreement and certification
- `radio-field/` - Radio button group
- `select-field/` - Dropdown selection
- `signature-field/` - Digital signature capture
- `ssn-field/` - Social Security Number input with masking
- `text-input-field/` - Text input with advanced validation
- `textarea-field/` - Multi-line text input with character count

### Review Components

Field-level components for displaying data in review mode:

- `review-field/` - Generic field display with optional formatting
- `review-fullname-field/` - Formats name objects (first, middle, last, suffix)
- `review-date-field/` - Displays dates in long or short format
- `review-address-field/` - Multi-line address display (US, international, military)

## Molecules

Composite components combining multiple atoms. Each molecule is organized in its own directory:

- `address-field/` - Complete address form with military and international support
- `fullname-field/` - Full name entry with first, middle, last, and suffix
- `navigation-buttons/` - Standardized Back/Continue button layout
- `personal-info/` - Personal information component with name, SSN, DOB, and contact

## Templates

Page-level templates for consistent form structure:

- `PageTemplate` - Generic form page wrapper with:
  - VA.gov form styling and layout
  - Built-in navigation with VA button components
  - Integration with `useFormSection` hook
  - Support for data processing
  - Render props pattern for complex logic
  - Title and subtitle support
  - Responsive button layout with flexbox
  - Review mode support with Save button

- `ReviewPageTemplate` - Review page wrapper with:
  - Platform review page styling (`form-review-panel-page`, `dl.review`)
  - Title and Edit button header
  - Mobile-responsive layout
  - Integration with CustomPageReview pattern
  - Support for render props to access section data
  - Automatic section data extraction

### PageTemplate Usage

**Edit Mode:**

```javascript
// Simple usage
<PageTemplate
  title="Page Title"
  subtitle="Instructions or description"
  data={formData}
  setFormData={setFormData}
  goForward={goForward}
  goBack={goBack}
  onReviewPage={onReviewPage}
  updatePage={updatePage}
  schema={validationSchema}
  sectionName="sectionName"
>
  <TextInputField name="field1" label="Field 1" />
  <TextInputField name="field2" label="Field 2" />
</PageTemplate>

// With render props for complex logic
<PageTemplate
  title="Complex Page"
  data={formData}
  setFormData={setFormData}
  goForward={goForward}
  goBack={goBack}
  onReviewPage={onReviewPage}
  updatePage={updatePage}
  schema={validationSchema}
  sectionName="complexSection"
>
  {({ localData, handleFieldChange, errors, formSubmitted }) => {
    // Complex conditional logic
    const showExtraField = localData.someCondition;

    return (
      <>
        <TextInputField
          name="field1"
          value={localData.field1}
          onChange={handleFieldChange}
          error={errors.field1}
          forceShowError={formSubmitted}
        />
        {showExtraField && (
          <TextInputField
            name="extraField"
            value={localData.extraField}
            onChange={handleFieldChange}
            error={errors.extraField}
            forceShowError={formSubmitted}
          />
        )}
      </>
    );
  }}
</PageTemplate>
```

### ReviewPageTemplate Usage

**Review Mode:**

```javascript
// Simple usage with review field components
import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates';
import { ReviewField, ReviewDateField, ReviewFullnameField } from '@bio-aquia/shared/components/atoms';

export const PersonalInfoReviewPage = ({ data, editPage, title }) => (
  <ReviewPageTemplate
    title={title}
    data={data}
    editPage={editPage}
    sectionName="personalInfo"
  >
    <ReviewFullnameField label="Full name" value={data?.personalInfo?.fullName} />
    <ReviewDateField label="Date of birth" value={data?.personalInfo?.dateOfBirth} />
    <ReviewField label="Email" value={data?.personalInfo?.email} />
  </ReviewPageTemplate>
);

// With render props for conditional display
export const AddressReviewPage = ({ data, editPage, title }) => (
  <ReviewPageTemplate
    title={title}
    data={data}
    editPage={editPage}
    sectionName="mailingAddress"
  >
    {(sectionData) => (
      <>
        <ReviewAddressField label="Mailing address" value={sectionData.address} />
        {sectionData.hasAlternateAddress && (
          <ReviewAddressField label="Alternate address" value={sectionData.alternateAddress} />
        )}
      </>
    )}
  </ReviewPageTemplate>
);
```

## Infrastructure Components

### Error Boundary

- `error-boundary/` - React error boundary component
  - Catches JavaScript errors in child component tree
  - Displays user-friendly error messages
  - Logs errors to monitoring in development only
  - Shows contact information for support
  - Comprehensive unit tests with 100% coverage

### Save-in-Progress Wrapper

- `save-in-progress/` - Form resume controls component
  - Detects saved form data on page refresh
  - Displays resume controls when user navigates directly to form page
  - Integrates with VA.gov save-in-progress system
  - Handles expired form detection
  - Shows loading states during data fetch
  - Preserves breadcrumbs during transitions

## Usage

Import components using barrel exports:

```javascript
// Import Share Utility components
import {
  TextInputField,
  DateField,
  AddressField,
  PageTemplate,
  FormErrorBoundary,
} from '@bio-aquia/shared/components';

// Or import from specific subdirectories (recommended for tree-shaking)
import { TextInputField, DateField } from '@bio-aquia/shared/components/atoms';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

// Import directly from component directories
import { TextInputField } from '@bio-aquia/shared/components/atoms/text-input-field';
import { AddressField } from '@bio-aquia/shared/components/molecules/address-field';
import { PageTemplate } from '@bio-aquia/shared/components/templates/page-template';
```

### Directory Structure Benefits

The new directory organization provides:

- **Better testing** - Tests are co-located with components
- **Easier navigation** - Each component has its own folder
- **Clean imports** - Barrel files provide multiple import options
- **Scalability** - Easy to add new components following the pattern

## Documentation

For detailed implementation guides and patterns:

- [Development Guide](../docs/DEVELOPMENT_GUIDE.md) - Component development patterns
- [Web Components Catalog](../docs/WEB_COMPONENTS_CATALOG.md) - VA component integration
- [Preferred Patterns](../docs/PREFERRED_PATTERNS.md) - Best practices

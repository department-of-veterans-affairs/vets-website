# Components

Reusable form components built with VA Design System web components. These components are generic and can be shared across multiple forms.

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
├── pages/                # Page components
│   └── base-form-page/
│       ├── base-form-page.jsx
│       ├── base-form-page.unit.spec.jsx
│       └── index.js
├── templates/            # Page-level templates for consistent layout
│   └── page-template/
│       ├── page-template.jsx
│       ├── page-template.unit.spec.jsx
│       └── index.js
├── error-boundary.jsx    # React error boundary for error handling
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
- `date-field/` - Date input with formatting validation
- `file-upload-field/` - File upload with size and type validation
- `form-field/` - Text input with advanced validation
- `input-message-field/` - Input with additional message display
- `label-field/` - Standalone label component
- `memorable-date-field/` - Month/Day/Year date inputs
- `phone-field/` - Phone number input with formatting
- `privacy-agreement-field/` - Privacy agreement and certification
- `progress-bar-field/` - Form progress indicator
- `radio-field/` - Radio button group
- `select-field/` - Dropdown selection
- `signature-field/` - Digital signature capture
- `ssn-field/` - Social Security Number input with masking
- `textarea-field/` - Multi-line text input with character count

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

### PageTemplate Usage

```javascript
// Simple usage
<PageTemplate
  title="Page Title"
  subtitle="Instructions or description"
  data={formData}
  setFormData={setFormData}
  goForward={goForward}
  goBack={goBack}
  schema={validationSchema}
  sectionName="sectionName"
>
  <FormField name="field1" label="Field 1" />
  <FormField name="field2" label="Field 2" />
</PageTemplate>

// With render props for complex logic
<PageTemplate
  title="Complex Page"
  data={formData}
  setFormData={setFormData}
  goForward={goForward}
  goBack={goBack}
  schema={validationSchema}
  sectionName="complexSection"
>
  {({ localData, handleFieldChange, errors, formSubmitted }) => {
    // Complex conditional logic
    const showExtraField = localData.someCondition;

    return (
      <>
        <FormField
          name="field1"
          value={localData.field1}
          onChange={handleFieldChange}
          error={errors.field1}
          forceShowError={formSubmitted}
        />
        {showExtraField && (
          <FormField
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

## Error Boundary

- `FormErrorBoundary` - React error boundary that catches JavaScript errors and displays user-friendly error messages

## Usage

Import components using barrel exports:

```javascript
// Import Share Utility components
import {
  FormField,
  DateField,
  AddressField,
  PageTemplate,
  FormErrorBoundary,
} from '@bio-aquia/shared/components';

// Or import from specific subdirectories (recommended for tree-shaking)
import { FormField, DateField } from '@bio-aquia/shared/components/atoms';
import { AddressField } from '@bio-aquia/shared/components/molecules';
import { PageTemplate } from '@bio-aquia/shared/components/templates';

// Import directly from component directories
import { FormField } from '@bio-aquia/shared/components/atoms/form-field';
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

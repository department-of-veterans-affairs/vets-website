# Form 21P-530A: State or Tribal Organization Application for Interment Allowance

Application for state or tribal organizations to request burial allowances and related benefits for deceased Veterans.

## Overview

**Form Number**: VA Form 21P-530A

**OMB Number**: TBD

**Purpose**: State or tribal organization application for burial benefits

This application allows authorized state or tribal organizations to apply for interment allowances and burial benefits on behalf of deceased Veterans. The form collects organization information, deceased Veteran details, military service history, and burial information.

## Form Flow

The application consists of 4 chapters with 11 pages total:

### Chapter 1: Your organization's information

1. **Organization Information** - Organization name, type, contact person
2. **Burial Benefits Recipient** - Person/organization receiving benefits
3. **Mailing Address** - Where to send correspondence

### Chapter 2: Deceased Veteran information

4. **Personal Information** - Veteran's full name and relationship
5. **Identification** - SSN, service number, VA file number
6. **Birth Information** - Date and place of birth
7. **Burial Information** - Death/burial dates, cemetery information

### Chapter 3: Military history

8. **Served Under Different Name** - Yes/no question
9. **Service Periods (List & Loop)** - Add/edit/delete service periods:
   - Service Branch - Select branch of service
   - Service Dates - Start and end dates
   - Locations and Rank - Entry/separation locations and rank
   - Review Service Periods - Summary with edit/delete options
10. **Previous Name Entry (List & Loop, conditional)** - Add/edit/delete previous names:
    - Previous Name Entry - Name fields
    - Review Previous Names - Summary with edit/delete options

### Chapter 4: Additional remarks

11. **Additional Remarks** - Any additional information

## Architecture

### Directory Structure

```bash
21p-530a-interment-allowance/
├── components/           # Shared form components
│   ├── delete-modal/    # Delete confirmation modal and hook
│   ├── get-help/        # Help sidebar component
│   ├── pre-submit-info/ # Pre-submission information
│   ├── previous-name-summary-card/ # Summary card for previous names
│   └── service-period-summary-card/ # Summary card for service periods
├── config/              # Form configuration
│   ├── form.js          # Main form config with chapters/pages
│   └── prefill-transformer.js # Data prefill logic
├── containers/          # Page containers
│   ├── confirmation-page/ # Post-submission confirmation
│   └── introduction-page/ # Form introduction
├── pages/               # Form pages (CustomPage pattern)
│   ├── organization-information/
│   │   ├── organization-information.jsx       # Edit mode
│   │   └── organization-information-review.jsx # Review mode
│   ├── burial-benefits-recipient/
│   ├── mailing-address/
│   ├── veteran-personal-information/
│   ├── veteran-identification/
│   ├── veteran-birth-information/
│   ├── veteran-burial-information/
│   ├── veteran-served-under-different-name/
│   ├── service-periods/ # List & Loop: Summary page with add/edit/delete
│   ├── service-branch/  # List & Loop: Step 1 of service period entry
│   ├── service-dates/   # List & Loop: Step 2 of service period entry
│   ├── locations-and-rank/ # List & Loop: Step 3 of service period entry
│   ├── previous-name-entry/ # List & Loop: Single page for name entry
│   ├── veteran-previous-names/ # List & Loop: Summary page with add/edit/delete
│   ├── additional-remarks/
│   └── index.js         # Barrel exports
├── schemas/             # Zod validation schemas
│   ├── organization-information-schema.js
│   ├── burial-benefits-recipient-schema.js
│   ├── mailing-address-schema.js
│   ├── veteran-identification-schema.js
│   ├── veteran-birth-information-schema.js
│   ├── veteran-burial-information-schema.js
│   ├── service-periods-schema.js
│   ├── veteran-previous-names-schema.js
│   ├── additional-remarks-schema.js
│   └── index.js
├── tests/               # Integration tests
│   └── 21p-530a.cypress.spec.js
├── app-entry.jsx        # Application entry point
├── constants.js         # Form constants
├── manifest.json        # App manifest
├── reducers.js          # Redux reducers
└── routes.jsx           # Routing configuration
```

### Technical Stack

- **Framework**: React + Redux
- **Form System**: VA.gov Forms Platform (CustomPage pattern)
- **Validation**: Zod schemas with platform integration
- **Components**: VA Design System web components + BIO-AQ shared components
- **State Management**: Redux with save-in-progress support
- **Styling**: VA Design System + custom SASS

## Key Features

### Custom Page Pattern

Each form page uses the `CustomPage` and `CustomPageReview` pattern for full control over UI and validation:

```javascript
// Edit mode - CustomPage
export const OrganizationInformationPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => (
  <PageTemplate
    title="Your organization's information"
    data={data}
    setFormData={setFormData}
    goForward={goForward}
    goBack={goBack}
    onReviewPage={onReviewPage}
    updatePage={updatePage}
    schema={organizationInformationSchema}
    sectionName="organizationInformation"
  >
    {({ localData, handleFieldChange, errors, formSubmitted }) => (
      <TextInputField
        name="organizationName"
        label="Organization name"
        value={localData.organizationName}
        onChange={handleFieldChange}
        required
        error={errors.organizationName}
        forceShowError={formSubmitted}
      />
    )}
  </PageTemplate>
);

// Review mode - CustomPageReview
export const OrganizationInformationReviewPage = ({
  data,
  editPage,
  title,
}) => (
  <ReviewPageTemplate
    title={title}
    data={data}
    editPage={editPage}
    sectionName="organizationInformation"
  >
    <ReviewField
      label="Organization name"
      value={data?.organizationInformation?.organizationName}
    />
  </ReviewPageTemplate>
);
```

### Review Page System

The application implements a comprehensive review page system with:

- **ReviewPageTemplate** - Wrapper template with title, edit button, and proper styling
- **Review Field Components**:
  - `ReviewField` - Generic field display with optional formatting
  - `ReviewFullnameField` - Formats name objects (first, middle, last, suffix)
  - `ReviewDateField` - Displays dates in long or short format
  - `ReviewAddressField` - Multi-line address display (US, international, military)
- **Mobile-Responsive** - Platform review styling with responsive breakpoints
- **Edit Mode Integration** - Click edit → update → save → return to review

### Zod Validation

All pages use Zod schemas for type-safe validation:

```javascript
import { z } from 'zod';

export const organizationInformationSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationType: z.enum(['state', 'tribal'], {
    errorMap: () => ({ message: 'Please select an organization type' }),
  }),
  contactPerson: fullNameSchema,
  phoneNumber: phoneSchema,
});
```

Schemas are validated client-side in `PageTemplate` and integrated with platform form system.

### Shared Component Library

Leverages BIO-AQ shared components for consistency:

- **Form Fields**: `TextInputField`, `SelectField`, `SSNField`, `MemorableDateField`
- **Composite Fields**: `FullNameField`, `AddressField`, `PhoneField`
- **Review Components**: Full suite of review display components
- **Templates**: `PageTemplate`, `ReviewPageTemplate` for page structure

### List & Loop Pattern

Service periods and previous names use a multi-page list & loop pattern:

**Service Periods Flow** (3-step entry + summary):
1. **Service Branch** - Select branch of service
2. **Service Dates** - Enter start and end dates  
3. **Locations and Rank** - Enter entry/separation locations and rank
4. **Service Periods Summary** - Review all periods with edit/delete/add options

**Previous Names Flow** (1-step entry + summary):
1. **Previous Name Entry** - Enter full name
2. **Review Previous Names** - Review all names with edit/delete/add options

Key features:
- **Summary Cards**: Display added items with edit/delete actions
- **Delete Modal**: Confirmation dialog before deletion
- **Edit Flow**: Navigate back to entry pages with pre-filled data
- **Add Another**: Radio button to add additional items
- **Cancel Edit**: Navigate back to summary without saving

```javascript
// Example: Using useDeleteModal hook
const {
  isModalOpen,
  handleModalCancel,
  handleModalConfirm,
  handleDeleteClick,
} = useDeleteModal(onDelete);

// Example: Summary card component
<ServicePeriodSummaryCard
  servicePeriod={period}
  index={index}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Conditional Pages

The "Previous Names" flow only appears if user indicates Veteran served under a different name:

```javascript
previousNameEntry: {
  path: 'previous-name-entry',
  title: 'Previous name entry',
  CustomPage: PreviousNameEntryPage,
  depends: formData =>
    formData?.veteranServedUnderDifferentName?.veteranServedUnderDifferentName === 'yes',
}
```

### Save-in-Progress

Automatic save-in-progress support with custom messaging:

- Auto-saves form data to user account
- 60-day expiration window
- Custom messages for in-progress, expired, and saved states
- Prefill support for returning users

## Data Structure

The form data follows this structure:

```javascript
{
  organizationInformation: {
    organizationName: string,
    organizationType: 'state' | 'tribal',
    contactPerson: { first, middle, last, suffix },
    phoneNumber: string
  },
  burialBenefitsRecipient: {
    recipientName: string,
    relationship: string
  },
  mailingAddress: {
    street: string,
    street2?: string,
    city: string,
    state: string,
    postalCode: string
  },
  veteranPersonalInformation: {
    fullName: { first, middle, last, suffix },
    relationship: string
  },
  veteranIdentification: {
    ssn: string,
    serviceNumber?: string,
    vaFileNumber?: string
  },
  veteranBirthInformation: {
    dateOfBirth: string,
    placeOfBirth: { city: string, state: string }
  },
  veteranBurialInformation: {
    dateOfDeath: string,
    dateOfBurial: string,
    cemeteryName: string,
    cemeteryLocation: { city: string, state: string }
  },
  servicePeriods: {
    servicePeriods: [{
      branchOfService: string,
      dateRange: { from: string, to: string },
      placeOfService?: { city: string, state: string }
    }]
  },
  veteranServedUnderDifferentName: {
    veteranServedUnderDifferentName: 'yes' | 'no'
  },
  veteranPreviousNames: {
    previousNames: [{ first, middle, last, suffix }]
  },
  additionalRemarks: {
    remarks: string
  }
}
```

## Development

### Running the Application

```bash
# Watch mode (no auth)
yarn watch --env entry=21p-530a-interment-allowance

# Watch mode with authentication
yarn watch --env entry=auth,static-pages,login-page,terms-of-use,21p-530a-interment-allowance

# Build for production
yarn build --entry=21p-530a-interment-allowance
```

### Testing

```bash
# Unit tests
yarn test:unit --app-folder benefits-optimization-aquia/21p-530a-interment-allowance

# E2E tests
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21p-530a-interment-allowance/tests/*.cypress.spec.js"

# Specific component tests
yarn test:unit src/applications/benefits-optimization-aquia/21p-530a-interment-allowance/pages/organization-information/
```

### Adding a New Page

1. **Create page directory**:

```bash
mkdir src/applications/benefits-optimization-aquia/21p-530a-interment-allowance/pages/new-page
```

2. **Create edit mode component** (`new-page.jsx`):

```javascript
import { PageTemplate } from '@bio-aquia/shared/components/templates';
import { TextInputField } from '@bio-aquia/shared/components/atoms';
import { newPageSchema } from '@bio-aquia/21p-530a-interment-allowance/schemas';

export const NewPage = ({
  data,
  setFormData,
  goForward,
  goBack,
  onReviewPage,
  updatePage,
}) => (
  <PageTemplate
    title="New Page Title"
    data={data}
    setFormData={setFormData}
    goForward={goForward}
    goBack={goBack}
    onReviewPage={onReviewPage}
    updatePage={updatePage}
    schema={newPageSchema}
    sectionName="newPage"
  >
    {({ localData, handleFieldChange, errors, formSubmitted }) => (
      <TextInputField
        name="fieldName"
        label="Field Label"
        value={localData.fieldName}
        onChange={handleFieldChange}
        error={errors.fieldName}
        forceShowError={formSubmitted}
      />
    )}
  </PageTemplate>
);
```

3. **Create review mode component** (`new-page-review.jsx`):

```javascript
import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates';
import { ReviewField } from '@bio-aquia/shared/components/atoms';

export const NewPageReviewPage = ({ data, editPage, title }) => (
  <ReviewPageTemplate
    title={title}
    data={data}
    editPage={editPage}
    sectionName="newPage"
  >
    <ReviewField label="Field Label" value={data?.newPage?.fieldName} />
  </ReviewPageTemplate>
);
```

4. **Create Zod schema** (`schemas/new-page-schema.js`):

```javascript
import { z } from 'zod';

export const newPageSchema = z.object({
  fieldName: z.string().min(1, 'Field is required'),
});
```

5. **Add to form config** (`config/form.js`):

```javascript
import { NewPage } from '@bio-aquia/21p-530a-interment-allowance/pages/new-page/new-page';
import { NewPageReviewPage } from '@bio-aquia/21p-530a-interment-allowance/pages/new-page/new-page-review';

// In chapters object:
chapterName: {
  pages: {
    newPage: {
      path: 'new-page',
      title: 'New Page Title',
      uiSchema: {},
      schema: { type: 'object', properties: {} },
      CustomPage: NewPage,
      CustomPageReview: NewPageReviewPage,
      pagePerItemIndex: 0,
    }
  }
}
```

6. **Export from pages/index.js**:

```javascript
export { NewPage } from './new-page/new-page';
```

7. **Write tests**:

```bash
# Create test file
touch pages/new-page/new-page.unit.spec.jsx
```

## Accessibility

- **WCAG 2.2 AA Compliant**: All components meet accessibility standards
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Form Validation**: Clear, accessible error messages
- **Focus Management**: Logical focus order and visible focus indicators

## Related Documentation

- [BIO-AQ Shared Components](../shared/components/README.md)
- [BIO-AQ Shared Schemas](../shared/schemas/README.md)
- [VA.gov Forms System](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-overview)
- [VA Design System](https://design.va.gov/)

## Support

**Team**: Benefits Intake Optimization - Aquia

**Slack**: #benefits-optimization-aquia

# Personal Information Page Pattern (Authenticated)

The Personal Information component is a reusable React component used in VA.gov form applications to display a page that is used to validate a user's personal information. This page is sometimes also called a "Veteran Information" page. It typically appears at the beginning of form applications to confirm basic user information that is prefilled from the VA profile data stored in Redux state along with some prefilled data from the `in_progress_forms` endpoint.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Implementation](#basic-implementation)
  - [Custom Configuration](#custom-configuration)
  - [Custom Components](#custom-components)
- [Configuration Options](#configuration-options)
  - [PersonalInformationConfig](#personalinformationconfig)
  - [DataAdapter](#dataadapter)
- [Data Requirements](#data-requirements)
- [Error Handling](#error-handling)
  - [Missing Required Fields](#missing-required-fields)
- [Security Considerations](#security-considerations)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Debugging](#debugging)
- [Contributing](#contributing)
- [Related Documentation](#related-documentation)

## Features

- Displays user's personal information in a card format
- Configurable fields (name, SSN, VA file number, date of birth, sex)
- Flexible data adaptation through configurable path lookups
- Accessibility support with screen reader formatting
- Navigation button integration
- Customizable error messages for missing _required_ data (optional)
- Custom header, footer, and note sections (optional)

## Installation

This component is part of the VA.gov forms system, so it should be available in your application via a direct import from the `platform/forms-system`.


```js
// import of the forms-system factory function that will provide a pre-built page based on configuration
import { personalInformationPage } from 'platform/forms-system/src/js/components/PersonalInformation';

// import of a CustomPage style component that can be further customized in rare circumstances by form teams
import { PersonalInformation } from 'platform/forms-system/src/js/components/PersonalInformation';
```

## Usage

### Basic Implementation
- defaults to display name, ssn, and dateOfBirth
- defaults to no fields being required for form to continue
- assumes Redux state includes form data `form.data.ssn`
- assumes Redux state includes the profile data `user.prfoline.userFullName` and `user.profile.dob`

```jsx
import { personalInformationPage } from '@department-of-veterans-affairs/forms-system';

const formConfig = {
  chapters: {
    personalInformation: {
      pages: {
        ...personalInformationPage()
      }
    }
  }
};
```

### Custom Configuration
- key: allows the page to be uniquely identified in the form config
- title: page title displayed in the page header
- path: url path for the page
- personalInfoConfig: allows field display and required status to be customized
- dataAdapter: allows data adapter paths to be customized, for when the prefill endpoint does not return the data in the expected format

```jsx
const customConfig = {
  key: 'customPersonalInfo',
  title: 'Veteran Information',
  path: 'veteran-info',
  personalInfoConfig: {
    name: { show: true, required: true },
    ssn: { show: true, required: true },
    vaFileNumber: { show: true, required: false },
    dateOfBirth: { show: true, required: true },
    sex: { show: false, required: false }
  },
  dataAdapter: {
    ssnPath: 'veteran.ssn',
    vaFileNumberPath: 'veteran.vaFileNumber'
  }
};

// application formConfig
const formConfig = {
  chapters: {
    personalInformation: {
      pages: {
        ...personalInformationPage(customConfig)
      }
    }
  }
};
```

### Custom Components

```jsx
import {
  PersonalInformation,
  PersonalInformationNote,
  PersonalInformationHeader,
  PersonalInformationFooter,
  PersonalInformationCardHeader
} from '@department-of-veterans-affairs/forms-system';

const CustomPersonalInfo = (props) => (
  <PersonalInformation {...props}>
    <PersonalInformationHeader>
      <h2>Custom Header</h2>
    </PersonalInformationHeader>
    <PersonalInformationCardHeader>
      <h3>Personal Details</h3>
    </PersonalInformationCardHeader>
    <PersonalInformationNote>
      <p>Custom note content</p>
    </PersonalInformationNote>
    <PersonalInformationFooter>
      <p>Custom footer content</p>
    </PersonalInformationFooter>
  </PersonalInformation>
);
```

## Configuration Options

### PersonalInformationConfig

Controls the visibility and requirement status of each field.

```typescript
interface FieldConfig {
  show: boolean;    // Whether to display the field
  required: boolean; // Whether the field is required
}

interface PersonalInformationConfig {
  name?: FieldConfig;
  ssn?: FieldConfig;
  vaFileNumber?: FieldConfig;
  dateOfBirth?: FieldConfig;
  sex?: FieldConfig;
}
```

### DataAdapter

Configures paths to data in the form state.

```typescript
interface DataAdapter {
  ssnPath?: string;         // Path to SSN in form data
  vaFileNumberPath?: string; // Path to VA file number in form data
}
```

## Data Requirements

The page potentially expects data from two sources:

1. Redux state (VA Profile data):
   - `userFullName` (first, middle, last, suffix)
   - `dob` (ISO format date string)
   - `gender` (is used to display the sex as Male or Female)

2. Form data (through data adapter):
   - SSN (last four digits)
   - VA File Number (last four digits)

## Error Handling

### Missing Required Fields

When required fields are missing, the component displays an error message using either:
- Default error component (`DefaultErrorMessage`)
- Custom error component passed through configuration
- if the error message is display, the form will not allow continuing to the next page, and a required field not being present will be deemed fatal

If possible, the form team should provide a way to prevent this from happening, by providing a way to enter the missing data.

## Security Considerations

- Displays only last 4 digits of SSN or VA File Number
- No direct editing of personal information for security
- Provides secure channel (phone) for information updates

## Best Practices

1. Data Adaptation
   ```jsx
   // Prefer using data adapter over direct prop passing
   const adapter = {
     ssnPath: 'veteran.ssn',
     vaFileNumberPath: 'veteran.vaFileNumber'
   };
   ```

2. Error Handling
   ```jsx
   // Custom error component
   const CustomError = ({ missingFields }) => (
     <div className="custom-error">
       {missingFields.map(field => (
         <p key={field}>{`Missing ${field}`}</p>
       ))}
     </div>
   );
   ```

3. Component Composition
   ```jsx
   // Use provided wrapper components for custom content if needing to build a CustomPage style component
   <PersonalInformationNote>
     <CustomNote />
   </PersonalInformationNote>
   ```

## Troubleshooting

### Common Issues

1. Missing Data
   - Verify Redux state contains VA Profile data
   - Check data adapter paths match form state structure from the prefill endpoint
   - Check the 'in_progress_forms/YOUR_FORM_NAME' endpoint is being called

2. Display Issues
   - Ensure VA Design System components are properly imported
   - Verify CSS dependencies are included

3. Navigation Issues
   - Confirm `NavButtons` component is properly passed
   - Verify `goBack` and `goForward` functions are provided

### Debugging

Enable React DevTools to inspect:
- Component props and state changes

Enable Redux DevTools to inspect:
- VA Profile state
- Form data state

## Contributing

When modifying this component:
1. Maintain accessibility standards
2. Update tests for new features
3. Document API changes
4. Follow VA Design System guidelines including using utility classes and web-components

## Related Documentation

- [VA Design System](https://design.va.gov/)
- [VA Forms System](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-overview)
- [Common Redux State Store Startup](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/startup/store.js)
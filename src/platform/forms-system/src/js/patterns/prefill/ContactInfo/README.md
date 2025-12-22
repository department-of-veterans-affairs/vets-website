# Contact Information Page Pattern (Authenticated)

The Contact Information component is a reusable React component used in VA.gov form applications to display and manage a user's contact information. It typically appears early in form applications to confirm and update contact details that are prefilled from the VA Profile data stored in Redux state. The component provides inline editing capabilities and integrates with the VA Profile service (VAP) to sync changes across VA.gov.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basic Implementation](#basic-implementation)
  - [Custom Configuration](#custom-configuration)
  - [Custom Content](#custom-content)
- [Configuration Options](#configuration-options)
  - [ContactInformationPageSettings](#contactinformationpagesettings)
  - [ContactInfoKeys](#contactinfokeys)
  - [Content Customization](#content-customization)
- [Data Requirements](#data-requirements)
- [Component Architecture](#component-architecture)
  - [Main Components](#main-components)
  - [Edit Components](#edit-components)
  - [Custom Hooks](#custom-hooks)
- [Data Flow](#data-flow)
  - [Profile Synchronization](#profile-synchronization)
  - [Edit Flow](#edit-flow)
  - [Validation](#validation)
- [Error Handling](#error-handling)
  - [Missing Required Fields](#missing-required-fields)
  - [Invalid Data](#invalid-data)
  - [Form-Only Updates](#form-only-updates)
- [Security Considerations](#security-considerations)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
  - [Common Issues](#common-issues)
  - [Debugging](#debugging)
- [Testing](#testing)
- [Contributing](#contributing)
- [Related Documentation](#related-documentation)

## Features

- **Inline Editing**: Edit contact information directly from the form flow
- **VA Profile Integration**: Automatic synchronization with VA.gov profile
- **Configurable Fields**: Flexible configuration for email, phones, and address
- **Validation**: Built-in validation for phone numbers, email, and addresses
- **Required Field Support**: Mark fields as required and prevent form continuation if missing
- **Update Notifications**: Success/error alerts for profile updates
- **Review & Submit Integration**: Custom review component for final submission page
- **Accessibility Support**: Screen reader friendly with proper focus management
- **Mock Data Support**: Local development with mock contact data

## Installation

This component is part of the VA.gov forms system and should be available in your application via a direct import from the `platform/forms-system`.

```js
// Import the factory function that provides pre-built pages
import { profileContactInfoPage } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';

// Import individual components for custom implementations
import ContactInfo from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';
import ContactInfoReview from 'platform/forms-system/src/js/patterns/prefill/ContactInfo/ContactInfoReview';
```

## Usage

### Basic Implementation

Default configuration displays all contact fields (email, home phone, mobile phone, mailing address) with none required:

```jsx
import { profileContactInfoPage } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';

const formConfig = {
  chapters: {
    contactInformation: {
      pages: {
        ...profileContactInfoPage()
      }
    }
  }
};
```

### Custom Configuration

Customize which fields to display, mark fields as required, and configure data paths:

```jsx
import { profileContactInfoPage } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

const customConfig = {
  // Page identification
  contactInfoPageKey: 'confirmContactInformation',
  contactPath: 'contact-information',
  
  // Content customization
  content: getContent('application'), // or custom content object
  
  // Data keys - customize where contact info is stored in form data
  wrapperKey: 'veteran',
  emailKey: 'email',
  homePhoneKey: 'homePhone',
  mobilePhoneKey: 'mobilePhone',
  addressKey: 'mailingAddress',
  
  // Which fields to include
  included: ['email', 'mobilePhone', 'mailingAddress'], // Excludes home phone
  
  // Required fields - prevents form continuation if missing
  contactInfoRequiredKeys: ['email', 'mobilePhone', 'mailingAddress'],
  
  // Conditional page display
  depends: (formData) => formData.someCondition,
  
  // Custom schemas (optional - defaults provided)
  emailSchema: customEmailSchema,
  phoneSchema: customPhoneSchema,
  addressSchema: customAddressSchema,
  
  // UI options
  contactSectionHeadingLevel: 'h4', // Default: 'h3' (main page) or 'h4' (review)
  editContactInfoHeadingLevel: 'h3', // Default: 'h3'
  disableMockContactInfo: false, // Disable mock data in local development
  
  // Advanced options
  contactInfoUiSchema: {
    'ui:required': (formData) => true,
    'ui:validations': [customValidation]
  },
  prefillPatternEnabled: true, // Enable prefill pattern features
};

const formConfig = {
  chapters: {
    contactInformation: {
      pages: {
        ...profileContactInfoPage(customConfig)
      }
    }
  }
};
```

### Custom Content

Customize all text content displayed in the component:

```jsx
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

// Get default content and override specific strings
const customContent = {
  ...getContent('application'),
  title: 'Confirm your contact details',
  description: <p>We'll use this information to contact you about your application.</p>,
  alertContent: 'Thank you for updating your information.',
  editLabel: 'Edit contact information',
  edit: 'Update',
  add: 'Add',
  updated: 'updated',
  // Field labels
  homePhone: 'Home telephone',
  mobilePhone: 'Mobile telephone',
  email: 'Email address',
  mailingAddress: 'Mailing address',
  // Error messages
  missingPhoneError: 'Please enter a phone number',
  missingEmailError: 'Please enter an email address',
  // ... see getContent() for all available options
};

const formConfig = {
  chapters: {
    contactInformation: {
      pages: {
        ...profileContactInfoPage({ content: customContent })
      }
    }
  }
};
```

## Configuration Options

### ContactInformationPageSettings

Full configuration object for `profileContactInfoPage()`:

```typescript
interface ContactInformationPageSettings {
  // Page configuration
  contactInfoPageKey?: string;           // Page key in form config (default: 'confirmContactInfo')
  contactPath?: string;                  // URL path (default: 'contact-information')
  
  // Content
  content?: ContactInfoContent;          // Custom content/labels (default: getContent('application'))
  
  // Data keys - customize where data is stored in form.data
  wrapperKey?: string;                   // Wrapper object key (default: 'veteran')
  emailKey?: string;                     // Email field key (default: 'email')
  homePhoneKey?: string;                 // Home phone field key (default: 'homePhone')
  mobilePhoneKey?: string;               // Mobile phone field key (default: 'mobilePhone')
  addressKey?: string;                   // Address field key (default: 'mailingAddress')
  
  // Field configuration
  included?: string[];                   // Fields to include (default: all)
  contactInfoRequiredKeys?: string[];    // Required field keys (default: [])
  
  // Schemas
  emailSchema?: object;                  // Custom email schema
  phoneSchema?: object;                  // Custom phone schema
  addressSchema?: object;                // Custom address schema
  
  // UI customization
  contactSectionHeadingLevel?: string;   // Heading level for sections (default: 'h3'/'h4')
  editContactInfoHeadingLevel?: string;  // Heading level for edit pages (default: 'h3')
  disableMockContactInfo?: boolean;      // Disable mock data locally (default: false)
  
  // Advanced
  depends?: (formData) => boolean;       // Conditional display function
  contactInfoUiSchema?: object;          // Custom uiSchema
  prefillPatternEnabled?: boolean;       // Enable prefill features (default: false)
}
```

### ContactInfoKeys

The `keys` object defines where contact information is stored in form data:

```typescript
interface ContactInfoKeys {
  wrapper: string;      // Parent object key (e.g., 'veteran')
  email?: string;       // Email field key (e.g., 'email')
  homePhone?: string;   // Home phone field key (e.g., 'homePhone')
  mobilePhone?: string; // Mobile phone field key (e.g., 'mobilePhone')
  address?: string;     // Address field key (e.g., 'mailingAddress')
}
```

Example form data structure:
```json
{
  "veteran": {
    "email": {
      "emailAddress": "user@example.com",
      "id": 123,
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "homePhone": {
      "areaCode": "555",
      "phoneNumber": "1234567",
      "phoneType": "HOME",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "mobilePhone": {
      "areaCode": "555",
      "phoneNumber": "7654321",
      "phoneType": "MOBILE",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "mailingAddress": {
      "addressLine1": "123 Main St",
      "city": "Springfield",
      "stateCode": "IL",
      "zipCode": "62701",
      "countryName": "United States",
      "addressType": "DOMESTIC",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Content Customization

The `content` object allows customization of all displayed text:

```typescript
interface ContactInfoContent {
  // Page content
  title: string;
  description?: React.ReactNode;
  alertContent: string;
  
  // Action labels
  edit: string;
  add: string;
  update: string;
  updated: string;
  editLabel: string;
  
  // Field labels
  homePhone: string;
  mobilePhone: string;
  email: string;
  mailingAddress: string;
  country: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  province: string;
  zipCode: string;
  postal: string;
  
  // Edit page labels
  editHomePhone: string;
  editMobilePhone: string;
  editEmail: string;
  editMailingAddress: string;
  
  // Error messages
  missingPhoneError: string;
  missingEmailError: string;
  missingCountryError: string;
  missingStreetAddressError: string;
  missingCityError: string;
  missingStateError: string;
  missingZipError: string;
  invalidPhoneError: string;
  invalidEmailError: string;
  invalidZipError: string;
}
```

## Data Requirements

The component expects data from two sources:

### 1. Redux State (VA Profile Data)

Located at `state.user.profile.vapContactInfo`:

```javascript
{
  email: {
    emailAddress: string,
    id: number,
    status: string,
    updatedAt: string (ISO 8601)
  },
  homePhone: {
    areaCode: string,
    phoneNumber: string,
    extension?: string,
    phoneType: 'HOME',
    id: number,
    status: string,
    updatedAt: string (ISO 8601)
  },
  mobilePhone: {
    areaCode: string,
    phoneNumber: string,
    extension?: string,
    phoneType: 'MOBILE',
    id: number,
    status: string,
    updatedAt: string (ISO 8601)
  },
  mailingAddress: {
    addressLine1: string,
    addressLine2?: string,
    addressLine3?: string,
    city: string,
    stateCode: string,      // For US addresses
    province?: string,       // For international addresses
    zipCode: string,         // For US addresses
    internationalPostalCode?: string, // For international addresses
    countryName: string,
    countryCodeIso3: string,
    addressType: 'DOMESTIC' | 'INTERNATIONAL',
    id: number,
    status: string,
    updatedAt: string (ISO 8601)
  }
}
```

### 2. Form Data (via Form Prefill)

The component syncs VA Profile data into form data under the configured wrapper key. The component automatically handles synchronization, preferring the most recently updated value between profile and form data.

### Data Source Selection

The component intelligently selects the data source based on environment and authentication:

```javascript
// In ContactInfo.jsx
const profile = useSelector(selectProfile) || {};
const loggedIn = useSelector(isLoggedIn) || false;
const contactInfo =
  loggedIn && environment.isLocalhost() && !disableMockContactInfo
    ? generateMockUser({ authBroker: 'iam' }).data.attributes.vet360ContactInformation
    : profile.vapContactInfo || {};
```

**Data Source Priority:**
1. **Local Development (localhost) with logged in user**: Uses mock data from `generateMockUser()` for easier development
   - Can be disabled by setting `disableMockContactInfo: true` in configuration
2. **Production/Staging or Mock Disabled**: Uses real VA Profile data from `profile.vapContactInfo`
3. **Not Logged In**: Empty object `{}`

**Example Data Flow:**
```javascript
// 1. User is logged in on localhost (development)
// contactInfo = mock data with complete profile
{
  email: { emailAddress: 'veteran@example.com', updatedAt: '2024-01-15T10:30:00Z' },
  homePhone: { areaCode: '555', phoneNumber: '1234567', updatedAt: '2024-01-15T10:30:00Z' },
  // ... complete mock data
}

// 2. User is logged in on production
// contactInfo = real VA Profile data from Redux
{
  email: profile.vapContactInfo.email,
  homePhone: profile.vapContactInfo.homePhone,
  // ... real user data from VA Profile
}

// 3. User is not logged in
// contactInfo = {}
// Component displays "You must be logged in to enable view and edit this page."
```

This data is then synced to form data via the `syncProfileData()` function, which runs on component mount and whenever profile data changes.

## Component Architecture

### Main Components

#### ContactInfo (ContactInfo.jsx)
The primary display component that shows contact information cards with inline edit capabilities.

**Key Features:**
- Displays contact information in `va-card` components
- Provides "Edit" or "Add" links for each field
- Shows success/error alerts after updates
- Validates required fields and prevents form continuation if missing
- Automatically syncs with VA Profile data
- Handles navigation to/from edit pages

**Props:**
```typescript
{
  data: object,              // Full form data
  goBack: function,          // Navigate back
  goForward: function,       // Navigate forward
  onReviewPage: boolean,     // If on review page
  updatePage: function,      // Update current page
  setFormData: function,     // Update form data
  content: object,           // Content/labels
  keys: object,              // Data keys configuration
  requiredKeys: string[],    // Required field keys
  contactPath: string,       // Base path for edit pages
  contactInfoPageKey: string // Page identifier
}
```

#### ContactInfoReview (ContactInfoReview.jsx)
Displays contact information on the review & submit page.

**Key Features:**
- Renders contact info in compact review format
- Shows validation errors inline
- Provides single "Edit" button to return to contact page
- Hides empty optional fields
- Supports both US and international addresses

**Props:**
```typescript
{
  data: object,              // Full form data
  editPage: function,        // Navigate to edit page
  content: object,           // Content/labels
  keys: object,              // Data keys configuration
  contactInfoPageKey: string // Page identifier
}
```

### Edit Components

Edit components are rendered on separate pages and integrate with VA Profile service:

#### EditHomePhone
Edit page for home phone number using VAP service.

#### EditMobilePhone
Edit page for mobile phone number using VAP service.

#### EditEmail
Edit page for email address using VAP service.

#### EditAddress
Edit page for mailing address using VAP service with address validation.

**Shared Edit Component Features:**
- Uses `ProfileInformationFieldController` from VAP service
- Shows info alert about profile sync (except for address)
- Validates input before saving
- Updates both form data and VA Profile
- Handles errors gracefully
- Returns to contact page after save or cancel

### Custom Hooks

#### useContactInfo (useContactInfo.js)
Hook for accessing and analyzing contact information state.

**Returns:**
```typescript
{
  email: { emailAddress, id, status, missing, required },
  homePhone: { phoneNumber, extension, id, status, missing, required },
  mobilePhone: { phoneNumber, extension, id, status, missing, required },
  mailingAddress: { addressLine1, city, stateCode, zipCode, ..., missing, required },
  missingFields: Array<{ field, editPath, label }>,
  isLoggedIn: boolean
}
```

**Usage:**
```javascript
const contactInfo = useContactInfo({
  disableMockContactInfo: false,
  requiredKeys: ['email', 'mobilePhone'],
  fullContactPath: '/application/contact-information'
});

if (contactInfo.missingFields.length > 0) {
  // Handle missing required fields
}
```

#### useRouteMetadata (useRouteMetadata.js)
Extracts route metadata from React Router for generating edit paths.

**Returns:**
```typescript
{
  urlPrefix: string,
  path: string,
  formConfig: object
} | null
```

## Data Flow

### Profile Synchronization

The component automatically syncs VA Profile data with form data using an intelligent merge strategy:

```javascript
// In ContactInfo component - syncProfileData()
// 1. Compares updatedAt timestamps between profile and form data
// 2. Prefers the more recently updated value
// 3. Converts nullish values to empty strings for form compatibility
// 4. Updates form data if changes detected
```

**Example Sync Logic:**
```javascript
const profileUpdated = '2024-01-15T10:30:00Z';
const formUpdated = '2024-01-14T09:00:00Z';

// Form data is older, use profile data
if (formUpdated < profileUpdated) {
  updatedWrapper[key] = profileValue;
}
```

### Edit Flow

1. **User Clicks Edit/Add Link**
   - Navigation to edit page (e.g., `/contact-information/edit-email-address`)
   - Sets return state in session storage
   - Passes field key and wrapper key via router state

2. **Edit Page Loads**
   - Initializes VAP service
   - Renders `ProfileInformationFieldController` in force edit view
   - Pre-fills with current value from form data

3. **User Makes Changes**
   - VAP service validates input
   - Shows validation errors if needed

4. **User Saves**
   - VAP service updates VA Profile via API
   - On success:
     - Refreshes profile in Redux
     - Navigates back to contact page
     - Shows success alert
     - Syncs new data to form
   - On error:
     - Shows error alert
     - Allows retry

5. **User Cancels**
   - Returns to contact page without changes
   - Shows "canceled" state (no alert)

### Validation

#### Main Page Validation
```javascript
// Checks for missing required fields
const missingInfo = getMissingInfo({
  data: dataWrap,
  keys,
  content,
  requiredKeys
});

// Checks custom validation rules
const validationErrors = getValidationErrors(
  uiSchema?.['ui:validations'] || [],
  {},
  data
);
```

#### Review Page Validation
```javascript
// Phone validation
validatePhone(content, phoneObject); // Checks area code and phone number

// Email validation
validateEmail(content, emailAddress); // Checks format

// Zipcode validation
validateZipcode(content, zipCode); // Checks 5-digit format for US addresses
```

## Error Handling

### Missing Required Fields

When required fields are missing, the component:

1. **Displays Warning Alert**: Shows immediately with list of missing fields
   ```
   ⚠️ Your email address is missing. Please edit and update the field.
   ```

2. **Displays Error on Submit**: If user tries to continue without fixing
   ```
   ❌ We still don't have your email address. Please edit and update the field.
   ```

3. **Prevents Navigation**: `goForward` is blocked until all required fields are present

4. **Focuses on Error**: Scrolls and focuses on alert for accessibility

**Example:**
```jsx
{missingInfo.length > 0 && (
  <>
    <p><strong>Note:</strong> An email address is required for this application.</p>
    {submitted && (
      <va-alert status="error" slim>
        We still don't have your email address. Please edit and update the field.
      </va-alert>
    )}
    <va-alert status="warning" slim>
      Your email address is missing. Please edit and update the field.
    </va-alert>
  </>
)}
```

### Invalid Data

The review page component validates data and shows inline errors:

```jsx
// Invalid phone number
<span className="usa-input-error-message">Invalid phone number</span>

// Invalid email
<span className="usa-input-error-message">Invalid email address</span>

// Invalid zipcode
<span className="usa-input-error-message">Invalid zip code</span>
```

### Form-Only Updates

When VAP service successfully updates form data but fails to update the VA Profile:

```jsx
<va-alert status="error" slim>
  <p>
    <strong>
      We couldn't update your VA.gov profile, but your changes were saved to
      this form.
    </strong>
    You can try again later to update your profile, or continue with the
    form using the information you entered.
  </p>
</va-alert>
```

This allows users to proceed with their application even if the profile update fails.

## Security Considerations

- **PII Protection**: Uses `dd-privacy-hidden` and `dd-privacy-mask` classes for Datadog RUM privacy
- **Session Storage**: Uses session storage for temporary state, cleared after navigation
- **Profile Integration**: All profile updates go through secure VAP service API
- **Validation**: Server-side validation occurs in addition to client-side
- **Authentication Required**: Component requires authenticated user session

**Example Privacy Protection:**
```jsx
<span className="dd-privacy-hidden" data-dd-action-name="email">
  {email}
</span>
```

## Best Practices

### 1. Always Use Required Keys for Critical Information
```jsx
// Good - prevents incomplete submissions
profileContactInfoPage({
  contactInfoRequiredKeys: ['email', 'mobilePhone'],
  included: ['email', 'homePhone', 'mobilePhone']
});

// Bad - allows submission without contact method
profileContactInfoPage({
  included: ['email', 'homePhone', 'mobilePhone']
  // No required keys specified
});
```

### 2. Customize Content for Context
```jsx
// Good - clear, form-specific language
profileContactInfoPage({
  content: {
    ...getContent('application'),
    title: 'Confirm your contact information',
    description: (
      <p>We'll use this information to send you updates about your claim.</p>
    )
  }
});
```

### 3. Use Appropriate Data Keys
```jsx
// Good - consistent with form structure
profileContactInfoPage({
  wrapperKey: 'claimant',
  emailKey: 'emailAddress',
  // ... matches your form's data structure
});
```

### 4. Handle Review Page Errors
```jsx
// Provide review error override for proper navigation
import { profileReviewErrorOverride } from 'platform/forms-system/src/js/patterns/prefill/ContactInfo';

const formConfig = {
  // ...
  reviewErrors: {
    ...otherReviewErrors,
    ...profileReviewErrorOverride({
      contactInfoChapterKey: 'contactInformation',
      contactInfoPageKey: 'confirmContactInfo',
      wrapperKey: 'veteran'
    })
  }
};
```

### 5. Test with Mock Data Disabled
```jsx
// During integration testing, verify real data flow
profileContactInfoPage({
  disableMockContactInfo: true
});
```

## Troubleshooting

### Common Issues

#### 1. Missing Data in Form
**Symptom:** Contact info doesn't appear on page  
**Cause:** Data keys don't match form structure  
**Solution:** 
```jsx
// Check that keys match your form.data structure
console.log('Form data:', formData);
// Adjust configuration to match
profileContactInfoPage({
  wrapperKey: 'applicant', // Must match formData structure
  emailKey: 'emailAddress'
});
```

#### 2. Edit Page Not Found
**Symptom:** 404 when clicking edit link  
**Cause:** `contactPath` doesn't match chapter path  
**Solution:**
```jsx
// Ensure contactPath matches the chapter's path configuration
const formConfig = {
  chapters: {
    contactInfo: {
      pages: {
        ...profileContactInfoPage({
          contactPath: 'contact-info' // Must match chapter path
        })
      }
    }
  }
};
```

#### 3. Changes Not Persisting
**Symptom:** Updates in edit page don't show on main page  
**Cause:** Profile sync timing or React Router state not passed  
**Solution:**
- Verify `setFormData` is called after profile refresh
- Check that edit links pass state correctly:
```jsx
router.push({
  pathname: `${baseEditPath}/edit-email-address`,
  state: {
    formKey: keys.email,
    keys: { wrapper: keys.wrapper }
  }
});
```

#### 4. Required Field Validation Not Working
**Symptom:** Can proceed without required fields  
**Cause:** Field keys don't match `contactInfoRequiredKeys`  
**Solution:**
```jsx
// Ensure required keys exactly match the data keys
profileContactInfoPage({
  addressKey: 'mailingAddress',
  emailKey: 'email',
  contactInfoRequiredKeys: [
    'mailingAddress', // Must exactly match addressKey
    'email'           // Must exactly match emailKey
  ]
});
```

### Debugging

#### Enable Logging
```javascript
// In ContactInfo.jsx
useEffect(() => {
  console.log('Contact info sync:', {
    profileData: contactInfo,
    formData: dataWrap,
    keys,
    missingInfo
  });
}, [contactInfo, dataWrap, keys, missingInfo]);
```

#### Check Redux State
```javascript
// In browser console
window.store.getState().user.profile.vapContactInfo;
window.store.getState().form.data.veteran; // Or your wrapper key
```

#### Verify Router State
```javascript
// In EditContactInfo.jsx
console.log('Router state:', router?.location?.state);
```

## Testing

### Unit Test Example

```javascript
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import ContactInfo from '../ContactInfo';

describe('<ContactInfo>', () => {
  const defaultProps = {
    data: {
      veteran: {
        email: { emailAddress: 'test@example.com' },
        homePhone: { areaCode: '555', phoneNumber: '1234567' },
        mobilePhone: { areaCode: '555', phoneNumber: '7654321' },
        mailingAddress: {
          addressLine1: '123 Main St',
          city: 'Springfield',
          stateCode: 'IL',
          zipCode: '62701'
        }
      }
    },
    goBack: () => {},
    goForward: () => {},
    setFormData: () => {},
    content: getContent(),
    keys: {
      wrapper: 'veteran',
      email: 'email',
      homePhone: 'homePhone',
      mobilePhone: 'mobilePhone',
      address: 'mailingAddress'
    },
    requiredKeys: ['email'],
    contactPath: 'contact-info',
    contactInfoPageKey: 'confirmContactInfo'
  };

  it('should render contact info cards', () => {
    const { container } = render(<ContactInfo {...defaultProps} />);
    
    expect(container.querySelectorAll('va-card').length).to.equal(4);
  });

  it('should show error when required field missing', () => {
    const props = {
      ...defaultProps,
      data: { veteran: {} }
    };
    
    const { container } = render(<ContactInfo {...props} />);
    
    expect(container.querySelector('va-alert[status="warning"]')).to.exist;
  });
});
```

### Integration Test Tips

1. **Mock VAP Service**: Mock the VAP service calls in integration tests
2. **Test Edit Flow**: Navigate through edit pages and verify data sync
3. **Test Validation**: Submit with missing required fields and verify error messages
4. **Test Profile Sync**: Update profile data and verify form data updates

## Contributing

When modifying this component:

1. **Maintain Backward Compatibility**: Many forms rely on default behavior
2. **Update Tests**: Add tests for new features
3. **Document API Changes**: Update this README
4. **Follow Accessibility Standards**: Test with screen readers
5. **Consider Performance**: Profile syncs happen frequently
6. **Test Edit Flow**: Verify all edit pages work correctly

### Making Changes

```bash
# Run unit tests
yarn test:unit src/platform/forms-system/src/js/patterns/prefill/ContactInfo

# Run specific test file
yarn test:unit src/platform/forms-system/src/js/patterns/prefill/ContactInfo/tests/ContactInfo.unit.spec.jsx

# Check for console errors during manual testing
```

## Related Documentation

- [VA Design System](https://design.va.gov/)
- [VA Forms System](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-overview)
- [VAP Service Documentation](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-profile-integration)
- [Profile Component Documentation](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/platform/user/profile/vap-svc)
- [PersonalInformation Pattern](../PersonalInformation/README.md) - Similar pattern for personal info
- [Common Redux State Store](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/platform/startup/store.js)
- [Address Validation](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/platform/forms/address)

---

**Note:** This component is part of the VA.gov Forms System prefill patterns. For questions or issues, contact the VA.gov Platform team.

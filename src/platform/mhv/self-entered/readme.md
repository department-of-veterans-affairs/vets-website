# How to Use the `generateSEIPdf` Function and `MissingRecordsError` Component

This guide provides a detailed explanation of how to use the `generateSEIPdf` function to generate PDFs containing self-entered health information, as well as the `MissingRecordsError` component to display errors for domains that failed to load.

---

## Overview

The `generateSEIPdf` function:
1. Fetches self-entered health data using either a unified API or individual domain-specific APIs, based on a feature flag.
2. Processes the fetched data to identify failed health domains.
3. Creates a PDF report with the successfully retrieved data.
4. Returns a success status and a list of failed domains.

The `MissingRecordsError` component:
- Displays an error message with a list of human-readable domain names that failed to load.
- Can be used alongside the `generateSEIPdf` function to inform users about missing data.

### Why Are Failed Domains Important?

The SEI document aggregates self-entered health information across several domains (e.g., Allergies, Medications, Family History). Any domain that fails to load will result in incomplete information in the generated PDF. By identifying these failures:
- Users can be informed about missing data.
- Appropriate error handling and retry logic can be implemented for specific domains.
- Clinical relevance can be ensured (e.g., including "Medications" if "Allergies" fail).

---

## Key Features

1. **Feature Flag Support**: Get unified API (`getAllSelfEnteredData`).
2. **Error Handling and Reporting**: Identifies failed domains and provides clear feedback to users using the `MissingRecordsError` component.
3. **PDF Generation**: Produces a standardized report with user details and self-entered health information.
4. **Integration with Redux**: Designed to work seamlessly with the Redux store for managing user profiles and feature flags.

---

## How to Use

### Step 1: Import the Function and Component

Import the `generateSEIPdf` function and `MissingRecordsError` component from the platform:

```javascript
import { generateSEIPdf, MissingRecordsError } from '@department-of-veterans-affairs/mhv/exports';
import { useSelector } from 'react-redux';
```

---

### Step 2: Access the `userProfile` and Feature Flag from Redux

Retrieve the `userProfile` from Redux using `useSelector`:

```javascript
const {
  user: { profile: userProfile },
} = useSelector(state => state);
```

---

### Step 3: Call the Function and Handle Errors

Call the `generateSEIPdf` function and use the `MissingRecordsError` component to display any failed domains.

#### Example Usage:

```javascript
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { generateSEIPdf, MissingRecordsError } from '@department-of-veterans-affairs/mhv/exports';

const GenerateSelfEnteredPdf = () => {
  const {
    user: { profile: userProfile },
  } = useSelector(state => state);

  const [loading, setLoading] = useState(false);
  const [failedDomains, setFailedDomains] = useState([]);
  const [error, setError] = useState(null);

  const handleGeneratePdf = () => {
    setLoading(true);
    generateSEIPdf(userProfile)
      .then(response => {
        setLoading(false);
        if (response.success) {
          setFailedDomains(response.failedDomains);
          alert('PDF generated successfully!');
        } else {
          setError('Failed to generate the PDF');
        }
      })
      .catch(err => {
        setLoading(false);
        setError(err.message);
      });
  };

  return (
    <div>
      <button onClick={handleGeneratePdf} disabled={loading}>
        {loading ? 'Generating PDF...' : 'Generate Self-Entered Information PDF'}
      </button>
      {error && <p>Error: {error}</p>}
      {failedDomains.length > 0 && (
        <MissingRecordsError
          documentType="Self-entered health information report"
          recordTypes={failedDomains}
        />
      )}
    </div>
  );
};

export default GenerateSelfEnteredPdf;
```

---

### Step 4: Returned Response Format

The `generateSEIPdf` function returns a promise that resolves to an object containing:
- `success`: Boolean indicating whether the PDF generation was successful.
- `failedDomains`: Array of human-readable domain names that failed to load.

#### Example Response (Success):

```javascript
{
  success: true,
  failedDomains: ['Allergies', 'Medications']
}
```

#### Example Response (Failure):

```javascript
{
  success: false,
  failedDomains: []
}
```

---

## Additional Notes

1. **Feature Flag**: 
   - The function uses `getAllSelfEnteredData` for unified data fetching.

2. **Error Handling**:
   - The `failedDomains` list identifies domains that failed to load.
   - Use the `MissingRecordsError` component to display these failed domains to users.

3. **PDF Content**:
   - Includes user details such as name and date of birth.
   - Organizes self-entered health information by domain.

4. **Special Domain Handling**:
   - If the "Allergies" domain fails but "Medications" does not, the function ensures "Medications" is marked as failed for clinical relevance.

5. **Redux Integration**:
   - The `userProfile` and feature flag are managed via Redux.

### Required Fields in `userProfile`

The `generateSEIPdf` function requires the following fields from the `userProfile` object:

- `userProfile.userFullName.first`: The user's first name (required)
- `userProfile.userFullName.last`: The user's last name (required)
- `userProfile.userFullName.middle`: The user's middle name (optional)
- `userProfile.userFullName.suffix`: The user's suffix (optional)
- `userProfile.dob`: The user's date of birth (required)
- The user must also have an icn and a correlation id. 
  However, these do not necessarily have to be passed as part of the userProfile object because they are only used at the server level and are pulled directly from the user there. 

---

## Example Use Cases

1. **Medical Records Module**: Allow users to download a PDF report of their self-entered health information for personal use or sharing with healthcare providers.
2. **Error Reporting**: Provide detailed feedback about missing data using the `MissingRecordsError` component.

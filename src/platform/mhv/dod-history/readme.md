# How to Use `generateMilitaryServicePdf` for DOD Military Service PDF Generation

This guide explains how to use the `generateMilitaryServicePdf` utility, which is part of the shared platform-level functionality. This utility allows applications to easily generate PDFs for DOD military service data.

---

## Overview

The `generateMilitaryServicePdf` utility simplifies the process of creating PDFs for military service records. It handles PDF generation and provides a standardized format for the output. The utility also includes error handling and success confirmation.

---

## Key Features

1. **Easy Integration**: Import the utility and use it directly in your application with minimal setup.
2. **Consistent PDF Format**: Ensures uniformity in the structure and content of the generated PDFs.
3. **Promise-Based API**: Provides a simple promise-based interface for handling success and error scenarios.

---

## How to Use

### Step 1: Import the Utility

Import the `generateMilitaryServicePdf` function from the shared exports module:

```javascript
import {
  generateMilitaryServicePdf,
} from '@department-of-veterans-affairs/mhv/exports';
```

### Step 2: Access the `userProfile` from Redux

Retrieve the `userProfile` from the Redux state using `useSelector`:

```javascript
import { useSelector } from 'react-redux';

const {
  user: { profile: userProfile },
} = useSelector(state => state);
```

---

### Step 3: Generate a PDF

Call the `generateMilitaryServicePdf` function with the user's profile data as input. Handle the returned promise to manage loading states, display success messages, or handle errors.

#### Example:

```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import {
  generateMilitaryServicePdf,
} from '@department-of-veterans-affairs/mhv/exports';

const GenerateMilitaryServicePdfExample = () => {
  const {
    user: { profile: userProfile },
  } = useSelector(state => state);

  const handleGeneratePdf = () => {
    // Show loading spinner or indicator
    console.log('Generating PDF...');

    generateMilitaryServicePdf(userProfile)
      .then(response => {
        // Hide loading spinner or indicator
        console.log('PDF generated successfully:', response);

        if (response.success) {
          // Show success message to the user
          alert('Your military service PDF has been generated successfully!');
        } else {
          // Handle error case
          console.error('PDF generation failed:', response.error);
          alert('Failed to generate the military service PDF. Please try again.');
        }
      })
      .catch(error => {
        // Hide loading spinner or indicator
        console.error('Error generating PDF:', error);

        // Show error message to the user
        alert('An unexpected error occurred while generating the PDF.');
      });
  };

  return (
    <>
      <button onClick={handleGeneratePdf}>Generate Military Service PDF</button>
    </>
  );
};

export default GenerateMilitaryServicePdfExample;
```

---

## Returned Response Format

The `generateMilitaryServicePdf` function returns a promise that resolves to an object indicating the success or failure of the PDF generation process.

#### Success Response:

```javascript
{
  success: true,
}
```

#### Error Response:

```javascript
{
  success: false,
  error: [Error Object], // Detailed error information
}
```

---

## Additional Notes

- Ensure that the `userProfile` object contains all required data for generating the PDF.
  - Required fields in `userProfile.userFullName`: `first`, `last` (optional: `middle`, `suffix`)
  - Required field in `userProfile`: `dob`
  - The user must also have an edipi number, which can be found on the user profile, in order to retrieve this report. 
    However, the edipi does not necessarily have to be passed as part of the userProfile object it is only used at the server level and is pulled directly from the user there. 
- The utility internally uses the `makePdf` function to handle PDF creation.
- The generated PDF will be named and formatted consistently for military service records.

---

## Example Use Cases

1. **User Profile Pages**: Allow users to generate a PDF of their military service records directly from their profile page.
2. **Records Downloads**: Enable users to download their military service PDF as part of their personal records.

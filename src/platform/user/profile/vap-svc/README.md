# VA Profile Service (vap-svc) Library

React components and Redux state management for VA Profile Service contact information. This library was extracted from the Profile application to be reusable across multiple VA.gov applications, and handles the complexity of VA Profile Service's **transaction-based data flow**, which differs from traditional REST APIs.

## Supported Contact Information Fields
- Email Address
- Home Phone Number  
- Mobile Phone Number
- Work Phone Number
- Fax Number
- Mailing Address
- Residential Address

## Key Features
- **Transaction Management**: Handles asynchronous updates with polling and status tracking
- **Address Validation**: USPS validation with correction suggestions via modal UI
- **Optimistic Updates**: Shows pending states and reconciles with server responses
- **Error Handling**: Comprehensive error messaging for validation failures, API errors, and deceased veteran cases
- **Edit/View Modes**: Toggle between read-only views and editable forms for each field
- **Accessibility**: WCAG 2.2 AA compliant using VA Design System web components

## Getting Started

The [Profile application](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/applications/personalization/profile) serves as the primary reference implementation. Another example can be found in the Letters app: `src/applications/letters/containers/AddressSection.jsx`.

### Basic Setup

1. **Add the reducer to your Redux store**
   ```javascript
   import vapService from '@@vap-svc/reducers';
   
   export default { vapService, /* ...other reducers */ };
   ```

2. **Import and render components**
   ```javascript
   import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
   import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
   import { FIELD_NAMES } from '@@vap-svc/constants';
   
   <InitializeVAPServiceID>
     <ProfileInformationFieldController fieldName={FIELD_NAMES.EMAIL_ADDRESS} />
   </InitializeVAPServiceID>
   ```

### InitializeVAPServiceID Requirements
**Required** when displaying or editing any VA Profile contact information fields:
- Creates/fetches the user's VA Profile Service ID before rendering contact data
- Handles initialization states: `UNINITIALIZED` → `INITIALIZING` → `INITIALIZED`
- Shows error alert if initialization fails
- Must wrap any components that use VA Profile data

## Common Imports

```javascript
// Components
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

// State management  
import vapService from '@@vap-svc/reducers';
import { selectVAPContactInfoField } from '@@vap-svc/selectors';

// Constants
import { FIELD_NAMES } from '@@vap-svc/constants';
```


## How VA Profile Service Works (Transactions)

Unlike traditional APIs that return updated records immediately, VA Profile Service uses a **transaction-based architecture**. When you send an update request, the API returns a transaction object rather than the updated record.

### Transaction Flow
1. **Submit update** → Get transaction object (not updated data)
2. **Poll** `/v0/profile/status/{transaction_id}` until completion  
3. **Transaction status**: `RECEIVED` → `COMPLETED_SUCCESS`/`COMPLETED_FAILURE`

### Example Transaction Response
```json
{
  "data": {
    "attributes": {
      "transaction_status": "RECEIVED",
      "transaction_id": "786efe0e-fd20-4da2-9019-0c00540dba4d", 
      "type": "AsyncTransaction::Vet360::EmailTransaction"
    }
  }
}
```

**Note**: The `type` field indicates the update category (email, address, or telephone) but doesn't specify which exact field. For addresses, you can't determine if it's mailing vs. residential - this must be tracked by the front-end.

## Redux State Management

### VA Profile Service Reducer (`vapService`)
```javascript
vapService: {
  modal: string,                    // Currently open edit field
  formFields: object,               // Form values and validation errors
  transactions: array,              // Active/pending transactions  
  fieldTransactionMap: object,      // Maps fields to transaction status
  addressValidation: object,        // Address validation state
  hasUnsavedEdits: boolean,        // Unsaved changes flag
}
```

### Key Components
- **`ProfileInformationFieldController`** - Main component for contact fields
- **`InitializeVAPServiceID`** - Required wrapper for VA Profile integration  
- **`AddressValidationModal`** - USPS address validation UI

## Development

### Running Locally
```bash
# Start dev server with Profile app
yarn watch --env entry=profile

# Optional: Mock API
yarn mock-api --responses src/platform/testing/local-dev-mock-api/common.js

# Simulate login (in browser console)
localStorage.setItem('hasSession', true);
```

### Example Applications
- **Primary reference**: [Profile application](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/applications/personalization/profile)  
- **Additional usage**: Letters app (`src/applications/letters/containers/AddressSection.jsx`)

## Testing

```bash
# Unit tests
yarn test:unit src/platform/user/profile/vap-svc/**/*.unit.spec.jsx

# E2E tests (requires dev server running)
yarn watch --env entry=profile  # Terminal 1
yarn cy:run --spec "src/platform/user/profile/vap-svc/tests/e2e/**/*.cypress.spec.js"  # Terminal 2
```

## Troubleshooting

**Transaction stuck pending**: Check Redux DevTools `vapService.transactionsAwaitingUpdate`  
**Address validation not showing**: Verify `addressValidation` state and API response  
**Cannot edit field**: Check for pending transactions or deceased veteran status  
**Reducer not found**: Ensure `vapService` reducer added to Redux store

## Resources
- **API Docs**: [VA Platform API Reference](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/profile/postVet360EmailAddress)
- **Examples**: Profile app, Letters app address section  
- **Import alias**: `@@vap-svc` → `src/platform/user/profile/vap-svc`

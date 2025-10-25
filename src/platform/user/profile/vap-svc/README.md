# VA Profile Service (vap-svc) Library

This library provides React components and Redux state management for interfacing with **VA Profile Service** (also known as vap, vap-svc, vapService, or VAPService). VA Profile Service is a VA backend service that processes contact information updates by synchronizing data across multiple VA data sources.

The library was extracted from the Profile application to be reusable across multiple VA.gov applications. It handles the complexity of VA Profile Service's **transaction-based data flow**, which differs from traditional REST APIs that return updated records immediately.

## Features

### Supported Contact Information Fields
- Email Address
- Home Phone Number
- Mobile Phone Number
- Work Phone Number
- Fax Number
- Mailing Address
- Residential Address

### Core Capabilities
- **Transaction Management**: Handles asynchronous update flows via polling and status tracking
- **Address Validation**: Validates addresses and presents correction suggestions via modal UI
- **Optimistic Updates**: Shows pending states and reconciles with server responses
- **Error Handling**: Comprehensive error messaging for validation failures, API errors, and deceased veteran cases
- **Edit/View Modes**: Toggle between read-only views and editable forms for each field
- **Confirmation Modals**: Cancel confirmation, remove confirmation, and international mobile number warnings
- **Analytics Integration**: Built-in analytics tracking for user interactions
- **Accessibility**: WCAG 2.2 AA compliant components using VA Design System web components

## Getting Started

### Prerequisites
Your application must have a Redux store configured.

### Basic Setup

1. **Add the reducer to your Redux store**
   ```javascript
   import vapService from '@@vap-svc/reducers';
   
   export default {
     // ... your other reducers
     vapService,
   };
   ```

2. **Import and render components**
   ```javascript
   import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
   import { FIELD_NAMES } from '@@vap-svc/constants';
   
   // In your component
   <ProfileInformationFieldController fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS} />
   ```

3. **Initialize VA Profile Service ID** (required)
   ```javascript
   import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';
   
   // Wrap your contact information components
   <InitializeVAPServiceID>
     <YourContactInfoComponents />
   </InitializeVAPServiceID>
   ```

   **When to use `InitializeVAPServiceID`:**
   - **Required** when displaying or editing any VA Profile contact information fields
   - Wraps components that use `ProfileInformationFieldController` or any vap-svc containers
   - Ensures the user has a VA Profile Service ID before attempting to display/edit contact data
   - Handles three initialization states:
     - **UNINITIALIZED**: Creates a VA Profile Service ID for the user via POST request
     - **INITIALIZING**: Shows pending state while initialization completes
     - **INITIALIZED**: Fetches existing transactions and renders child components
     - **INITIALIZATION_FAILURE**: Shows error alert if initialization fails
   
   **Do NOT use if:**
   - Only displaying read-only contact info that's already in the Redux store
   - Working with non-VA-Profile data (authentication, MHV, etc.)

> **Note:** The `@@vap-svc` import alias is configured in `babel.config.json` and resolves to `src/platform/user/profile/vap-svc`.

### Example Usage
The [Profile application](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/applications/personalization/profile) serves as the primary reference implementation.

Additional example: The `letters` application uses the `MailingAddress` component in `src/applications/letters/containers/AddressSection.jsx`.

### Common Import Patterns

```javascript
// Reducers
import vapService from '@@vap-svc/reducers';

// Actions
import { openModal } from '@@vap-svc/actions';
import { clearMostRecentlySavedField } from '@@vap-svc/actions/transactions';

// Components
import ProfileInformationFieldController from '@@vap-svc/components/ProfileInformationFieldController';
import AddressView from '@@vap-svc/components/AddressField/AddressView';

// Containers
import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

// Constants
import { FIELD_IDS, FIELD_NAMES } from '@@vap-svc/constants';

// Selectors
import { selectVAPContactInfoField } from '@@vap-svc/selectors';

// Utils
import { recordCustomProfileEvent } from '@@vap-svc/util/analytics';
import { formatAddressTitle } from '@@vap-svc/util/contact-information/addressUtils';
```


## Architecture Overview

### Directory Structure
```
vap-svc/
├── actions/               # Redux action creators
│   ├── index.js          # Main exports
│   ├── personalInformation.js  # Contact info update actions
│   ├── transactions.js   # Transaction lifecycle actions
│   └── ui.js            # UI state actions (modals, edit mode)
├── components/           # Presentational components
│   ├── ContactInfoForm.jsx
│   ├── ProfileInformationView.jsx
│   ├── ProfileInformationEditView.jsx
│   ├── ResidentialAddress.jsx
│   ├── AddressField/    # Address-specific components
│   ├── base/            # Base/reusable components
│   └── ContactInformationFieldInfo/  # Modals and alerts
├── containers/           # Redux-connected containers
│   ├── VAPServiceProfileField.jsx
│   ├── AddressValidationModal.jsx
│   ├── VAPServiceTransactionReporter.jsx
│   └── ...
├── reducers/
│   └── index.js         # Main reducer
├── util/                # Helper utilities
│   ├── transactions.js  # Transaction helpers
│   ├── analytics.js     # Analytics tracking
│   ├── id-factory.js    # Unique ID generation
│   └── contact-information/  # Field-specific utilities
├── constants/           # Constants and lookup data
│   ├── index.js
│   ├── addressValidationMessages.js
│   └── countries.json
└── tests/              # Unit and E2E tests
```

### Component Architecture
- **Presentational Components** (`components/`): Pure UI components that receive props and render views
- **Container Components** (`containers/`): Redux-connected components that:
  - Read state via selectors
  - Dispatch actions
  - Pass data to presentational components
- **Selectors** (`selectors.js`): Derive computed values from the Redux store
  - Field editability
  - Pending transaction status
  - Validation messages
  - Current field values

## Redux State Management

### State Shape (`vapService` slice)
The reducer maintains the following state structure:

```javascript
vapService: {
  modal: string,                    // Currently open modal/edit field
  initialFormFields: object,        // Original values before editing
  formFields: object,               // Current form values and validation errors
  transactions: array,              // Active/pending transactions
  fieldTransactionMap: object,      // Maps fields to their transactions
  transactionsAwaitingUpdate: array, // Transaction IDs being polled
  metadata: object,                 // Transaction metadata (e.g., mostRecentErroredTransactionId)
  hasUnsavedEdits: boolean,        // Unsaved changes flag
  addressValidation: object,        // Address validation state
}
```

#### Key State Properties

**`modal`**
- String indicating which field is currently being edited (e.g., `'mailingAddress'`, `'emailAddress'`)

**`initialFormFields`**
- Snapshot of field values when edit mode is entered
- Empty object if no contact information exists yet
- Set via `UPDATE_PROFILE_FORM_FIELD` action

**`formFields`**
- Current form input values
- Validation errors for each field
- Used to manage UI state during editing

**`transactions`**
- Array of transaction objects
- Contains pending (`RECEIVED`) or rejected transactions
- Successful transactions are removed after profile refresh
- Populated via `fetchTransactions` action

**`fieldTransactionMap`**
- Maps field names to transaction status
- Structure: `{ [fieldName]: { isPending, isFailed, error, transactionId } }`
- Example: `fieldTransactionMap.mailingAddress.isPending === true`
- Handles cases where transaction type doesn't specify exact field (e.g., address type)

**`transactionsAwaitingUpdate`**
- Array of transaction IDs currently being polled
- Prevents duplicate concurrent polling requests

**`metadata`**
- Stores `mostRecentErroredTransactionId`
- Used for error message rendering (transactions lack timestamps)

**`addressValidation`**
- Set when `validateAddress` thunk is triggered
- Controls address validation modal display
- Contains suggested addresses or validation errors

### Action Creators

#### Personal Information Actions (`actions/personalInformation.js`)
- Update contact information fields
- Handle success/failure responses
- Trigger optimistic updates

#### Transaction Actions (`actions/transactions.js`)
- Create transaction records
- Poll transaction status
- Update transaction state (pending → success/failure)
- Remove completed transactions

#### UI Actions (`actions/ui.js`)
- Open/close edit modals
- Toggle field edit mode
- Show/hide confirmation modals
- Manage form state

### Selectors (`selectors.js`)
Provide derived state for components:
- `selectField(state, fieldName)` - Get current field value
- `selectEditedField(state, fieldName)` - Get edited but unsaved value
- `selectIsEditing(state, fieldName)` - Check if field is in edit mode
- `selectHasPendingTransaction(state, fieldName)` - Check pending status
- `selectFieldErrors(state, fieldName)` - Get validation errors
- Additional selectors for address validation, transaction status, etc.

## Data Flow

### Typical Update Flow

1. **User initiates edit**
   - Component dispatches UI action to open edit modal/view
   - `initialFormFields` captures current values
   - Form renders with editable inputs

2. **User modifies data and submits**
   - Component dispatches personal information action (e.g., `updateMailingAddress`)
   - Action creator (thunk):
     - Creates transaction object via `util/transactions.js`
     - Dispatches action to add transaction to state (sets `isPending: true`)
     - Makes API call to VA Profile Service

3. **VA Profile Service responds**
   - Returns transaction object (not the updated record)
   - Transaction includes `transaction_id` and `transaction_status: 'RECEIVED'`
   - Front-end begins polling for status updates

4. **Polling for completion**
   - Action polls `/v0/profile/status/{transaction_id}`
   - Checks `transaction_status` field:
     - `RECEIVED` - Still processing, continue polling
     - `COMPLETED_SUCCESS` - Update succeeded
     - `COMPLETED_FAILURE` - Update rejected with errors

5. **Success path**
   - Dispatch success action
   - Update `personalInformation` in state
   - Remove transaction from pending list
   - Show success alert
   - Close edit modal/view

6. **Failure path**
   - Dispatch failure action
   - Update transaction with error details
   - Show error banner/modal via `VAPServiceEditModalErrorMessage`
   - Allow user to retry or cancel


## Transactions

VA Profile Service uses a **transaction-based architecture** instead of traditional synchronous REST responses. When you send an update request (`PUT` or `POST`), the API returns a transaction object rather than the updated record.

### Transaction Object Example
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

### Transaction Lifecycle

**Transaction Status Values:**
- `RECEIVED` - VA Profile Service has queued the update but hasn't finished processing
- `COMPLETED_SUCCESS` - Update completed successfully
- `COMPLETED_FAILURE` - Update was rejected (includes error metadata)

**Status Polling:**
The front-end polls `/v0/profile/status/{transaction_id}` until the status changes from `RECEIVED` to a completed state.

**Transaction Type Limitations:**
The `type` field indicates the update category (email, address, or telephone) but doesn't specify which exact field. For example:
- Address transactions don't distinguish between mailing vs. residential address
- The front-end must track this information in memory via `fieldTransactionMap`

**Historical Note:**
API responses still reference "vet360" (the legacy name for VA Profile Service) in transaction types.

### Transaction Utilities (`util/transactions.js`)
Helper functions for:
- Creating normalized transaction objects
- Generating unique transaction IDs
- Determining transaction field types
- Checking transaction completion status

## Address Validation

The library includes comprehensive address validation functionality via the USPS address validation service.

### Validation Flow

1. **User submits address**
   - Component dispatches `validateAddress` action
   - State sets `addressValidation` to initial validation state

2. **API validates address**
   - Returns suggested corrections or confirms address
   - May return validation errors

3. **Validation modal displays**
   - Shows original address vs. suggested address(es)
   - Logic in `src/platform/user/profile/vap-svc/util/index.js` determines whether to show modal
   - User can:
     - Accept suggested address
     - Use original address anyway
     - Edit address again

4. **User confirms choice**
   - Selected address is submitted as transaction
   - Normal transaction flow proceeds

### Address Validation Components
- **`AddressValidationModal`** - Main modal container
- **`AddressValidationView`** - Displays address comparison
- **`addressValidationMessages.js`** - User-facing validation messages

## Error Handling

### Error Types

**Transaction Errors (Async)**
Most errors occur during transaction processing and are returned via status polling:
- Validation failures (invalid data format)
- Business rule violations
- Backend system errors
- Metadata includes error codes and messages

**Direct Errors (Synchronous)**
Some errors are returned immediately without creating a transaction:
1. **Invalid address** - Address failed validation and cannot be processed
2. **Deceased veteran** - Profile updates are blocked for deceased veterans

### Error Display Components
- **`VAPServiceEditModalErrorMessage`** - Shows error in edit modal
- **`VAPServiceTransactionErrorBanner`** - Banner for transaction errors
- **`GenericErrorAlert`** - General error messaging

### Error Recovery
- Users can retry failed transactions
- Edit modal remains open with error context
- Form values are preserved for correction

## Key Components

### Contact Information Components
- **`ContactInfoForm`** - Generic form for contact fields
- **`ProfileInformationView`** - Read-only display of field
- **`ProfileInformationEditView`** - Edit mode for field (class component)
- **`ProfileInformationEditViewFc`** - Edit mode (functional component)
- **`ProfileInformationFieldController`** - Orchestrates view/edit switching

### Address Components
- **`ResidentialAddress`** - Standalone residential address component
- **`AddressField/AddressField.jsx`** - Address input fields
- **`AddressField/AddressView.jsx`** - Address display view
- **`CopyMailingAddress`** - Utility to copy mailing address to residential

### Transaction Status Components
- **`VAPServiceTransaction`** - Displays single transaction status
- **`VAPServiceTransactionPending`** - Pending transaction indicator
- **`VAPServiceTransactionReporter`** - Reports transaction status changes

### Modal Components
- **`ConfirmCancelModal`** - Confirms user wants to cancel edits
- **`ConfirmRemoveModal`** - Confirms user wants to remove a field value
- **`IntlMobileConfirmModal`** - Warning for international mobile numbers
- **`CannotEditModal`** - Explains why a field cannot be edited
- **`ContactInformationUpdateSuccessAlert`** - Success confirmation

### Supporting Components
- **`InitializeVAPServiceID`** - Critical initialization wrapper component
  - **Purpose**: Ensures user has a VA Profile Service ID before rendering contact info components
  - **What it does**:
    - Checks if user is already initialized in VA Profile Service
    - If not initialized: Creates VA Profile Service ID via POST to `/v0/profile/initialize_vet360_id`
    - If initialized: Fetches all pending/active transactions for the user
    - Shows loading state during initialization
    - Shows error alert if initialization fails
  - **Usage**: Must wrap any components that display or edit VA Profile contact information
  - **Example use cases**:
    - Contact information sections in Profile app
    - Personal information pages
    - Any form that allows editing phone, email, or address fields
  - **Returns**: Renders children only when initialization is complete and successful
- **`VAPServicePendingTransactionCategory`** - Groups pending transactions by type
- **`ProfileInformationActionButtons`** - Save/Cancel/Remove buttons
- **`OtherTextField`** - Custom text field for "other" phone types

## Utilities

### Analytics (`util/analytics.js`)
Tracks user interactions:
- Edit initiated
- Save successful
- Validation events
- Error occurrences

### ID Factory (`util/id-factory.js`)
Generates unique IDs for:
- Transactions
- Form fields
- Components

### Field Attributes (`util/getProfileInfoFieldAttributes.js`)
Returns metadata for each field:
- Display labels
- Validation rules
- Editability flags
- Field types

### Local Development (`util/local-vapsvc.js`)
Mock VA Profile Service for local development:
- Simulates transaction responses
- Configurable success/failure scenarios
- No backend required

## Testing

### Unit Tests (`tests/`)
- **`tests/actions/`** - Action creator tests
- **`tests/components/`** - Component rendering and behavior tests
- **`tests/containers/`** - Container integration tests
- **`tests/reducers/`** - Reducer state transition tests
- **`tests/util/`** - Utility function tests
- **`tests/selectors.unit.spec.jsx`** - Selector computation tests

Run unit tests:
```bash
yarn test:unit src/platform/user/profile/vap-svc/**/*.unit.spec.js
```

### E2E Tests (`tests/e2e/`)
Cypress tests covering full user flows:
- Address validation workflow
- Transaction pending states
- Error scenarios
- Modal interactions

Run E2E tests:
```bash
# Start dev server first
yarn watch --env entry=profile

# In another terminal
yarn cy:run --spec "src/platform/user/profile/vap-svc/tests/e2e/**/*.cypress.spec.js"
```

### Test Fixtures (`tests/fixtures/`)
Mock data for tests:
- Sample transaction responses
- User profile data
- Error responses

## Development

### Running the Library Locally

1. **Start the dev server**
   ```bash
   yarn watch --env entry=profile
   ```
   The Profile application provides the best development environment for testing vap-svc features.

2. **Mock API (optional)**
   ```bash
   yarn mock-api --responses src/platform/testing/local-dev-mock-api/common.js
   ```

3. **Simulate login**
   Open browser console and run:
   ```javascript
   localStorage.setItem('hasSession', true);
   ```

### Common Development Tasks

**Add a new contact field:**
1. Add field to constants
2. Create action creators in `actions/personalInformation.js`
3. Update reducer to handle new field
4. Create/update selectors
5. Build UI components
6. Add validation logic
7. Write tests

**Modify transaction handling:**
1. Update transaction utilities in `util/transactions.js`
2. Adjust polling logic in action creators
3. Update reducer transaction state handling
4. Test edge cases (retry, timeout, error recovery)

**Update address validation:**
1. Modify validation logic in `util/index.js`
2. Update address validation messages in `constants/addressValidationMessages.js`
3. Adjust modal behavior in `AddressValidationModal`
4. Test validation scenarios

### Debugging Tips

**View Redux state:**
Use Redux DevTools to inspect the `vapService` slice

**Monitor transaction polling:**
Check Network tab for `/v0/profile/status/{id}` requests

**Test error scenarios:**
Use `local-vapsvc.js` to simulate failures

**Address validation issues:**
Set breakpoints in `util/index.js` validation logic

## API Documentation

For detailed API specifications, see:
- [VA Platform API Reference - Profile](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/profile/postVet360EmailAddress)

## Troubleshooting

### Common Issues

**"Transaction stuck in pending state"**
- Check transaction polling in Redux DevTools
- Verify API connectivity
- Check `transactionsAwaitingUpdate` for duplicates

**"Address validation modal not appearing"**
- Verify validation logic in `util/index.js`
- Check `addressValidation` state
- Ensure API returned validation suggestions

**"Cannot edit field"**
- Check if transaction is already pending for that field
- Verify field is not locked (deceased veteran, etc.)
- Inspect `fieldTransactionMap` in state

**"Reducer not found"**
- Ensure `vapService` reducer is added to Redux store
- Check reducer import path
- Verify reducer is exported correctly

### Getting Help
- Review the Profile application implementation
- Check existing tests for usage examples
- Search for similar field implementations in the codebase


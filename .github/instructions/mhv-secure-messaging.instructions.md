---
applyTo: "src/applications/mhv-secure-messaging/**"
---

# MHV Secure Messaging Application Instructions

## 🔄 Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the mhv-secure-messaging application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants**: New paths, error messages, alerts, or configuration in `util/constants.js`
- **Create new helper functions**: New utilities in `util/helpers.js` or other utility files
- **Implement new business rules**: Changes to 45-day rule, signature requirements, validation logic, etc.
- **Add new action types or actions**: New Redux actions in `util/actionTypes.js` or `actions/` directory
- **Create new reducers or modify state shape**: Changes to Redux state structure
- **Add new shared components**: New reusable components in `components/shared/`
- **Implement new feature flags**: New feature toggles that affect application behavior
- **Add new API endpoints**: New functions in `api/SmApi.js`
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new error codes**: New backend error codes and their handling
- **Modify component patterns**: New web component usage patterns or validation approaches
- **Update navigation structure**: New routes or path handling

### How to Update These Instructions
1. **Locate the relevant section**: Find the section that relates to your change (e.g., Constants, Helper Functions, Business Logic)
2. **Add or update documentation**: Include function signatures, parameters, return types, and usage examples
3. **Update examples**: Ensure code examples reflect the new patterns
4. **Mark critical items**: Use **CRITICAL** marker for security-sensitive or business-critical information
5. **Update anti-patterns**: Add new "what NOT to do" items if relevant
6. **Keep it concise**: Focus on practical guidance that helps future development

### Documentation Standards
- Use clear, concise language
- Include code examples for complex patterns
- Document the "why" behind business rules
- Link related concepts (e.g., "see Helper Functions section")
- Use consistent formatting (bullet points, code blocks, headers)
- Mark breaking changes or deprecations clearly

## Application Overview
- **Entry Name**: `mhv-secure-messaging`
- **Root URL**: `/my-health/secure-messages`
- **Entry File**: `app-entry.jsx`
- **Purpose**: Secure messaging between veterans and VA healthcare teams

## Architecture & State Management

### Redux Structure
- **Root reducer**: Combined reducer at `reducers/index.js` under `sm` namespace
- **Reducer modules**: `alerts`, `recipients`, `breadcrumbs`, `categories`, `facilities`, `folders`, `search`, `threads`, `threadDetails`, `triageTeams`, `preferences`, `prescription`
- **Action types**: Centralized in `util/actionTypes.js` under `Actions` object with nested namespaces (e.g., `Actions.Message.GET`, `Actions.Draft.CREATE_DRAFT`)
- **Selectors**: Defined in `selectors.js` for accessing Redux state (e.g., `folder`, `selectSignature`, `populatedDraft`)
- **State access pattern**: Always use `state.sm.<reducer>` to access secure messaging state

### API Layer
- **Backend Service**: This application uses API services provided by **vets-api**
  - Backend controller: `SMController` in vets-api
  - Reference: https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/my_health/app/controllers/my_health/sm_controller.rb
  - The backend handles message storage, retrieval, validation, and secure communication with VA systems
  - **Note**: `vets-api` passes through requests to the MHV SM Patient API: https://github.com/department-of-veterans-affairs/mhv-sm-patient-api
- **API client**: `api/SmApi.js` for secure messaging endpoints
- **Base path**: Uses `${environment.API_URL}/my_health/v1`
- **API utilities**: Uses `apiRequest` from `@department-of-veterans-affairs/platform-utilities/exports`
- **Mock responses**: Located in `api/mocks/` directory, configured via `src/platform/mhv/api/mocks/index.js`
- **API patterns**:
  - All API functions return promises
  - Use async/await in action creators
  - Handle errors with try/catch and dispatch error actions

## Constants & Configuration

### Core Constants (`util/constants.js`)
- **Paths**: Route paths defined in `Paths` object (e.g., `Paths.INBOX`, `Paths.COMPOSE`, `Paths.DRAFT`)
  - Always use `Paths` constants instead of hardcoded strings for routing
  - Paths include trailing slashes where appropriate
- **DefaultFolders**: Folder IDs and metadata (Inbox=0, Sent=-1, Drafts=-2, Trash=-3)
  - Negative IDs for system folders, positive for custom folders
  - Access via `DefaultFolders.INBOX.id`, `DefaultFolders.SENT.header`, etc.
- **ErrorMessages**: Structured error message strings organized by component/feature
  - Use dot notation: `ErrorMessages.ComposeForm.RECIPIENT_REQUIRED`
  - Navigation-specific errors in `ErrorMessages.Navigation`
  - Attachment errors in `ErrorMessages.ComposeForm.ATTACHMENTS`
- **Categories**: Message categories for healthcare topics (Appointments, Medications, Test Results, etc.)
- **Alerts**: Alert configurations and messaging in `Alerts` object
  - Organized by domain: `Alerts.Message`, `Alerts.Folder`, `Alerts.Thread`
  - Use for success/error feedback after actions
- **ElectronicSignatureBox**: Electronic signature validation and display constants
  - Contains title, description, labels, and legal note text
- **threadSortingOptions**: Thread sorting configurations with label, sortField, sortOrder
- **draftAutoSaveTimeout**: Set to 10000ms (10 seconds) - use this constant, never hardcode timeout values
- **Attachments**: File size limits and max file counts
  - `MAX_FILE_SIZE`: 6MB, `MAX_FILE_SIZE_LARGE`: 25MB
  - `MAX_FILE_COUNT`: 4, `MAX_FILE_COUNT_LARGE`: 10
  - `TOTAL_MAX_FILE_SIZE`: 10MB, `TOTAL_MAX_FILE_SIZE_LARGE`: 25MB
- **acceptedFileTypes** and **acceptedFileTypesExtended**: Define allowed file types with MIME types
- **RecipientStatus**: BLOCKED, ALLOWED, NOT_ASSOCIATED - for recipient state management
- **Errors.Code**: Error codes for specific error handling (BLOCKED_USER: 'SM119', ATTACHMENT_SCAN_FAIL: 'SM172', etc.)
- **RxRenewalText**: Constants for medication renewal request flow
  - `LOCKED_CATEGORY_DISPLAY`: Text shown in locked category display ("Medication renewal request")
- **MessageHintText**: Hint text for form fields
  - `RX_RENEWAL_SUCCESS`: Hint when prescription loaded successfully
  - `RX_RENEWAL_ERROR`: Hint when prescription failed to load

### Helper Functions (`util/helpers.js`)
- **Date formatting**:
  - `dateFormat(timestamp, format)`: Formats dates with timezone awareness (default: 'MMMM D, YYYY, h:mm a z')
  - `threadsDateFormat(timestamp, format)`: For thread lists (default: 'MMMM D, YYYY [at] h:mm a z')
  - Always use these for consistent date display across app
- **Navigation**:
  - `navigateToFolderByFolderId(folderId, history)`: Navigate to folder by ID
  - `folderPathByFolderId(folderId)`: Convert folder ID to path string
  - Switch statement handles system folders, default for custom folders
- **Message utilities**:
  - `isOlderThan(timestamp, days)`: Check if timestamp exceeds days (returns boolean)
  - `getLastSentMessage(messages)`: Find most recent sent message in array
  - `decodeHtmlEntities(str)`: **CRITICAL** - Always decode HTML entities using DOMParser + DOMPurify before displaying message text
- **Recipient utilities**:
  - `sortRecipients(recipientsList)`: Alphabetize recipients, non-alphabetic chars sorted last
  - `messageSignatureFormatter()`: Format signature for message body
- **URL/text utilities**:
  - `httpRegex`: Regex for HTTP/HTTPS/FTP URLs
  - `urlRegex`: Regex for domain patterns
- **Thread utilities**:
  - `updateMessageInThread(thread, response)`: Update specific message in thread with new data
  - Preserves fields not returned in response (threadId, folderId, draftDate, etc.)
- **Page utilities**:
  - `handleHeader(folder)`: Generate folder header info and data-dog tracking attributes
  - `getPageTitle({ folderName, pathname })`: Generate page titles with proper format

## Business Logic & Requirements

### 45-Day Reply Restriction
- **Rule**: Users cannot reply to messages where the last sent message is more than 45 days old
- **Implementation**:
  - Use `isOlderThan(lastSentDate, 45)` to check eligibility
  - `getLastSentMessage()` finds the most recent sent message in thread
  - Set `cannotReply` flag in thread state when retrieving threads
  - Display `Alerts.Message.CANNOT_REPLY_BODY` when restriction applies
  - Different messaging for VistA vs OH (Oracle Health) messages
- **UI Impact**:
  - Reply button disabled or hidden
  - Info alert displayed explaining restriction
  - Directs users to start new message or contact facility

### Electronic Signature Requirements
- **Rule**: Some recipients require electronic signatures (Privacy Issue, Release of Information, Medical Records teams)
- **Detection**: Regex pattern in `actions/recipients.js` checks recipient name:
  ```javascript
  /.*[\s_]*(Privacy Issue|Privacy Issues|Release of Information Medical Records|Record Amendment)[\s_]*Admin|.*[\s_]*Release[\s_]*of[\s_]*Information/i
  ```
- **Implementation**:
  - `signatureRequired` flag set on recipient object
  - When recipient changes, check `isSignatureRequired` state
  - Show/hide `ElectronicSignature` component dynamically
  - Display alert when signature requirement changes
- **Validation**:
  - Required: full name in signature field
  - Required: checkbox certifying information accuracy
  - Validation: alphabetic characters only in signature field
  - Use `validateNameSymbols()` from `platform/forms-system`
- **Signature Format**:
  ```
  --------------------------------------------------

  [Full Name]
  Signed electronically on [Date].
  ```
- **Draft Restrictions**:
  - **CRITICAL**: Electronic signatures cannot be saved in drafts
  - Show warning modal before saving draft with signature
  - Strip signature before saving draft
  - User must re-enter signature when resuming draft

### Draft Auto-Save Logic
- **Trigger**: Debounced after `draftAutoSaveTimeout` (10 seconds) of no typing
- **Implementation**: Use `useDebounce` hook from `hooks/use-debounce.js`
- **Save Actions**:
  - New draft: `createDraft()` in `api/SmApi.js`
  - Update draft: `updateDraft(draftMessageId, message)` in `api/SmApi.js`
  - Reply draft: `createReplyDraft(replyToId, message)` or `updateReplyDraft()`
- **Draft State Management**:
  - Use `draftInProgress` in `threadDetails` reducer for unsaved changes
  - Track `savedDraft` flag to show "Draft saved" indicator
  - Use `saveError` to handle save failures
- **Restrictions**:
  - Cannot save attachments in drafts - show warning modal
  - Cannot save signatures in drafts - show warning modal
  - Must decode HTML entities before saving: `decodeHtmlEntities(messageData.body)`
- **Navigation Guards**:
  - Detect unsaved changes when navigating away
  - Show modal with options: save draft, delete draft, or continue editing
  - Different modals for different scenarios (new draft, existing draft, draft with attachments/signature)

### Attachment Handling
- **File Type Validation**:
  - Standard types: DOC, DOCX, GIF, JPG, JPEG, PDF, PNG, RTF, TXT, XLS, XLSX, JFIF, PJPEG, PJP
  - Extended types (with feature flag): Add BMP, TIFF, PPT, PPTX, ODT, MP4, MOV, WMV, MPG
  - Use `acceptedFileTypes` or `acceptedFileTypesExtended` constants
  - Show appropriate error: `ErrorMessages.ComposeForm.ATTACHMENTS.INVALID_FILE_TYPE`
- **Size Validation**:
  - Individual file: 6MB default, 25MB with large upload flag
  - Total all files: 10MB default, 25MB with large upload flag
  - Empty files rejected
  - Show appropriate error messages from `ErrorMessages.ComposeForm.ATTACHMENTS`
- **Duplicate Detection**: Check file name + size to prevent duplicate attachments
- **Virus Scanning**:
  - Backend scans attachments after upload
  - Error code 'SM172' indicates scan failure
  - Show `Alerts.Message.ATTACHMENT_SCAN_FAIL` or `MULTIPLE_ATTACHMENTS_SCAN_FAIL`
  - User must remove flagged attachments to send message
- **Draft Behavior**:
  - **CRITICAL**: Attachments are NOT saved with drafts
  - Warn user before saving: "If you save this message as a draft, you'll need to attach your files again"
  - Use `ErrorMessages.ComposeForm.UNABLE_TO_SAVE_DRAFT_ATTACHMENT` modal
- **Display**: Use `AttachmentsList` component to render attachments with remove buttons

### Recipient Management
- **Types**:
  - Triage teams (care teams)
  - Health care facilities
- **Status Types**:
  - `ALLOWED`: Can send messages
  - `BLOCKED`: Blocked from messaging (errors 'SM119', 'SM151')
  - `NOT_ASSOCIATED`: No longer associated with team ('SM129')
- **Blocked Recipients**:
  - Show `BlockedTriageGroupAlert` component
  - Different alert styles: INFO, WARNING, ALERT (from `BlockedTriageAlertStyles`)
  - Messages vary by scenario: all teams blocked, multiple teams blocked, facility blocked
  - Error handling in `sendMessage()` and `sendReply()` actions
- **Recent Recipients**:
  - Track last 6 months of sent messages
  - Use `getRecentRecipients()` to fetch from Sent folder
  - Display on recent care teams page for quick access
  - Store in `recipients` reducer state
- **Contact List**:
  - Users can curate preferred recipients
  - Update via `updateTriageTeamRecipients()` action
  - Validation: Minimum 1 team must be selected
  - Show success/error alerts after save
- **Sorting**: Always use `sortRecipients()` to alphabetize recipient lists
- **System Association**:
  - Recipients associated with VHA facility (stationNumber)
  - Resolve facility name via `getVamcSystemNameFromVhaId()` from drupal static data
  - Store `healthCareSystemName` with recipient data

### Folder Operations
- **System Folders**: Cannot be renamed or deleted (Inbox, Sent, Drafts, Trash)
- **Custom Folders**:
  - Users can create with custom names
  - Validation rules:
    - Cannot be blank
    - Letters, numbers, spaces only
    - Name must be unique
  - Can be renamed with same validation rules
  - Can be deleted ONLY if empty
  - Show error modal if attempting to delete non-empty folder
- **Folder IDs**:
  - System folders: Inbox (0), Sent (-1), Drafts (-2), Trash (-3)
  - Custom folders: Positive integers assigned by backend
- **Moving Messages**:
  - Use `moveMessageThread(threadId, folderId)` action
  - Updates thread location in backend
  - Refresh thread list after move
  - Show success alert: `Alerts.Message.MOVE_MESSAGE_THREAD_SUCCESS`
- **Navigation**:
  - Always use `folderPathByFolderId()` to generate paths
  - Use `navigateToFolderByFolderId(folderId, history)` for programmatic navigation
  - Breadcrumbs update based on current folder

### Message Thread Behavior
- **Thread Composition**:
  - Array of messages with same `threadId`
  - Can contain both sent messages and drafts
  - Sorted by date (sent messages by `sentDate`, drafts by `draftDate`)
- **Loading Thread**:
  - Use `retrieveMessageThread(messageId)` action
  - Fetches full thread with full body text, attachments, drafts
  - Decodes HTML entities for all message bodies
  - Sets `cannotReply` flag based on 45-day rule
  - Determines `replyToName` for thread header
- **Reply Draft Handling**:
  - Multiple drafts can exist in same thread
  - Each draft has unique `messageId`
  - Use `createReplyDraft()` or `updateReplyDraft()` for reply drafts
  - Different endpoint than standalone drafts
- **Message Metadata**:
  - `messageId`: Unique identifier
  - `threadId`: Links messages in conversation
  - `folderId`: Current folder location
  - `sentDate`: When message was sent (null for drafts)
  - `draftDate`: When draft was created/updated (null for sent messages)
  - `recipientName`, `senderName`, `triageGroupName`: Participant info
  - `readReceipt`: Timestamp when message was read
  - `category`: Healthcare category
  - `subject`: Message subject line
  - `body`: Message content (must decode HTML entities)
  - `hasAttachments`: Boolean flag
  - `attachments`: Array of attachment objects with download links

### Search Functionality
- **Search Types**:
  - Basic search: Keyword only
  - Advanced search: Keyword + folder + date range + sender/recipient filters
- **Validation**:
  - At least one field required (keyword, folder, date range)
  - Start date must be before or equal to end date
  - End date cannot be in future
  - Show appropriate errors from `ErrorMessages.SearchForm`
- **Results**:
  - Display in thread list format
  - Pagination supported (10 threads per page)
  - Sorting options available
  - Can move or delete from search results
- **Implementation**:
  - Use `runBasicSearch()` or `runAdvancedSearch()` actions
  - Results stored in `search` reducer
  - API: `searchFolderBasic()` or `searchFolderAdvanced()` in `SmApi.js`

### RX Renewal / Medication Integration
- **Purpose**: Veterans can request medication renewals via Secure Messaging from the Medications app
- **Entry Point**: URL with query params: `/my-health/secure-messages/new-message?prescriptionId={id}&redirectPath={path}`
- **Detection Logic**:
  ```javascript
  const isRxRenewalDraft = renewalPrescription?.prescriptionId || rxError;
  ```
- **State Management**:
  - Reducer: `prescription` at `state.sm.prescription`
  - State shape: `{ renewalPrescription, redirectPath, error, isLoading }`
  - Actions: `getPrescriptionById()`, `clearPrescription()`, `setRedirectPath()`
  - Action types: `Actions.Prescriptions.*` (GET_PRESCRIPTION_BY_ID, CLEAR_PRESCRIPTION, etc.)
- **API Client**:
  - File: `api/RxApi.js` - separate from `SmApi.js` for Medications integration
  - Endpoint: `GET /my_health/v1/prescriptions/{prescriptionId}`
  - Returns prescription attributes for message body population
- **Locked Category Behavior**:
  - When `isRxRenewalDraft` is true, category dropdown is replaced with `LockedCategoryDisplay` component
  - Category is locked to "Medications" - users cannot change it
  - Display text: `RxRenewalText.LOCKED_CATEGORY_DISPLAY` ("Medication renewal request")
- **Message Body Auto-Population**:
  - Use `buildRxRenewalMessageBody(prescription)` helper from `util/helpers.js`
  - Populates: medication name, prescription number, instructions, provider, refills left, expiration date, reason for use, quantity
- **Constants**:
  - `RxRenewalText.LOCKED_CATEGORY_DISPLAY`: Display text for locked category
  - `MessageHintText.RX_RENEWAL_SUCCESS`: Hint text when prescription loads successfully
  - `MessageHintText.RX_RENEWAL_ERROR`: Hint text when prescription fails to load
- **Error Handling**:
  - 404 errors: Prescription not found - show warning, allow manual entry
  - Non-VA medications: Missing required fields - show warning, allow manual entry
  - Errors logged to Datadog with `dataDogLogger()` including prescriptionId context
- **Redirect After Send**:
  - Store `redirectPath` in prescription state
  - After successful send, redirect to `redirectPath` (typically back to Medications)
  - Append `?rxRenewalMessageSuccess=true` query param for success messaging

## Component Patterns

### React Router + VADS Link Integration
- **Router-Integrated Link Components**: Use wrappers for internal navigation with React Router
  - `RouterLink`: Standard link styling for internal navigation
    - Wraps `VaLink` with React Router integration
    - Use for standard internal navigation that doesn't need high prominence
    - Props: `href` (required), `text` (required), `active` (optional, default false), `label`, `reverse`
    - Example: `<RouterLink href="/inbox" text="View messages" />`
  - `RouterLinkAction`: Action link styling for primary CTAs
    - Wraps `VaLinkAction` with React Router integration
    - Use for primary calls to action, service entry points, and high-visibility links
    - Props: `href` (required), `text` (required), `label`, `reverse`
    - Example: `<RouterLinkAction href="/compose" text="Start a new message" />`
  - **Pattern Details**:
    - Both use `useHistory` hook from `react-router-dom` for navigation
    - Both implement `preventDefault` + `history.push(href)` for client-side navigation
    - Includes safety fallback to `window.location.href` if used outside Router context
    - Located in `components/shared/`
    - See VADS docs: https://design.va.gov/components/link/
  - **Testing Pattern for RouterLink/RouterLinkAction**:
    - Validate actual navigation by checking `history.location.pathname` after click
    - Don't just test `preventDefault` - verify redirect actually happens
    - Example test:
      ```javascript
      const { container, history } = renderWithStoreAndRouter(
        <RouterLink href="/inbox" text="Go to inbox" />,
        { initialState, reducers: reducer, path: '/messages' }
      );
      const link = container.querySelector('va-link');
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(history.location.pathname).to.equal('/inbox');
      ```
- **Cross-App Links** (Different VA.gov SPAs): Use `VaLink`/`VaLinkAction` directly WITHOUT router wrapper
  - For links to other VA.gov applications (e.g., `/find-locations`, `/profile`)
  - These are different Webpack entry points/SPAs that require full browser navigation
  - `RouterLink`/`RouterLinkAction` won't work because `router.push()` only works within the same SPA
  - Example: `<VaLinkAction href="/find-locations" text="Find your VA health facility" />`
  - Example: `<VaLink href="/profile/personal-information" text="Edit signature" />`
  - **Common cross-app destinations from mhv-secure-messaging:**
    - `/find-locations` → facility-locator SPA
    - `/profile/*` → profile SPA
    - `/my-health/medical-records/*` → mhv-medical-records SPA
- **External Links** (Non-VA sites): Use `VaLink` directly with `external` prop
  - For links outside VA.gov entirely (e.g., My VA Health portal at different domain)
  - Use `active` prop for intermediate prominence
  - Example: `<VaLink href={getCernerURL('/pages/messaging/inbox')} text="Go to My VA Health" external active />`
- **When to Use Which Component**:
  - Same-SPA standard navigation → `RouterLink`
  - Same-SPA primary CTA → `RouterLinkAction`
  - Cross-app link (different VA.gov SPA) → `<VaLink />` or `<VaLinkAction />`
  - External link (non-VA site) → `<VaLink external />`
- **Anti-patterns**:
  - ❌ Don't use `<a href>` for internal navigation (breaks client-side routing)
  - ❌ Don't use `VaLink`/`VaLinkAction` without router wrapper for same-SPA navigation (causes unnecessary full page reload)
  - ❌ Don't use `RouterLink`/`RouterLinkAction` for cross-app navigation (router.push() only works within same SPA)

### Web Components
- **VA Design System Components**:
  - Use lowercase-hyphenated tags: `va-text-input`, `va-textarea`, `va-button`, `va-checkbox`, `va-select`, `va-combo-box`
  - For React wrappers, import PascalCase: `VaTextInput`, `VaButton`
  - Web components are ALWAYS preferred over standard HTML form elements
- **Event Handling**:
  - Web components use custom events (not standard onChange)
  - `va-text-input`: Listen for 'input' event with `detail: { value }`
  - `va-select`/`va-combo-box`: Listen for 'vaSelect' event with `detail: { value }`
  - `va-checkbox`: Listen for 'vaChange' event with `detail: { checked }`
  - `va-radio`: Listen for 'vaValueChange' event with `detail: { value }`
- **Error Handling**:
  - Set `error` prop on web components for validation errors
  - Use `message-aria-describedby` for accessibility
  - Focus first error after validation using `focusOnErrorField()` from `util/formHelpers.js`
- **VaRadio Accessibility (WCAG 1.3.1 - Info and Relationships)**:
  - When VaRadio label contains both a heading and descriptive text, screen readers announce everything when focusing each radio option
  - **Pattern**: Separate the heading from helper text using `label-header-level` and `hint` props
  ```jsx
  // ✅ CORRECT: Separate label and hint for proper screen reader behavior
  const LABEL = 'Select a team you want to message';
  const HINT = 'This list only includes teams that you\'ve sent messages to in the last 6 months.';

  <VaRadio
    label={LABEL}
    hint={HINT}
    label-header-level="2"
    required
    onVaValueChange={handleRadioChange}
  >
    {options.map(opt => <va-radio-option key={opt.id} label={opt.name} value={opt.id} />)}
  </VaRadio>
  ```
  ```jsx
  // ❌ WRONG: Combining heading and description in label causes verbosity
  const LABEL = 'Select a team you want to message. This list only includes teams that you\'ve sent messages to in the last 6 months.';

  <VaRadio label={LABEL} required onVaValueChange={handleRadioChange}>
    {options.map(opt => <va-radio-option key={opt.id} label={opt.name} value={opt.id} />)}
  </VaRadio>
  ```
  - **Why**: `label-header-level` renders the label as a semantic heading (e.g., h2) inside the legend, while `hint` is announced separately, reducing screen reader verbosity on radio option focus
  - **Reference**: See VA Design System fieldsets/legends/labels pattern and `src/applications/appeals/995/subtask/pages/start.jsx`
- **Shadow DOM**:
  - Web components use shadow DOM
  - Testing requires special handling (see Test Utilities section)
  - Access shadow root when needed: `element.shadowRoot.querySelector()`

### Form Validation
- **Compose Form Validation**:
  - Recipient: Required, must be valid (not blocked, still associated)
  - Category: Required
  - Subject: Required, not blank
  - Body: Required, not blank
  - Signature (if required): Full name, alphabetic only, checkbox must be checked
  - Use error messages from `ErrorMessages.ComposeForm`
- **Validation Timing**:
  - On blur for individual fields
  - On submit for all fields
  - Clear errors when field is corrected
- **Error Display**:
  - Set error prop on web components
  - Focus first error field after validation failure
  - Use `focusOnErrorField()` helper
  - Scroll to top to show errors if off-screen

### Container Components (`containers/`)
- Connected to Redux using `useSelector` and `useDispatch`
- Handle routing and page-level logic
- Key containers:
  - `Compose`: New message composition
  - `ThreadDetails`: View message thread
  - `FolderThreadListView`: List threads in folder
  - `SearchResults`: Display search results
  - `MessageReply`: Reply to message
- Pattern: Fetch data in useEffect, dispatch actions, pass data to presentational components

### Custom Hooks
- **use-debounce.js**: Debounce value changes for auto-save
  ```javascript
  const debouncedValue = useDebounce(value, draftAutoSaveTimeout);
  ```
- **use-interval.js**: Run function at intervals (e.g., session check)
- **use-previous-url.js**: Track previous URL for navigation
- **use-session-expiration.js**: Handle session timeout
- **useBeforeUnloadGuard.js**: Warn before closing window with unsaved changes
- **useFeatureToggles.js**: Access feature flags

## Testing Patterns

### Unit Tests
- **Testing Framework**:
  - **Do NOT use Jest** - Use Mocha/Chai/Sinon instead
  - Use React Testing Library for component testing
  - Use resources from `src/platform/testing/unit` when necessary
  - Tests must be compatible with both happy-dom and jsdom environments
- **Test Utilities** (`util/testUtils.js`):
  - `inputVaTextInput(container, value, selector)`: Set value on va-text-input and dispatch input event
  - `selectVaSelect(container, value, selector)`: Trigger vaSelect event on va-select
  - `comboBoxVaSelect(container, value, selector)`: Handle va-combo-box selection
  - `checkVaCheckbox(checkboxGroup, bool)`: Toggle va-checkbox
  - `getProps(element)`: Get React props from element
  - **CRITICAL**: Use these helpers for all web component interactions in tests
- **Rendering**:
  - Use `renderWithStoreAndRouter` from `@department-of-veterans-affairs/platform-testing/react-testing-library-helpers`
  - Pass reducer and initial state
  - Example:
    ```javascript
    renderWithStoreAndRouter(<Component />, {
      initialState: { sm: { /* state */ } },
      reducers: reducer,
    });
    ```
- **Store Setup**:
  - Create Redux store with combined reducers
  - Must include `commonReducer` from `platform/startup/store` for feature flags
  - Apply thunk middleware for async actions
  - Example:
    ```javascript
    const store = createStore(
      combineReducers({ ...reducer, commonReducer }),
      initialState,
      applyMiddleware(thunk),
    );
    ```
- **Fixtures**:
  - Located in `tests/fixtures/` directory
  - JSON files for mock API responses
  - Import and use in tests: `import mockData from '../fixtures/data.json'`
- **Mocking & Stubbing with Sinon**:
  - **Sandbox Pattern** (RECOMMENDED): Use `sinon.createSandbox()` for automatic cleanup
    ```javascript
    import sinon from 'sinon';

    describe('MyComponent', () => {
      let sandbox;

      beforeEach(() => {
        sandbox = sinon.createSandbox();
      });

      afterEach(() => {
        sandbox.restore(); // Automatically restores all stubs/spies
      });

      it('tests something', () => {
        const mySpy = sandbox.spy(myModule, 'myFunction');
        const myStub = sandbox.stub(myModule, 'otherFunction').returns('value');
        // Test code here
        // No need to call restore() - sandbox handles it
      });
    });
    ```
  - **API Mocking**: Use `mockApiRequest` from platform-testing
    ```javascript
    import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

    mockApiRequest(responseData); // Success response
    mockApiRequest({}, false); // Error response
    mockApiRequest({ method: 'POST', data: {}, status: 200 }); // Custom config
    ```
  - **Spies**: Track function calls without changing behavior
    ```javascript
    const mySpy = sandbox.spy(myModule, 'myFunction');
    // or create standalone spy
    const callbackSpy = sandbox.spy();

    // Assertions
    expect(mySpy.calledOnce).to.be.true;
    expect(mySpy.calledWith(arg1, arg2)).to.be.true;
    expect(callbackSpy.callCount).to.equal(2);
    ```
  - **Stubs**: Replace function behavior with controlled responses
    ```javascript
    // Return a value
    const myStub = sandbox.stub(SmApi, 'getFolder').returns(mockData);

    // Return a promise
    const asyncStub = sandbox.stub(SmApi, 'sendMessage').resolves(response);
    const errorStub = sandbox.stub(SmApi, 'sendMessage').rejects(new Error('fail'));

    // Stub imported modules
    const useFeatureTogglesStub = sandbox.stub(useFeatureToggles, 'default').returns({
      isAalEnabled: true,
      largeAttachmentsEnabled: true,
    });
    ```
  - **Common Patterns**:
    - Stub Redux actions: `sandbox.spy(myActions, 'myAction')`
    - Stub Datadog RUM: `sandbox.spy(datadogRum, 'addAction')`
    - Stub browser APIs: `sandbox.stub(window, 'print')`, `sandbox.stub(global, 'fetch')`
    - Stub router history: `sandbox.spy(history, 'push')`, `sandbox.spy(history, 'goBack')`
  - **Manual Stub Management** (when not using sandbox):
    ```javascript
    const myStub = sinon.stub(myModule, 'myFunction');
    // ... test code ...
    myStub.restore(); // MUST manually restore
    ```
  - **CRITICAL**: Always restore stubs to avoid test pollution
    - Use sandbox pattern for automatic restoration
    - If using manual stubs, restore in `afterEach()` or at end of test
    - Check for existence before restoring: `if (stub && stub.restore) stub.restore();`
- **Assertions**:
  - Use chai `expect()` for assertions
  - Mocha for test structure (`describe`, `it`)
  - Sinon for spies, stubs, and mocks
  - Example: `expect(element).to.have.attribute('error', 'Error message')`
  - Sinon spy assertions: `expect(spy.calledOnce).to.be.true`, `expect(spy.calledWith(args)).to.be.true`

### E2E Tests (Cypress)
- **Page Objects Pattern**:
  - Located in `tests/e2e/pages/` directory
  - Export singleton instance: `export default new PageClass()`
  - Page objects: `PatientInboxPage`, `PatientComposePage`, `PatientMessageDetailsPage`, etc.
  - Methods for page interactions: `loadInboxMessages()`, `selectRecipient()`, `sendMessage()`
  - Methods for assertions: `verifyHeader()`, `verifySendMessageConfirmationMessageText()`
- **Test Site Setup**:
  - Use `SecureMessagingSite` class from `tests/e2e/sm_site/`
  - `SecureMessagingSite.login()`: Mock user login
  - Sets up user session and feature flags
- **Constants**:
  - Import from `tests/e2e/utils/constants`
  - `AXE_CONTEXT`: Accessibility test context
  - `Locators`: CSS selectors and test IDs
  - `Data`: Test data constants
  - `Paths`: API paths
  - `Alerts`: Expected alert messages
- **Fixtures**:
  - JSON fixtures in `tests/e2e/fixtures/` directory
  - Intercept API calls with fixture data
  - Example: `cy.intercept('GET', Paths.SM_API_BASE, mockData).as('getData')`
- **Web Component Selectors**:
  - External links with `VaLink` render as `<va-link>` (NOT `<va-link-action>`)
  - Internal CTAs with `RouterLinkAction` render as `<va-link-action>`
  - Use `.find('va-link')` for external links, `.find('va-link-action')` for internal CTAs
  - Example: `cy.get('[data-testid="alert"]').find('va-link').click()`
- **Accessibility Testing**:
  - MUST include in all E2E tests
  - Inject axe: `cy.injectAxe()`
  - Run check: `cy.axeCheck(AXE_CONTEXT)`
  - Fix any violations before merging
- **Test Organization**:
  - Group related tests in directories (e.g., `folder-tests/`, `compose-tests/`)
  - Use descriptive test names
  - Clean up data after tests when needed

## MHV Platform Integration

### MHV Utilities (`@department-of-veterans-affairs/mhv/exports`)
- **Page title**: `updatePageTitle(title)` - Updates browser title with proper formatting
- **User tracking**: `addUserProperties(properties)` - Adds analytics tracking properties
- **Downtime**: `renderMHVDowntime(props)` - Renders downtime notification component
- **Crisis modal**: `openCrisisModal()` - Opens emergency crisis line modal
- **Focus management**: `trapFocus(element)` - Traps keyboard focus within element for accessibility

### Downtime Notifications
- Use `DowntimeNotification` component from `@department-of-veterans-affairs/platform-monitoring/DowntimeNotification`
- Configure with `externalServices` array
- Use `downtimeNotificationParams` constant for app-specific messaging
- Render function: `renderMHVDowntime()`
- Shows banner during scheduled maintenance windows

## Development Workflow

### Local Development
- **Mock API**: Start with `yarn mock-api --responses src/platform/mhv/api/mocks/index.js`
- **Dev server**: Run `yarn watch --env entry=mhv-secure-messaging`
- **Simulate login**: `localStorage.setItem('hasSession', true)` in browser console
- **Access URL**: `http://localhost:3001/my-health/secure-messages`
- **Hot reload**: Changes auto-reload in browser

### Testing Commands
- **Unit tests**: `yarn test:unit --app-folder mhv-secure-messaging`
- **Specific test file**: `yarn test:unit path/to/test.unit.spec.js`
- **Coverage**: `yarn test:coverage-app mhv-secure-messaging`
- **Coverage report**: Open `coverage/index.html` in browser after running coverage
- **Cypress GUI**: `yarn cy:open` (requires dev server on port 3001)
- **Cypress CLI**: `yarn cy:run --spec "src/applications/mhv-secure-messaging/**/**/*"`
- **Cypress specific test**: `yarn cy:run --spec "path/to/test.cypress.spec.js"`

## Common Patterns & Best Practices

### Action Creators
- **Pattern**: Async actions use thunk middleware, return `async dispatch =>`
- **Action Types**: Always import from `Actions` constant
  ```javascript
  dispatch({ type: Actions.Message.GET, response });
  ```
- **Error Handling**:
  - Wrap API calls in try/catch
  - Dispatch error action type on failure
  - Add alert with error message
  - Example:
    ```javascript
    try {
      const response = await apiCall();
      dispatch({ type: Actions.Success, response });
    } catch (e) {
      dispatch({ type: Actions.Error });
      dispatch(addAlert(ALERT_TYPE_ERROR, '', ErrorMessages.Generic));
      throw e;
    }
    ```
- **Common Actions**:
  - `retrieveMessageThread(messageId)`: Fetch thread with full details
  - `sendMessage(message, attachments, ohTriageGroup)`: Send new message
  - `sendReply({ replyToId, message, attachments })`: Send reply
  - `saveDraft(messageData, type, id)`: Save/update draft (type: 'manual' or 'auto')
  - `deleteDraft(messageId)`: Delete draft permanently
  - `moveMessageThread(threadId, folderId)`: Move thread to folder
  - `deleteMessage(threadId)`: Move thread to trash

### Breadcrumb Management
- Breadcrumbs managed via Redux (`breadcrumbs` reducer)
- Set using `setBreadcrumbs()` action from `actions/breadcrumbs.js`
- Use `Breadcrumbs` constant for standard breadcrumb configurations
- Pattern:
  ```javascript
  dispatch(setBreadcrumbs([
    Breadcrumbs.MYHEALTH,
    Breadcrumbs.INBOX,
    { href: '#', label: 'Current Page' }
  ]));
  ```
- Mobile vs desktop rendering handled by `BreadcrumbViews` constant

### Alerts & Error Handling
- **Adding Alerts**:
  - Use `addAlert(type, header, content)` action
  - Types: `ALERT_TYPE_ERROR`, `ALERT_TYPE_SUCCESS`, `ALERT_TYPE_WARNING`, `ALERT_TYPE_INFO`
  - Header can be empty string or `Alerts.Headers.HIDE_ALERT` to hide header
  - Content should use constants from `Alerts` or `ErrorMessages`
- **Closing Alerts**:
  - Use `closeAlert()` action
  - Alerts auto-dismiss after timeout (success) or stay visible (error)
- **Error Messages**:
  - Structured in `ErrorMessages` constant by component
  - Always use constants, never hardcode error text
  - Example: `ErrorMessages.ComposeForm.RECIPIENT_REQUIRED`
- **Specific Error Codes**:
  - Check `e.errors[0].code` in catch blocks
  - Handle specific codes differently: blocked user (SM119, SM151), not associated (SM129), attachment scan fail (SM172)
  - Show appropriate alerts based on error code

### HTML Entity Handling
- **CRITICAL**: Always decode HTML entities before displaying user-generated content
- Use `decodeHtmlEntities(str)` helper function
- Applies to: message bodies, subjects, any user input
- Function uses DOMPurify for sanitization + DOMParser for decoding
- Call in action creators when processing API responses:
  ```javascript
  const messages = response.data.map(m => ({
    ...m.attributes,
    body: decodeHtmlEntities(m.attributes.body),
  }));
  ```

### Navigation Guards
- **When to Use**: Prevent navigation when user has unsaved changes in forms
- **Components**:
  - `RouteLeavingGuard`: General purpose navigation guard
  - `SmRouteNavigationGuard`: Secure messaging specific guard
- **Pattern**:
  - Track unsaved changes in state (e.g., `draftInProgress` fields)
  - Set `shouldBlockNavigation` prop to true when changes exist
  - Show modal with save/delete/cancel options
  - Handle each option appropriately (save draft, delete draft, continue editing)
- **Modal Types**: Use `ErrorMessages` constants for different scenarios:
  - `CONT_SAVING_DRAFT`: New draft with changes
  - `CONT_SAVING_DRAFT_CHANGES`: Existing draft with changes
  - `UNABLE_TO_SAVE_DRAFT_ATTACHMENT`: Draft with attachments
  - `UNABLE_TO_SAVE_DRAFT_SIGNATURE`: Draft with signature

### Accessibility Requirements
- **Standards**: All components must meet WCAG 2.2 AA and Section 508 standards
- **Semantic HTML**: Use proper heading hierarchy, landmark regions, lists
- **ARIA Labels**:
  - Add aria-label or aria-describedby to all interactive elements
  - Use message-aria-describedby on web components
  - Announce dynamic content changes with aria-live regions
- **Keyboard Navigation**:
  - All interactive elements must be keyboard accessible
  - Logical tab order
  - Focus visible and clear
  - Use `focusElement()` from platform utilities to manage focus
- **Focus Management**:
  - Focus first error after validation failure
  - Focus success alert after actions
  - Trap focus in modals with `trapFocus()`
  - Return focus after modal close
- **Testing**:
  - Run `cy.axeCheck(AXE_CONTEXT)` in all Cypress tests
  - Fix all violations before merging
  - Test with keyboard only
  - Test with screen reader when possible

### Code Organization Best Practices
- **File Naming**:
  - Components: PascalCase (e.g., `ComposeForm.jsx`)
  - Utilities: camelCase (e.g., `helpers.js`)
  - Tests: Match component name with `.unit.spec.jsx` or `.cypress.spec.js` suffix
- **Import Order**:
  1. External libraries (React, Redux, etc.)
  2. Platform utilities and components
  3. Local actions, reducers, selectors
  4. Local components
  5. Utilities and constants
  6. Styles
- **Constants**:
  - Always import and use constants from `util/constants.js`
  - Never hardcode values that exist as constants
  - Group related constants in objects
- **Comments**:
  - JSDoc comments for function parameters and return types
  - Explain "why" not "what" in inline comments
  - Document complex business logic
  - Mark critical sections with comments
- **Prop Types**: Define PropTypes for all components that accept props

## Common Component Patterns

### Shared Components (`components/shared/`)
- **BlockedTriageGroupAlert**: Display when recipients are blocked or not associated
  - Props: `alertStyle`, `parentComponent`, `currentRecipient`, `setShowBlockedTriageGroupAlert`, `isOhMessage`
  - Handles different scenarios: no associations, all blocked, multiple blocked, facility blocked
  - Uses `updateTriageGroupRecipientStatus()` helper to determine recipient status
- **RouterLink**: Wrapper for VaLink with React Router integration for standard internal navigation
  - **Purpose**: Enables internal navigation without full page reloads using standard link styling
  - **When to Use**: 
    - Utility links (profile, settings, help pages)
    - Navigation links in forms or secondary UI areas
    - Any internal link that is NOT a primary call-to-action
  - **When NOT to Use**: 
    - Primary CTAs in alerts or prominent UI areas (use `RouterLinkAction` instead)
    - External links (use `VaLink` or `VaLinkAction` with `external` prop)
  - **Props**:
    - `href` (required): Destination path for React Router navigation
    - `text` (required): Link text to display
    - `label` (optional): Aria-label for screen readers when text needs additional context
    - `reverse` (optional): If true, renders with white text for dark backgrounds
    - `active` (optional, default: `false`): If true, renders with bold text + chevron for higher prominence
    - Supports all standard `data-*` attributes: `data-testid`, `data-dd-action-name`, `data-dd-privacy`
  - **Usage Examples**:
    ```jsx
    // Standard utility link (most common)
    <RouterLink
      href="/profile/personal-information#messaging-signature"
      text="Edit signature for all messages"
      data-testid="edit-signature-link"
    />
    
    // Link with higher prominence (active styling)
    <RouterLink
      href={Paths.COMPOSE}
      text="Compose message"
      active
      data-dd-action-name="Compose from dashboard"
    />
    ```
  - **Implementation Notes**:
    - Uses `VaLink` with default styling (active={false})
    - Wraps React Router v3 context access via `withRouter` HOC
    - Prevents default link behavior and uses `context.router.push()` for client-side navigation
    - For standard navigation links where CTA prominence is not needed
- **RouterLinkAction**: Wrapper for VaLink with React Router integration for high-prominence CTAs
  - **Purpose**: Enables internal navigation with action link styling (bold + chevron) for primary CTAs
  - **When to Use**: 
    - Primary call-to-action links in alerts (e.g., "Start a new message", "Go to inbox")
    - High-prominence navigation in dashboard or key UI areas
    - Links that drive core user actions
  - **When NOT to Use**: 
    - Standard utility links (use `RouterLink` instead)
    - External links (use `VaLinkAction` with `external` prop)
  - **IMPORTANT TECHNICAL NOTE**:
    - This component uses `VaLink` with `active={true}`, NOT `VaLinkAction`
    - Why? `VaLinkAction` doesn't expose an `onClick` prop needed for React Router integration
    - `VaLink` with `active={true}` provides the closest visual styling:
      - Bold text + right arrow (chevron)
      - Blue color scheme
    - While not pixel-perfect to `VaLinkAction` (which uses a circular icon), the "active link" styling provides sufficient visual prominence for CTAs
    - See design.va.gov/components/link/ and design.va.gov/components/link/action for VADS guidance
  - **Props**:
    - `href` (required): Destination path for React Router navigation
    - `text` (required): Link text to display
    - `label` (optional): Aria-label for screen readers when text needs additional context
    - `reverse` (optional): If true, renders with white text for dark backgrounds
    - `active` (optional, default: `true`): Always true for action link styling
    - Supports all standard `data-*` attributes: `data-testid`, `data-dd-action-name`, `data-dd-privacy`
  - **Usage Examples**:
    ```jsx
    // Primary CTA in alert (default styling)
    <RouterLinkAction
      href={Paths.COMPOSE}
      text="Start a new message"
      data-dd-action-name="Start message from alert"
    />
    
    // Action link in dashboard
    <RouterLinkAction
      href={Paths.INBOX}
      text="View all messages"
      data-testid="view-messages-cta"
    />
    ```
  - **Implementation Notes**:
    - Uses `VaLink` with `active={true}` prop (NOT VaLinkAction due to onClick limitation)
    - Wraps React Router v3 context access via `withRouter` HOC
    - Prevents default link behavior and uses `context.router.push()` for client-side navigation
  - **Decision Tree**: When choosing between RouterLink and RouterLinkAction:
    ```
    Is this an internal navigation link?
    ├─ YES → Is it a primary CTA?
    │   ├─ YES → Use RouterLinkAction (bold + chevron)
    │   └─ NO  → Use RouterLink (standard styling)
    └─ NO → External link
        └─ Use VaLink or VaLinkAction with external prop
    ```
- **RouteLeavingGuard**: General navigation guard for unsaved changes
  - Props: `when`, `navigate`, `shouldBlockNavigation`, `modalVisible`, `modalProps`
- **SmRouteNavigationGuard**: Secure messaging-specific navigation guard
  - Handles draft-specific scenarios
- **HorizontalRule**: Consistent divider component used throughout app
- **EmergencyNote**: Crisis line information and connect button
  - Always display above compose forms and reply forms

### Reusable Component Patterns
- **Alert Components**: Use `VaAlert` from component library
  - Set `status` prop: 'error', 'success', 'warning', 'info'
  - Use `closeable` prop for dismissible alerts
  - Focus alert after display for accessibility
- **Modal Components**: Located in `components/Modals/`
  - `CreateFolderModal`, `RemoveAttachmentModal`, etc.
  - Use `visible` prop to control display
  - Always manage focus when opening/closing
- **AttachmentsList**: Display attachments with remove functionality
  - Props: `attachments`, `compose` (boolean for compose vs view mode)
- **MessageThreadItem**: Individual message in accordion
  - Uses `VaAccordionItem` from component library
  - Handles message expansion, read receipts, attachments

### AlertBackgroundBox & Alert Positioning Pattern
The `AlertBackgroundBox` component (`components/shared/AlertBackgroundBox.jsx`) displays success, error, and warning alerts throughout the application. **CRITICAL**: Alerts must always appear **below** the page H1 heading, never above.

- **Accessibility Requirements**:
  - **WCAG SC 1.3.2 (Meaningful Sequence)**: Content order must be programmatically determinable
  - **WCAG SC 2.4.3 (Focus Order)**: Focus order preserves meaning and operability
  - **WCAG SC 4.1.3 (Status Messages)**: Status messages announced by AT without receiving focus
  - **MHV Decision Records**: Focus should be set to H1 on page load

- **Implementation Pattern**:
  - Use conditional role based on alert type:
    - `role="status"` for success and warning alerts (non-interruptive)
    - `role="alert"` for error alerts (interruptive, higher priority)
  - Always focus H1 on page load, not the alert
  - For dismissible alerts, move focus back to H1 after alert is dismissed

- **AlertSlot Pattern**: For containers where the H1 is inside a child component (ComposeForm, ReplyForm, MessageThreadHeader), use the `alertSlot` prop pattern:
  ```jsx
  // Container (parent) - passes AlertBackgroundBox as prop
  <ComposeForm
    alertSlot={<AlertBackgroundBox closeable />}
    // ... other props
  />
  
  // Child component - renders alertSlot after H1
  const ComposeForm = ({ alertSlot, ...props }) => {
    return (
      <>
        <h1 className="page-title">{pageTitle}</h1>
        {alertSlot}  {/* ← Alert renders AFTER H1 */}
        {/* ... rest of form */}
      </>
    );
  };
  ```

- **Direct Pattern**: For containers where H1 is in the same file (FolderThreadListView, Folders), render AlertBackgroundBox directly after the H1:
  ```jsx
  // In container component
  <>
    <FolderHeader folder={folder} />  {/* Contains H1 */}
    <AlertBackgroundBox closeable />  {/* ← Alert AFTER H1 */}
    {content}
  </>
  ```

- **Error State Handling**: When page data fails to load (e.g., 503 error), the H1 may not exist. Render AlertBackgroundBox at the top of the content area for error visibility:
  ```jsx
  {folder === null ? (
    <AlertBackgroundBox closeable />  {/* Error state: no H1 */}
  ) : (
    folderId === undefined && <LoadingIndicator />
  )}
  {folderId !== undefined && (
    <>
      <FolderHeader folder={folder} />  {/* Contains H1 */}
      <AlertBackgroundBox closeable />  {/* Normal state: after H1 */}
      {content}
    </>
  )}
  ```

- **Focus Management**: Always focus H1, never the alert:
  ```jsx
  // ✅ CORRECT: Always focus H1, let role="status" announce alert
  useEffect(() => {
    if (folder !== undefined) {
      focusElement(document.querySelector('h1'));
    }
  }, [alertList, folder]);
  
  // ❌ WRONG: Conditional focus on alert
  useEffect(() => {
    const alertVisible = alertList[alertList?.length - 1];
    const selector = alertVisible?.isActive ? 'va-alert' : 'h1';
    focusElement(document.querySelector(selector));
  }, [alertList, folder]);
  ```

- **PropTypes**: When using alertSlot pattern, add to component's propTypes:
  ```jsx
  ComponentName.propTypes = {
    alertSlot: PropTypes.node,
    // ... other props
  };
  ```

### Component Composition Patterns
- Container components fetch data and handle routing
- Presentational components receive data via props
- Use composition over inheritance
- Extract complex logic into custom hooks
- Keep components focused on single responsibility

## State Management Details

### Redux State Shape
```javascript
state.sm = {
  alerts: { /* alert objects */ },
  recipients: {
    allowedRecipients: [], // Array of recipient objects
    blockedRecipients: [], // Array of blocked recipient IDs
    noAssociations: false,
    allTriageGroupsBlocked: false,
    associatedBlockedTriageGroupsQty: 0,
    blockedFacilities: [],
  },
  breadcrumbs: { /* breadcrumb array */ },
  categories: { /* category list */ },
  facilities: { /* facility data */ },
  folders: {
    folder: null, // Current folder object
    folderList: [], // All folders
  },
  search: {
    query: {},
    results: [],
    page: 1,
    sort: {},
  },
  threads: {
    threadList: [], // List of thread objects
    page: 1,
    sort: {},
    refetchRequired: false, // Set to true to trigger thread list refresh (see Thread List Refresh Pattern)
  },
  threadDetails: {
    messages: [], // Sent messages in thread
    drafts: [], // Draft messages in thread
    cannotReply: false,
    replyToName: '',
    threadFolderId: null,
    draftInProgress: {
      messageId: null,
      recipientId: null,
      category: null,
      subject: '',
      body: '',
      savedDraft: false,
      saveError: null,
      navigationError: null,
    },
  },
  triageTeams: { /* triage team data */ },
  preferences: {
    signature: {}, // User signature preferences
  },
  prescription: { /* prescription data for medication renewal */ },
}
```

### Common Data Object Shapes
- **Message Object**:
  ```javascript
  {
    messageId: number,
    threadId: number,
    folderId: number,
    category: string,
    subject: string,
    body: string, // Must be decoded with decodeHtmlEntities()
    sentDate: string (ISO 8601) or null,
    draftDate: string (ISO 8601) or null,
    senderId: number,
    senderName: string,
    recipientId: number,
    recipientName: string,
    triageGroupName: string,
    readReceipt: string (ISO 8601) or null,
    hasAttachments: boolean,
    attachments: [{ id, name, size, link }],
  }
  ```
- **Recipient Object**:
  ```javascript
  {
    id: number,
    name: string,
    stationNumber: string,
    preferredTeam: boolean,
    relationshipType: string,
    signatureRequired: boolean, // Set by regex check
    healthCareSystemName: string, // Resolved from stationNumber
    status: 'ALLOWED' | 'BLOCKED' | 'NOT_ASSOCIATED',
  }
  ```

## Feature Flags

### Using Feature Toggles
- **Feature Flag Names**: Import flag name constants from `src/platform/utilities/feature-toggles/featureFlagNames.json`
  - Provides centralized list of all available feature flags
  - Use constants instead of hardcoded strings for consistency
- **Hook**: Import and use `useFeatureToggles()` from `hooks/useFeatureToggles.js`
  ```javascript
  const {
    customFoldersRedesignEnabled,
    readReceiptsEnabled,
    mhvSecureMessagingRecentRecipients,
    featureTogglesLoading,
  } = useFeatureToggles();
  ```
- **Pattern**: Check `featureTogglesLoading` before using flag values
- **Common Flags**:
  - `customFoldersRedesignEnabled`: New folder management UI
  - `readReceiptsEnabled`: Show read receipt timestamps
  - `mhvSecureMessagingRecentRecipients`: Recent care teams feature
  - `smLargeAttachmentsEnabled`: 25MB attachment limit vs 6MB
  - `smExtendedAttachmentTypes`: Extended file types (MP4, TIFF, etc.)

### Testing with Feature Flags
- Set feature flags in test store's initial state
- Include `commonReducer` which holds feature toggles
- Example:
  ```javascript
  const initialState = {
    featureToggles: {
      customFoldersRedesignEnabled: true,
    },
  };
  ```

## Analytics & Monitoring

### Datadog RUM (Real User Monitoring)
- **Import**: `import { datadogRum } from '@datadog/browser-rum'`
- **Usage**:
  - `datadogRum.addAction(actionName, context)`: Track user actions
  - `datadogRum.addError(error, context)`: Log errors with context
- **Common Patterns**:
  ```javascript
  // Track page loads
  datadogRum.addAction('Recent Care Teams loaded', {
    recentRecipientsCount: recipients.length,
  });

  // Track user interactions
  datadogRum.addAction('Care System Radio Switch Count', {
    switchCount: careSystemSwitchCount,
  });

  // Log errors
  datadogRum.addError(error, {
    action: 'getPrescriptionById',
    prescriptionId: id,
  });
  ```
- **Configuration**: Set up in `App.jsx` with `useDatadogRum()` and `setDatadogRumUser()`
- **Privacy & PII/PHI Protection**:
  - **CRITICAL**: All input and display fields that may potentially contain PII/PHI MUST be masked with `data-dd-privacy="mask"`
  - Apply masking to:
    - Message subject and body fields
    - Recipient names and triage group names
    - User names and signatures
    - Any user-generated content
    - Attachment file names (may contain sensitive info)
  - **Action Name Attribute**: Add `data-dd-action-name` to elements to prevent RUM from capturing `innerText`
    - Use on parent elements to apply to all child elements
    - Prevents accidental PII/PHI capture in click tracking
  - Example:
    ```jsx
    <va-text-input
      label="Subject"
      name="subject"
      value={subject}
      data-dd-privacy="mask"
      data-dd-action-name="message-subject-input"
    />

    <div data-dd-privacy="mask" data-dd-action-name="message-body">
      {message.body}
    </div>
    ```
  - **Best Practice**: When in doubt, mask it - err on the side of privacy protection

### Google Analytics
- **Import**: `import recordEvent from 'platform/monitoring/record-event'`
- **Usage**:
  ```javascript
  recordEvent({
    event: 'secure-messaging-save-draft-type',
    'secure-messaging-save-draft': type, // 'manual' or 'auto'
    'secure-messaging-save-draft-id': id,
  });
  ```
- **Common Events**:
  - Draft save events (manual vs auto)
  - Folder creation/deletion
  - Message send/receive
  - Navigation events

### Data-testid Attributes
- Add `data-testid` attributes to interactive elements for E2E testing
- Use descriptive, kebab-case names: `data-testid="send-message-button"`
- Locators stored in `tests/e2e/utils/constants.js`

### Sticky Header Click Issues in Cypress
- **Problem**: VA.gov has a sticky header that can cover elements when Cypress tries to click them
- **Symptom**: `CypressError: cy.click() failed because the center of this element is hidden from view`
- **Solution**: Use `{ force: true }` option for clicks on elements that may be covered by the header
- **Example**:
  ```javascript
  // ✅ CORRECT: Force click when element may be covered by sticky header
  cy.contains(mockMessages.data[0].attributes.subject).click({
    force: true,
    waitForAnimations: true,
  });

  // ❌ WRONG: May fail intermittently due to sticky header overlay
  cy.contains(mockMessages.data[0].attributes.subject).click();
  ```
- **Common locations**: Message list links, accordion items near top of page, buttons after page scroll
- **Note**: Only use `force: true` when you've confirmed the element is legitimately covered by the header, not as a workaround for actual visibility issues

## Import Patterns & Module Resolution

### Platform Utilities (Always Import from Platform)
- **API requests**: `@department-of-veterans-affairs/platform-utilities/exports`
  - `apiRequest` for API calls
- **UI utilities**: `@department-of-veterans-affairs/platform-utilities/ui`
  - `focusElement`, `scrollToTop`, `scrollTo`
- **Form system**: `platform/forms-system/src/js/web-component-patterns`
  - `validateNameSymbols` for name validation
- **Monitoring**: `platform/monitoring/record-event`
- **Drupal static data**: `platform/site-wide/drupal-static-data/source-files/vamc-ehr`
  - `getVamcSystemNameFromVhaId`, `selectEhrDataByVhaId`

### Component Library Imports
- **React bindings**: `@department-of-veterans-affairs/component-library/dist/react-bindings`
  - `VaTextInput`, `VaButton`, `VaAlert`, `VaModal`, `VaAccordion`, etc.
  - These are React wrappers for web components
- **Web components**: Use lowercase tags directly in JSX
  - `<va-text-input>`, `<va-button>`, `<va-alert>`

### Local Module Patterns
- **Actions**: Import specific actions from action files
  ```javascript
  import { sendMessage, sendReply } from '../actions/messages';
  ```
- **Constants**: Import named exports, group related ones
  ```javascript
  import { Paths, Alerts, ErrorMessages, DefaultFolders } from '../util/constants';
  ```
- **Helpers**: Import specific functions needed
  ```javascript
  import { dateFormat, decodeHtmlEntities, sortRecipients } from '../util/helpers';
  ```
- **Components**: Import default exports
  ```javascript
  import ComposeForm from '../components/ComposeForm/ComposeForm';
  ```

## Common Pitfalls & Anti-patterns

### What NOT to Do
- ❌ **Never** hardcode paths, use `Paths` constants
- ❌ **Never** hardcode error messages, use `ErrorMessages` or `Alerts` constants
- ❌ **Never** hardcode timeout values, use `draftAutoSaveTimeout` constant
- ❌ **Never** display message body without calling `decodeHtmlEntities()` first
- ❌ **Never** use standard HTML form elements, use VA web components from `@department-of-veterans-affairs/component-library`
- ❌ **Never** save attachments or signatures in drafts
- ❌ **Never** access Redux state directly without `state.sm.` prefix
- ❌ **Never** use `onChange` on web components, use proper custom events
- ❌ **Never** forget to check 45-day rule before allowing replies
- ❌ **Never** skip error handling in async actions
- ❌ **Never** forget to dispatch `setThreadRefetchRequired(true)` after operations that change thread/message state (see Thread List Refresh Pattern below)

### Performance Considerations
- ✅ Debounce auto-save operations (already implemented with `useDebounce`)
- ✅ Memoize expensive computations with `useMemo`
- ✅ Use `useCallback` for functions passed to child components
- ✅ Avoid unnecessary re-renders by properly structuring state
- ✅ Lazy load components when possible (not heavily used currently)

### Memory Leak Prevention
- ✅ Clean up timeouts and intervals in useEffect cleanup
- ✅ Cancel pending API requests when component unmounts
- ✅ Remove event listeners in cleanup functions
- ✅ Clear large state objects when no longer needed

## Error Handling Patterns

### Error Codes & Responses
- **Backend Error Structure**:
  ```javascript
  {
    errors: [{
      code: 'SM119', // Error code
      status: '403', // HTTP status
      detail: 'User is blocked from messaging', // Error message
      title: 'Forbidden',
    }]
  }
  ```
- **Common Error Codes**:
  - `SM119`, `SM151`: User blocked from messaging recipient
  - `SM129`: User no longer associated with triage group
  - `SM172`: Attachment failed virus scan
  - `503`: Service outage/downtime
  - `404`: Message/thread not found

### Error Handling in Actions
```javascript
try {
  const response = await apiCall();
  dispatch({ type: Actions.Success, response });
} catch (e) {
  // Check for specific error codes
  if (e.errors && e.errors[0].code === 'SM119') {
    dispatch(addAlert(
      ALERT_TYPE_ERROR,
      '',
      Alerts.Message.BLOCKED_MESSAGE_ERROR,
    ));
  } else if (e.errors && e.errors[0].code === 'SM172') {
    dispatch(addAlert(
      ALERT_TYPE_ERROR,
      Alerts.Headers.HIDE_ALERT,
      Alerts.Message.ATTACHMENT_SCAN_FAIL,
    ));
  } else {
    // Generic error handling
    dispatch(addAlert(
      ALERT_TYPE_ERROR,
      '',
      Alerts.Message.SEND_MESSAGE_ERROR,
    ));
  }
  throw e; // Re-throw to allow component-level handling if needed
}
```

### Network Error Handling
- Always show user-friendly error messages
- Log errors to Datadog for monitoring
- Provide actionable next steps in error messages
- Use `Alerts.Message.SERVER_ERROR_503` for service outages

## Quick Reference Examples

### Creating a New Action
```javascript
export const myAction = (param) => async dispatch => {
  try {
    dispatch({ type: Actions.MyFeature.REQUEST });
    const response = await myApiCall(param);

    dispatch({
      type: Actions.MyFeature.SUCCESS,
      response,
    });
  } catch (e) {
    dispatch({ type: Actions.MyFeature.ERROR });
    dispatch(addAlert(
      ALERT_TYPE_ERROR,
      '',
      ErrorMessages.MyFeature.ERROR_MESSAGE,
    ));
    throw e;
  }
};
```

### Form Validation Pattern
```javascript
const validateForm = () => {
  let isValid = true;

  if (!recipientId) {
    setRecipientError(ErrorMessages.ComposeForm.RECIPIENT_REQUIRED);
    isValid = false;
  }

  if (!category) {
    setCategoryError(ErrorMessages.ComposeForm.CATEGORY_REQUIRED);
    isValid = false;
  }

  if (!isValid) {
    focusOnErrorField(); // Focus first error
    scrollToTop(); // Scroll to show errors
  }

  return isValid;
};
```

### Using Web Components in JSX
```jsx
<va-text-input
  label="Subject"
  name="subject"
  required
  value={subject}
  error={subjectError}
  onInput={(e) => {
    setSubject(e.detail.value);
    setSubjectError('');
  }}
  message-aria-describedby="subject-description"
/>
```

## Thread List Refresh Pattern

### Overview
When an action modifies thread or message state (read status, send, delete, move), the thread list in `FolderThreadListView` must be refreshed to reflect those changes. This is accomplished via the `refetchRequired` flag pattern.

### How It Works
1. **Action sets flag**: After successful state change, dispatch `setThreadRefetchRequired(true)`
2. **Component reacts**: `FolderThreadListView` has a `useEffect` that watches `refetchRequired`
3. **Refetch triggered**: When `refetchRequired` becomes `true`, component calls `getListOfThreads()`
4. **Flag reset**: After refetch, `refetchRequired` is set back to `false`

### When to Use
Dispatch `setThreadRefetchRequired(true)` after any action that changes data visible in the thread list:
- ✅ `markMessageAsReadInThread` - changes `unreadMessages` flag
- ✅ `sendMessage` / `sendReply` - adds new message to thread
- ✅ `deleteMessage` - removes thread from folder
- ✅ `moveMessageThread` - moves thread between folders
- ✅ `saveDraft` / `deleteDraft` - affects draft count/status

### Implementation Pattern
```javascript
// In action creator (e.g., actions/messages.js)
import { setThreadRefetchRequired } from './threads';

export const myAction = (param) => async dispatch => {
  const response = await apiCall(param);
  if (!response.errors) {
    dispatch({ type: Actions.MyFeature.SUCCESS, response });
    dispatch(setThreadRefetchRequired(true)); // CRITICAL: Trigger list refresh
  }
};
```

### Common Bug: Stale Thread List
**Symptom**: User performs action (e.g., opens message), returns to inbox, but list doesn't reflect change (e.g., message still shows as unread)
**Cause**: Action creator missing `dispatch(setThreadRefetchRequired(true))`
**Solution**: Add the dispatch after successful state change
**Reference**: GitHub issue #125994

## Troubleshooting Common Issues

### Thread List Not Updating After Action
- **Symptom**: User performs action, returns to list, changes not reflected
- **Cause**: Missing `setThreadRefetchRequired(true)` dispatch in action creator
- **Solution**: Add `dispatch(setThreadRefetchRequired(true))` after successful API call
- **See**: Thread List Refresh Pattern section above

### Web Components Not Responding
- **Symptom**: va-text-input onChange not firing
- **Cause**: Web components use custom events, not standard onChange
- **Solution**: Use onInput with e.detail.value
- **See**: Component Patterns > Web Components > Event Handling

### Draft Not Saving
- **Symptom**: Auto-save not triggering after typing
- **Cause**: May be typing too fast for 10s debounce
- **Solution**: Check draftAutoSaveTimeout constant (10000ms)
- **Debug**: Add console.log in useDebounce hook

### Redux State Undefined
- **Symptom**: Cannot read property 'sm' of undefined
- **Cause**: Accessing state without 'sm' namespace
- **Solution**: Always use state.sm.<reducer>
- **See**: Architecture > Redux Structure > State access pattern

---
applyTo: "src/applications/mhv-medications/**/*"
---

# MHV Medications Application Instructions

## 🔄 Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the mhv-medications application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants**: New paths, error messages, alerts, or configuration in `util/constants.js`
- **Create new helper functions**: New utilities in `util/helpers/` directory
- **Implement new business rules**: Prescription status logic, refill eligibility, tracking, etc.
- **Add new action types or actions**: New Redux actions in `util/actionTypes.js` or `actions/` directory
- **Create new reducers or modify state shape**: Changes to Redux state structure
- **Add new shared components**: New reusable components in `components/shared/`
- **Implement new feature flags**: New feature toggles in `util/selectors.js`
- **Add new API endpoints**: New functions in `api/` directory
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new error codes**: New backend error codes and their handling
- **Modify component patterns**: New web component usage patterns or validation approaches
- **Update navigation structure**: New routes or path handling

### How to Update These Instructions
1. **Locate the relevant section**: Find the section that relates to your change
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
- **Entry Name**: `medications`
- **Root URL**: `/my-health/medications`
- **Entry File**: `app-entry.jsx`
- **Purpose**: View and manage VA prescriptions, request refills, track shipments, and access medication documentation

## Architecture & State Management

### Redux Structure
- **Root reducer**: Combined reducer at `reducers/index.js` under `rx` namespace
- **Reducer modules**: `inProductEducation`, `preferences`
- **RTK Query APIs**: 
  - `prescriptionsApi` - Handles prescription CRUD operations with caching
  - `allergiesApi` - Handles allergy data fetching
- **Action types**: Centralized in `util/actionTypes.js` under `Actions` object with nested namespaces:
  - `Actions.Prescriptions.*` - Prescription list, details, refills
  - `Actions.Allergies.*` - Allergy data operations
  - `Actions.Tooltip.*` - In-product education tooltips
- **Selectors**: Defined in `util/selectors.js` for accessing feature flags
- **State access pattern**: Always use `state.rx.<reducer>` to access medications state

### API Layer
- **Backend Service**: This application uses API services provided by **vets-api**
  - Base path v1: `${environment.API_URL}/my_health/v1`
  - Base path v2: `${environment.API_URL}/my_health/v2` (for accelerated/Cerner pilot endpoints)
- **API clients**:
  - `api/prescriptionsApi.js` - RTK Query API for prescriptions (primary)
  - `api/allergiesApi.js` - RTK Query API for allergies
  - `api/rxApi.js` - Legacy API functions for tooltips and activity logging
- **Mock responses**: Located in `mocks/` directory
- **API patterns**:
  - Uses RTK Query for data fetching with automatic caching (1 hour `keepUnusedDataFor`)
  - V1 endpoints for legacy VistA data paths
  - V2 endpoints for accelerated/Cerner pilot data paths
  - Use `getApiBasePath(isAcceleratingMedications)` to get correct base path
  - Use `getRefillMethod(isAcceleratingMedications)` - PATCH for v1, POST for v2

### RTK Query Hooks
```javascript
// Auto-generated hooks from prescriptionsApi
useGetPrescriptionsListQuery({ page, perPage, sortEndpoint, filterOption, includeImage, isAcceleratingMedications })
useGetPrescriptionByIdQuery({ id, isAcceleratingMedications })
useGetRefillablePrescriptionsQuery({ isAcceleratingMedications })
useGetPrescriptionDocumentationQuery(prescriptionId)
useRefillPrescriptionMutation()
useBulkRefillPrescriptionsMutation()
useGetPrescriptionsExportListQuery({ filterOption, sortEndpoint, includeImage, isAcceleratingMedications })
```

## Constants & Configuration

### Core Constants (`util/constants.js`)

#### URLs and Paths
- **medicationsUrls**: Route paths for medications features
  ```javascript
  medicationsUrls.MEDICATIONS_URL: '/my-health/medications'
  medicationsUrls.MEDICATIONS_REFILL: '/my-health/medications/refill'
  medicationsUrls.PRESCRIPTION_DETAILS: '/my-health/medications/prescription'
  medicationsUrls.subdirectories.BASE: '/'
  medicationsUrls.subdirectories.REFILL: '/refill'
  medicationsUrls.subdirectories.DETAILS: '/prescription'
  medicationsUrls.subdirectories.DOCUMENTATION: '/documentation'
  ```

#### Prescription Statuses
- **dispStatusObj**: All possible prescription dispense statuses
  ```javascript
  dispStatusObj.unknown: 'Unknown'
  dispStatusObj.active: 'Active'
  dispStatusObj.refillinprocess: 'Active: Refill in Process'
  dispStatusObj.submitted: 'Active: Submitted'
  dispStatusObj.expired: 'Expired'
  dispStatusObj.discontinued: 'Discontinued'
  dispStatusObj.transferred: 'Transferred'
  dispStatusObj.nonVA: 'Active: Non-VA'
  dispStatusObj.onHold: 'Active: On Hold'
  dispStatusObj.activeParked: 'Active: Parked'
  ```

#### Filter Options
- **Filter Keys**: Used for filtering prescription lists
  ```javascript
  ALL_MEDICATIONS_FILTER_KEY: 'ALL_MEDICATIONS'
  ACTIVE_FILTER_KEY: 'ACTIVE'
  RECENTLY_REQUESTED_FILTER_KEY: 'RECENTLY_REQUESTED'
  RENEWAL_FILTER_KEY: 'RENEWAL'
  NON_ACTIVE_FILTER_KEY: 'NON_ACTIVE'
  ```
- **filterOptions**: Filter configurations with labels, descriptions, and API query strings
- **dispStatusForRefillsLeft**: Array of statuses that should display refills remaining

#### Sorting Options
- **rxListSortingOptions**: Sorting configurations
  ```javascript
  alphabeticallyByStatus: { API_ENDPOINT, LABEL }
  lastFilledFirst: { API_ENDPOINT, LABEL }
  alphabeticalOrder: { API_ENDPOINT, LABEL }
  ```

#### Refill Configuration
- **MEDICATION_REFILL_CONFIG**: Alert configurations for refill results
  - `ERROR`: Error alert configuration
  - `PARTIAL`: Partial success alert configuration
  - `SUCCESS`: Success alert configuration
- **REFILL_STATUS**: Refill operation states
  ```javascript
  FINISHED: 'finished'
  NOT_STARTED: 'notStarted'
  IN_PROGRESS: 'inProgress'
  ERROR: 'error'
  ```

#### Tracking Configuration
- **trackingConfig**: Carrier-specific tracking URLs
  ```javascript
  trackingConfig.dhl: { label, url }
  trackingConfig.fedex: { label, url }
  trackingConfig.ups: { label, url }
  trackingConfig.usps: { label, url }
  ```

#### Display Constants
- **FIELD_NONE_NOTED**: `'None noted'` - Use for empty/missing data
- **FIELD_NOT_AVAILABLE**: `'Not available'`
- **NO_PROVIDER_NAME**: `'Provider name not available'`
- **ACTIVE_NON_VA**: `'Active: Non-VA'`

#### PDF/TXT Download Constants
- **PDF_TXT_GENERATE_STATUS**: Download generation states
- **DOWNLOAD_FORMAT**: `{ PDF: 'PDF', TXT: 'TXT' }`
- **PRINT_FORMAT**: `{ PRINT: 'print', PRINT_FULL_LIST: 'print-full-list' }`
- **pdfStatusDefinitions**: Status definitions for PDF generation

#### Date Formats
- **DATETIME_FORMATS**: Standard date format strings
  ```javascript
  DATETIME_FORMATS.longMonthDate: 'MMMM d, yyyy'
  DATETIME_FORMATS.filename: 'M-d-yyyy_hmmssa'
  ```

#### Session Storage Keys
```javascript
SESSION_SELECTED_SORT_OPTION: 'SESSION_SELECTED_SORT_OPTION'
SESSION_SELECTED_FILTER_OPTION: 'SESSION_SELECTED_FILTER_OPTION'
SESSION_RX_FILTER_OPEN_BY_DEFAULT: 'SESSION_RX_FILTER_OPEN_BY_DEFAULT'
SESSION_SELECTED_PAGE_NUMBER: 'SESSION_SELECTED_PAGE_NUMBER'
```

#### Prescription Source Types
- **RX_SOURCE**: Prescription source identifiers
  ```javascript
  PARTIAL_FILL: 'PF'
  VA: 'VA'
  NON_VA: 'NV'
  PENDING_DISPENSE: 'PD'
  ```

### Helper Functions (`util/helpers/`)

#### Date Formatting (`dateFormat.js`)
- **dateFormat(timestamp, formatString, noDateMessage, dateWithMessage, timeZone)**: Formats dates using date-fns
  - Uses `date-fns` and `date-fns-tz` (NOT moment.js)
  - Default format: `DATETIME_FORMATS.longMonthDate`
  - Handles RFC 2822 date strings from tracking data
  - Returns `FIELD_NONE_NOTED` for falsy timestamps

#### Prescription Utilities
- **convertPrescription(prescription)**: Extracts attributes from API response format
- **getRxStatus(rx)**: Gets display status, handles Non-VA prescriptions
- **rxSourceIsNonVA(rx)**: Checks if prescription is non-VA (`rx.rxSource === 'NV'`)
- **prescriptionMedAndRenewalStatus(...)**: Determines medication and renewal status for display
- **isRefillTakingLongerThanExpected(rx)**: Checks if refill is delayed (7+ days)
  - Returns `true` if:
    - Status is `refillinprocess` AND current date > refill date, OR
    - Status is `submitted` AND submit date was > 7 days ago
- **filterRecentlyRequestedForAlerts(recentlyRequested)**: Filters prescriptions for delay alerts
- **determineRefillLabel(prescription)**: Gets appropriate label text for refill button

#### Array/List Utilities
- **isArrayAndHasItems(obj)**: Returns true if obj is array with items
- **processList(list)**: Join array items with '. ' separator
- **fromToNumbs(currentPage, total)**: Calculate pagination "from" and "to" numbers

#### Text/File Utilities
- **generateTextFile(content, fileName)**: Download text content as file
- **generateMedicationsPDF(...)**: Generate PDF file for medications
- **convertHtmlForDownload(html)**: Convert HTML content for download
- **sanitizeKramesHtmlStr(html)**: Sanitize Krames documentation HTML
- **generateTimestampForFilename()**: Generate timestamp string for filenames

#### Validation Utilities
- **validateField(value)**: Validate and format field value for display
- **validateIfAvailable(value)**: Check if value is available

#### Navigation Utilities
- **createBreadcrumbs(path)**: Generate breadcrumb configuration for page

#### Display Utilities
- **displayProviderName(prescription)**: Format provider name for display
- **displayMedicationsListHeader(...)**: Generate list page header content
- **displayHeaderPrefaceText(...)**: Generate header preface text
- **createNoDescriptionText()**: Generate "no description" text
- **createVAPharmacyText()**: Generate VA pharmacy contact text
- **getImageUri(prescription)**: Get medication image URI

#### Refill History
- **getRefillHistory(prescription)**: Extract refill history from prescription
- **getMostRecentRxRefill(prescription)**: Get most recent refill record
- **getShowRefillHistory(prescription)**: Determine if refill history should display
- **hasCmopNdcNumber(prescription)**: Check if has CMOP NDC number for image

## Business Logic & Requirements

### Prescription Status Logic
- **Active Statuses**: Can be refilled if they have refills remaining
  - `Active` - Standard active prescription
  - `Active: Parked` - Prescription on hold, veteran-initiated
  - `Active: On Hold` - Prescription on hold, pharmacy-initiated
  - `Active: Submitted` - Refill request submitted, pending processing
  - `Active: Refill in Process` - Refill being processed/shipped
  - `Active: Non-VA` - Non-VA medication (informational only)
- **Non-Active Statuses**: Cannot be refilled
  - `Discontinued` - Provider stopped prescription
  - `Expired` - Prescription validity period ended
  - `Transferred` - Moved to another facility (My VA Health)
  - `Unknown` - Status cannot be determined

### Refill Eligibility Rules
- **Refillable Criteria**:
  - Prescription `isRefillable` flag is `true`
  - Use `list_refillable_prescriptions` endpoint for refill page
- **Refills Display**: Show refills remaining for statuses in `dispStatusForRefillsLeft`
- **Renewal Needed**: Filter shows prescriptions that need renewal (no refills left or expired within 120 days)

### Refill Request Flow
1. User selects prescriptions on refill page
2. Submit via `useBulkRefillPrescriptionsMutation()`
3. API returns success/failure lists
4. Display appropriate alert based on results:
   - Full success: `MEDICATION_REFILL_CONFIG.SUCCESS`
   - Partial success: `MEDICATION_REFILL_CONFIG.PARTIAL`
   - Full failure: `MEDICATION_REFILL_CONFIG.ERROR`

### Delay Detection
- **isRefillTakingLongerThanExpected(rx)**: Detects delayed refills
  - Refill in Process: Current date past expected refill date
  - Submitted: More than 7 days since submission

### Tracking Information
- **Carrier Support**: DHL, FedEx, UPS, USPS
- **Tracking URLs**: Configured in `trackingConfig` constant
- **Display Duration**: Tracking info shown for 14 days after shipping

## Component Patterns

### Component Organization
- `components/MedicationsList/` - List page components
- `components/PrescriptionDetails/` - Details page components
- `components/RefillPrescriptions/` - Refill page components
- `components/shared/` - Shared/reusable components

### Web Components
- **VA Design System Components**:
  - Use lowercase-hyphenated tags: `va-button`, `va-alert`, `va-card`, `va-accordion`
  - For React wrappers, import PascalCase: `VaButton`, `VaAlert`, `VaCard`
  - Web components are ALWAYS preferred over standard HTML form elements
- **Status Dropdown**: Use `StatusDropdown` component for prescription status display

### Form Validation
- **Refill Selection**: Must select at least one prescription
- **Error Display**: Use inline error via `va-checkbox-group` error prop
- **Validation Timing**: On submit (before API call)

## Testing Patterns

### Unit Tests
- **Testing Framework**:
  - **Do NOT use Jest** - Use Mocha/Chai/Sinon instead
  - Use React Testing Library for component testing
  - Use resources from `src/platform/testing/unit` when necessary
- **Test File Location**: `tests/unit/` directory
- **File Naming**: `*.unit.spec.js` or `*.unit.spec.jsx`
- **RTK Query Mocking**: Mock the API hooks in tests

### E2E Tests (Cypress)
- **Test Location**: `tests/e2e/` directory
- **Fixtures**: `tests/e2e/fixtures/` for mock data
- **Page Objects**: `tests/e2e/pages/` for page object patterns
- **Test File Naming**: `medications-*.cypress.spec.js`
- **Accessibility Testing**: 
  - MUST include in all E2E tests
  - Inject axe: `cy.injectAxe()`
  - Run check: `cy.axeCheck(AXE_CONTEXT)`

## Feature Flags

### Available Feature Toggles (`util/selectors.js`)
```javascript
selectAllergiesFlag(state)           // mhvMedicationsDisplayAllergies
selectPendingMedsFlag(state)         // mhvMedicationsDisplayPendingMeds
selectPartialFillContentFlag(state)  // mhvMedicationsPartialFillContent
selectDontIncrementIpeCountFlag(state) // mhvMedicationsDontIncrementIpeCount
selectBypassDowntime(state)          // mhvBypassDowntimeNotification
selectNewCernerFacilityAlertFlag(state) // mhvMedicationsDisplayNewCernerFacilityAlert
selectSecureMessagingMedicationsRenewalRequestFlag(state) // mhvSecureMessagingMedicationsRenewalRequest
selectCernerPilotFlag(state)         // mhvMedicationsCernerPilot
```

### Using Feature Toggles
- Import selector from `util/selectors.js`
- Use with `useSelector(selectFeatureFlag)`
- Check `featureTogglesLoading` before using flag values

## MHV Platform Integration

### MHV Utilities (`@department-of-veterans-affairs/mhv/exports`)
- **Page title**: `updatePageTitle(title)` - Updates browser title
- **User tracking**: `addUserProperties(properties)` - Adds analytics tracking
- **Downtime**: `renderMHVDowntime(props)` - Renders downtime notification
- **Crisis modal**: `openCrisisModal()` - Opens emergency crisis line modal

### Downtime Notifications
- Use `DowntimeNotification` component from `@department-of-veterans-affairs/platform-monitoring/DowntimeNotification`
- Configure with `downtimeNotificationParams.appTitle: 'this medications tool'`

## Development Workflow

### Local Development
- **Mock API**: Start with `yarn mock-api --responses src/platform/mhv/api/mocks/index.js`
- **Dev server**: Run `yarn watch --env entry=medications`
- **Simulate login**: `localStorage.setItem('hasSession', true)` in browser console
- **Access URL**: `http://localhost:3001/my-health/medications`

### Testing Commands
- **Unit tests**: `yarn test:unit --app-folder mhv-medications`
- **Specific test file**: `yarn test:unit path/to/test.unit.spec.js`
- **Coverage**: `yarn test:coverage-app mhv-medications`
- **Cypress GUI**: `yarn cy:open` (requires dev server on port 3001)
- **Cypress CLI**: `yarn cy:run --spec "src/applications/mhv-medications/**/*.cypress.spec.js"`

## Analytics & Monitoring

### Datadog RUM
- **Action Names**: Defined in `util/dataDogConstants.js`
- **Page Types**: `DETAILS`, `LIST`, `REFILL`, `DOCUMENTATION`
- **Common Actions**:
  - `dataDogActionNames.medicationsListPage.*` - List page actions
  - `dataDogActionNames.detailsPage.*` - Details page actions
  - `dataDogActionNames.refillPage.*` - Refill page actions
  - `dataDogActionNames.shared.*` - Shared actions (download, print)

### Privacy & PII/PHI Protection
- **CRITICAL**: All fields that may contain PII/PHI MUST be masked with `data-dd-privacy="mask"`
- Apply masking to:
  - Prescription names and details
  - Patient information
  - Provider names
  - Facility information
- **Action Name Attribute**: Add `data-dd-action-name` to prevent RUM from capturing `innerText`
```jsx
<div 
  data-dd-privacy="mask" 
  data-dd-action-name="prescription-name"
>
  {prescription.prescriptionName}
</div>
```

### Activity Logging
- **landMedicationDetailsAal(prescription)**: Posts activity log for details page views
- Tracks: RX number, RX name, action type, performer

## Common Patterns & Best Practices

### Action Creators
- Use RTK Query mutations for API operations
- For legacy actions, use thunk pattern with `async dispatch =>`

### Accessibility Requirements
- **Standards**: All components must meet WCAG 2.2 AA and Section 508
- **Semantic HTML**: Use proper heading hierarchy, landmark regions
- **ARIA Labels**: Add to all interactive elements
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Focus Management**: Use `focusElement()` from platform utilities

### Code Organization
- **File Naming**:
  - Components: PascalCase (e.g., `PrescriptionsList.jsx`)
  - Utilities: camelCase (e.g., `dateFormat.js`)
  - Tests: Match source with `.unit.spec.jsx` or `.cypress.spec.js`
- **Import Order**:
  1. External libraries (React, Redux, RTK Query)
  2. Platform utilities and components
  3. Local actions, reducers, selectors
  4. Local components
  5. Utilities and constants
  6. Styles
- **Text Content**:
  - **CRITICAL**: Always use right single quotes (') instead of straight single quotes (') for apostrophes in user-facing text
  - Correct: `'You can’t manage this medication in this online tool.'`
  - Incorrect: `'You can't manage this medication in this online tool.'`

## Common Pitfalls & Anti-patterns

### What NOT to Do
- ❌ **Never** hardcode paths, use `medicationsUrls` constants
- ❌ **Never** hardcode status strings, use `dispStatusObj` constants
- ❌ **Never** use moment.js, use date-fns instead
- ❌ **Never** use standard HTML form elements, use VA web components
- ❌ **Never** skip error handling in API calls
- ❌ **Never** forget accessibility requirements
- ❌ **Never** display prescription data without proper PII/PHI masking
- ❌ **Never** access Redux state without `state.rx.` prefix

### Performance Considerations
- ✅ RTK Query handles caching automatically (1 hour cache)
- ✅ Memoize expensive computations with `useMemo`
- ✅ Use `useCallback` for functions passed to child components
- ✅ Prescriptions list uses pagination (10 per page default)

### Memory Leak Prevention
- ✅ Clean up timeouts and intervals in useEffect cleanup
- ✅ RTK Query handles request cancellation on unmount
- ✅ Remove event listeners in cleanup functions

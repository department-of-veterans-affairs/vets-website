---
applyTo: "src/applications/mhv-medical-records/**/*"
---

# MHV Medical Records Application Instructions

## 🔄 Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the mhv-medical-records application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants**: New paths, error messages, alerts, or configuration in `util/constants.js`
- **Create new helper functions**: New utilities in `util/helpers.js` or other utility files
- **Implement new business rules**: Changes to PHR refresh logic, date range filtering, download functionality, etc.
- **Add new action types or actions**: New Redux actions in `util/actionTypes.js` or `actions/` directory
- **Create new reducers or modify state shape**: Changes to Redux state structure
- **Add new shared components**: New reusable components in `components/shared/`
- **Implement new feature flags**: New feature toggles that affect application behavior
- **Add new API endpoints**: New functions in `api/MrApi.js`
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new record types**: New medical record domains or data types
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
- **Entry Name**: `medical-records`
- **Root URL**: `/my-health/medical-records`
- **Entry File**: `app-entry.jsx`
- **Purpose**: Provide veterans with access to their medical records from My HealtheVet (MHV) on VA.gov

## Architecture & State Management

### Redux Structure
- **Root reducer**: Combined reducer at `reducers/index.js` under `mr` namespace
- **Reducer modules**: `allergies`, `breadcrumbs`, `downloads`, `labsAndTests`, `careSummariesAndNotes`, `vaccines`, `vitals`, `conditions`, `sharing`, `alerts`, `refresh`, `pageTracker`, `images`, `blueButton`
- **Action types**: Centralized in `util/actionTypes.js` under `Actions` object with nested namespaces (e.g., `Actions.Allergies.GET`, `Actions.LabsAndTests.GET_LIST`)
- **Selectors**: Defined in `util/selectors.js` for accessing feature flags and state
- **State access pattern**: Always use `state.mr.<reducer>` to access medical records state

### API Layer
- **Backend Service**: This application uses API services provided by **vets-api**
  - Backend controller: Medical Records controllers in vets-api
  - Base path v1: `${environment.API_URL}/my_health/v1`
  - Base path v2: `${environment.API_URL}/my_health/v2` (for accelerated/unified endpoints)
- **API client**: `api/MrApi.js` for medical records endpoints
- **API utilities**: Uses `apiRequest` from `@department-of-veterans-affairs/platform-utilities/exports`
- **Mock responses**: Located in `mocks/` directory
- **API patterns**:
  - All API functions return promises
  - Use async/await in action creators
  - Handle errors with try/catch and dispatch error actions
  - V1 endpoints for legacy VistA/OH data paths
  - V2 endpoints for accelerated SCDF (unified) data paths

## Constants & Configuration

### Core Constants (`util/constants.js`)

#### Record Types
- **recordType**: Main record type constants for the application
  - `ALLERGIES`, `VACCINES`, `CARE_SUMMARIES_AND_NOTES`, `LABS_AND_TESTS`, `VITALS`, `HEALTH_CONDITIONS`
- **recordTypeKeyNames**: Kebab-case names for Datadog RUM IDs
- **labTypes**: Lab and test subtypes
  - `CHEM_HEM`, `MICROBIOLOGY`, `PATHOLOGY`, `RADIOLOGY`, `CVIX_RADIOLOGY`, `OTHER`
- **noteTypes**: Care summary and note types
  - `PHYSICIAN_PROCEDURE_NOTE`, `CONSULT_RESULT`, `DISCHARGE_SUMMARY`, `OTHER`
- **vitalTypes**: Vital sign type mappings with alternate names
- **allergyTypes**: `OBSERVED` and `REPORTED` allergy classifications

#### LOINC Codes
- **loincCodes**: LOINC codes for labs, notes, and vitals
  - Lab codes: `MICROBIOLOGY`, `PATHOLOGY`, `SURGICAL_PATHOLOGY`, `RADIOLOGY`, etc.
  - Vital codes: `BLOOD_PRESSURE`, `BREATHING_RATE`, `HEIGHT`, `TEMPERATURE`, `WEIGHT_1`, `WEIGHT_2`, etc.
- **vitalLoincGroups**: Grouped LOINC codes for each canonical vital type (single source of truth)
- **loincToVitalType**: Maps LOINC codes to canonical vital types (derived from vitalLoincGroups)
- **allowedVitalLoincs**: Flat array of all valid vital LOINC codes

#### Display Constants
- **EMPTY_FIELD**: `'None recorded'` - Use for empty/missing data
- **NONE_RECORDED**: `'None recorded'`
- **NO_INFO_REPORTED**: `'No information reported'`
- **NO_INFO_PROVIDED**: `'No information provided'`
- **interpretationMap**: Maps HL7 observation interpretation codes to display values (e.g., `H` -> `'High'`, `L` -> `'Low'`)
- **vitalTypeDisplayNames**: Display names for vital types
- **vitalUnitDisplayText**: Unit text for vital measurements

#### Paths & Navigation
- **Paths**: Route paths defined in `Paths` object
  ```javascript
  Paths.MYHEALTH: '/my-health'
  Paths.MR_LANDING_PAGE: '/'
  Paths.LABS_AND_TESTS: '/labs-and-tests/'
  Paths.CARE_SUMMARIES_AND_NOTES: '/summaries-and-notes/'
  Paths.VACCINES: '/vaccines/'
  Paths.ALLERGIES: '/allergies/'
  Paths.HEALTH_CONDITIONS: '/conditions/'
  Paths.VITALS: '/vitals/'
  Paths.SETTINGS: '/settings/'
  Paths.DOWNLOAD: '/download/'
  // Vital detail paths
  Paths.BLOOD_PRESSURE: '/vitals/blood-pressure-history'
  Paths.HEART_RATE: '/vitals/heart-rate-history'
  // etc.
  ```
- **Breadcrumbs**: Breadcrumb configurations with `href`, `label`, and `isRouterLink` properties

#### Alert Types
- **ALERT_TYPE_ERROR**: `'error'`
- **ALERT_TYPE_SUCCESS**: `'success'`
- **ALERT_TYPE_IMAGE_STATUS_ERROR**: `'images status error'`
- **ALERT_TYPE_BB_ERROR**: `'blue button download error'`
- **ALERT_TYPE_CCD_ERROR**: `'continuity of care document download error'`

#### PHR Refresh Constants
- **refreshExtractTypes**: Extract types for PHR refresh status
  - `ALLERGY`, `IMAGING`, `VPR`, `CHEM_HEM`
- **EXTRACT_LIST**: Array of actively used extracts
- **VALID_REFRESH_DURATION**: `3600000` (1 hour in milliseconds)
- **STATUS_POLL_INTERVAL**: `2000` (2 seconds)
- **INITIAL_FHIR_LOAD_DURATION**: `120000` (2 minutes)
- **refreshPhases**: Refresh status phases
  - `STALE`, `IN_PROGRESS`, `CURRENT`, `FAILED`, `CALL_FAILED`
- **loadStates**: Data loading states
  - `PRE_FETCH`, `FETCHING`, `FETCHED`

#### Date Range Constants
- **DEFAULT_DATE_RANGE**: `'3'` (last 3 months)
- **MONTH_BASED_OPTIONS**: `['3', '6']` for month-based date range options

#### Download/Blue Button Constants
- **BB_DOMAIN_DISPLAY_MAP**: Maps domain keys to display names for Blue Button reports
- **documentTypes**: `BB` (medical records reports), `CCD` (continuity of care document), `SEI` (self-entered information)
- **studyJobStatus**: Image study request statuses (`NEW`, `QUEUED`, `PROCESSING`, `COMPLETE`, `ERROR`)

### Helper Functions (`util/helpers.js`)

#### Date Formatting
- **dateFormat(timestamp, format)**: Formats dates using moment-timezone
  - Default format: `'MMMM D, YYYY, h:mm a z'`
- **dateFormatWithoutTime(str)**: Removes time portion from formatted date string
- **dateFormatWithoutTimezone(isoString, fmt)**: Format FHIR dateTime as "local datetime" without timezone
  - Handles partial dates: YYYY, YYYY-MM, YYYY-MM-DD, full datetime
  - Returns `null` for invalid inputs
- **formatDate(str)**: Format date string handling year-only and month-only formats
- **formatDateTime(datetimeString)**: Returns `{ formattedDate, formattedTime }`
- **formatDateAndTime(rawDate)**: Returns `{ date, time, timeZone }`
- **formatDateAndTimeWithGenericZone(date)**: Returns formatted date/time with generic timezone (no DST suffix)
- **formatDateInLocalTimezone(date, hideTimeZone)**: Format ISO date in browser's local timezone

#### List/Array Utilities
- **isArrayAndHasItems(obj)**: Returns true if obj is array with items
- **processList(list)**: Join array items with '. ' separator, or return single item
- **itemListWrapper(items)**: Returns `'div'` for multi-item lists, `undefined` otherwise

#### FHIR Resource Utilities
- **extractContainedResource(resource, referenceId)**: Extract contained resource from FHIR resource
- **extractContainedByRecourceType(record, resourceType, referenceArray)**: Extract by resource type from contained array
- **getReactions(record)**: Extract allergy reactions from FHIR record
- **concatObservationInterpretations(record)**: Concatenate observation interpretations with display mapping
- **getObservationValueWithUnits(observation)**: Extract value and units from FHIR Observation

#### Name Formatting
- **nameFormat({ first, middle, last, suffix })**: Format name as "Last, First Middle, Suffix"
- **formatNameFirstToLast(name)**: Convert "Last, First" to "First Last" format

#### Text/File Utilities
- **macroCase(str)**: Convert string to MACRO_CASE (uppercase with underscores)
- **generateTextFile(content, fileName)**: Download text content as file

#### Navigation Utilities
- **getActiveLinksStyle(linkPath, currentPath)**: Returns `'is-active'` for active navigation links
- **removeTrailingSlash(path)**: Remove trailing slash from path string
- **getParamValue(url, paramName)**: Parse parameter value from URL

#### PHR Refresh Utilities
- **getStatusExtractPhase(retrievedDate, phrStatus, extractType)**: Determine refresh phase for an extract
  - Returns: `STALE`, `IN_PROGRESS`, `CURRENT`, `FAILED`, or `null`
  - **CRITICAL**: Order of phase checks matters - STALE > IN_PROGRESS > FAILED > CURRENT
- **getStatusExtractListPhase(retrievedDate, phrStatus, extractTypeList, newRecordsFound)**: Overall phase for multiple extracts
- **getLastSuccessfulUpdate(refreshStateStatus, extractTypeList)**: Get last successful update datetime
- **getLastUpdatedText(refreshStateStatus, extractType)**: Generate "Last updated at..." text

#### Date Range Utilities
- **calculateDateRange(value)**: Calculate fromDate/toDate for month or year value
- **buildInitialDateRange(option)**: Build initial date range object with option, fromDate, toDate
- **resolveAcceleratedDateRange(startDate, endDate, defaultRange)**: Resolve effective date range with fallback
- **getTimeFrame(dateRange)**: Get time frame value for display
- **getDisplayTimeFrame(dateRange)**: Get formatted display string for date range
- **getMonthFromSelectedDate({ date, mask })**: Format YYYY-MM date string
- **getAppointmentsDateRange(fromDate, toDate)**: Calculate clamped date range for appointments

#### Analytics Utilities
- **sendDataDogAction(actionName)**: Send Datadog RUM action
- **sendDatadogError(error, feature)**: Send error to Datadog with feature context
- **handleDataDogAction({ locationBasePath, locationChildPath, sendAnalytics })**: Handle breadcrumb/back button analytics

#### Misc Utilities
- **dispatchDetails(id, list, dispatch, getDetail, actionsGetFromList, actionsGet)**: Helper for retrieving record details
- **focusOnErrorField()**: Focus on first error field in form
- **decodeBase64Report(data)**: Decode base64 report data to UTF-8 string
- **getFailedDomainList(failed, displayMap)**: Format failed domain list with display names

## Business Logic & Requirements

### PHR (Personal Health Record) Refresh System
- **Purpose**: Ensure medical records data is current by checking backend refresh status
- **Implementation**:
  - Poll `getRefreshStatus()` API to check extract freshness
  - Each extract type (ALLERGY, IMAGING, VPR, CHEM_HEM) has its own status
  - Use `useListRefresh` hook to automatically fetch data when refresh completes
  - Show "Last updated at..." text when refresh is current
- **Refresh Phases**:
  1. `STALE`: Data older than `VALID_REFRESH_DURATION` (1 hour)
  2. `IN_PROGRESS`: Backend is actively refreshing data
  3. `CURRENT`: Data is fresh and up-to-date
  4. `FAILED`: Refresh completed but with errors
  5. `CALL_FAILED`: API call to check status failed
- **Phase Priority**: STALE checked first, then IN_PROGRESS, FAILED, finally CURRENT

### Data Loading States
- **loadStates**: Track list fetching progress
  - `PRE_FETCH`: Initial state, no data fetched yet
  - `FETCHING`: Currently fetching data
  - `FETCHED`: Data has been fetched
- **Pattern**: Dispatch `UPDATE_LIST_STATE` with appropriate state before/after API calls

### Accelerated (Unified) Data Path
- **Purpose**: V2 endpoints provide unified data from multiple sources (VistA + Oracle Health)
- **Detection**: Feature flag `mhvMedicalRecordsFilterAndSort` enables accelerated endpoints
- **Backend Correlation**: V2 endpoints correspond to `UnifiedHealthData::Service` in `vets-api`
- **Data Source**: Data comes directly from Oracle Health and Vista through SCDF, bypassing the legacy PHR refresh process
- **Implementation**:
  - Use `getAccelerated*` API functions for v2 endpoints
  - Dispatch `GET_UNIFIED_LIST` or `GET_UNIFIED_ITEM` action types
  - Date range parameters required for accelerated endpoints
  - V2 endpoints typically support backend pagination
- **Fallback**: Non-accelerated users use v1 endpoints with separate VistA/OH paths

### Oracle Health (Cerner) Integration
- **Detection**: Check if user has Cerner facilities
- **Implementation**:
  - Use `*WithOHData` API functions for OH-aware v1 endpoints (e.g., `getAllergiesWithOHData`)
  - Pass `use_oh_data_path=1` query parameter
  - Display `CernerFacilityAlert` component when user has Cerner records
- **CernerAlertContent**: Facility-specific alert content with My VA Health links

### Download Functionality
- **Blue Button Report**: Download medical records as PDF/TXT
  - Uses `blueButtonReducer` for state management
  - Supports date range and record type filtering
  - PDF helpers in `util/pdfHelpers/`
  - TXT helpers in `util/txtHelpers/`
- **CCD (Continuity of Care Document)**: 
  - V1: Two-step process (generate -> poll -> download)
  - V2: Single-step direct download from Oracle Health
  - Formats: HTML, XML, PDF
- **Self-Entered Information (SEI)**: Download user-entered health data

### Image Studies (Radiology)
- **CVIX Integration**: Request and view radiology images from CVIX system
- **Study Status Tracking**:
  - `NEW`, `QUEUED`: Request submitted
  - `PROCESSING`: Request being processed
  - `COMPLETE`: Images available
  - `ERROR`: Request failed
- **Implementation**:
  - `requestImagingStudy(studyId)`: Request image download
  - `getImageList(studyId)`: Get available images for study
  - `getImageRequestStatus()`: Check status of all study requests
- **Rate Limiting**: Track request limits with `SET_REQUEST_LIMIT_REACHED`

### VHIE Sharing Settings
- **Purpose**: Allow veterans to opt-in/out of VA Health Information Exchange
- **API**:
  - `getSharingStatus()`: Get current opt-in/opt-out status
  - `postSharingUpdateStatus(optIn)`: Update sharing preference
- **State**: Managed in `sharing` reducer

## Component Patterns

### Web Components
- **VA Design System Components**: Use lowercase-hyphenated tags
  - `<va-loading-indicator>`, `<va-back-to-top>`, `<va-alert>`, `<va-pagination>`
- **Event Handling**: Web components use custom events (not standard onChange)
- **Shadow DOM**: Web components use shadow DOM - use appropriate selectors in tests

### Lazy Loading
- **Pattern**: All page containers are lazy-loaded using React.lazy
  ```javascript
  const Allergies = lazy(() => import('./containers/Allergies'));
  ```
- **Suspense**: Wrap routes in `<Suspense fallback={<Loading />}>`
- **Loading Component**: Use `<va-loading-indicator>` for loading states

### Container Components (`containers/`)
- Connected to Redux using `useSelector` and `useDispatch`
- Handle routing and page-level logic
- Key containers:
  - `LandingPage`: Medical records home page
  - `Allergies`, `AllergyDetails`: Allergy records
  - `Vaccines`, `VaccineDetails`: Vaccination records
  - `LabsAndTests`, `LabAndTestDetails`: Lab and test results
  - `CareSummariesAndNotes`, `CareSummariesDetails`: Clinical notes
  - `Vitals`, `VitalDetails`: Vital signs history
  - `HealthConditions`, `ConditionDetails`: Health conditions/problems
  - `SettingsPage`: VHIE sharing settings
  - `DownloadReportPage`: Download records interface
  - `RadiologyImagesList`, `RadiologySingleImage`: Radiology images

### Shared Components (`components/shared/`)
- **TrackedSpinner**: Loading spinner with Datadog tracking
- **PrintDownload**: Print and download action buttons
- **PrintHeader**: Header content for printed pages
- **PhrRefresh**: PHR refresh status indicator
- **DateRangeSelector**: Date range filter component
- **NewRecordsIndicator**: Indicator for newly available records
- **NoRecordsMessage**: Empty state message component
- **AccessTroubleAlertBox**: Error alert for access issues
- **CernerFacilityAlert**: Alert for Cerner/Oracle Health facilities
- **LabelValue**: Label-value pair display component
- **ItemList**: List rendering with consistent styling
- **ExternalLink**: External link with proper attributes
- **ScrollToTop**: Scroll to top on route change
- **FeatureFlagRoute**: Route wrapper for feature-flagged content
- **AppRoute**: Custom route wrapper component

### Record List Pattern
- Use `RecordList/` components for consistent list rendering
- Support pagination via `<va-pagination>`
- Include print/download actions
- Show loading states during fetch
- Handle empty states with `NoRecordsMessage`

### Context
- **HeaderSectionContext**: Provides header section state across components
  - Use `HeaderSectionProvider` in App.jsx
  - Access with `useContext(HeaderSectionContext)`

## Custom Hooks

### useListRefresh
- **Purpose**: Automatically fetch and refresh list data based on PHR status
- **Parameters**:
  - `listState`: Current loading state (PRE_FETCH, FETCHING, FETCHED)
  - `listCurrentAsOf`: Date when list was last confirmed current
  - `refreshStatus`: PHR refresh status array
  - `extractType`: Extract type(s) to check (e.g., 'Allergy')
  - `dispatchAction`: Action creator to fetch data
  - `dispatch`: Redux dispatch function
  - `page`: Current page number (for pagination)
  - `useBackendPagination`: Enable backend pagination
  - `checkUpdatesAction`: Action to check for updates
- **Behavior**: Fetches data when refresh is current and local data is stale

### useAlerts
- **Location**: `hooks/use-alerts.js`
- **Purpose**: Manage alert state and display

### useFocusOutline
- **Purpose**: Manage focus outline visibility for accessibility

### useInitialFhirLoadTimeout
- **Purpose**: Handle timeout for initial FHIR data load

### useReloadResetListOnUnmount
- **Purpose**: Reset list state when component unmounts

### useTrackAction
- **Purpose**: Track user actions for analytics

## Testing Patterns

### Unit Tests
- **Testing Framework**:
  - **Do NOT use Jest** - Use Mocha/Chai/Sinon instead
  - Use React Testing Library for component testing
  - Tests located in `tests/` directory with mirrored structure
- **Test Utilities** (`util/testHelper.js`):
  - Helpers for common test scenarios
- **Rendering**:
  - Use `renderWithStoreAndRouter` from `@department-of-veterans-affairs/platform-testing/react-testing-library-helpers`
  - Pass reducer and initial state with `mr` namespace
  ```javascript
  renderWithStoreAndRouter(<Component />, {
    initialState: { mr: { /* state */ } },
    reducers: reducer,
  });
  ```
- **Fixtures**: Located in `tests/fixtures/` directory

### E2E Tests (Cypress)
- **Location**: `tests/e2e/` directory
- **Page Objects**: Located in `tests/e2e/pages/`
- **Test Site Setup**: Use `mr_site/` for site configuration
- **Fixtures**: JSON fixtures in `tests/e2e/fixtures/`
- **Accessibility Testing**:
  - MUST include in all E2E tests
  - Inject axe: `cy.injectAxe()`
  - Run check: `cy.axeCheck()`
- **Naming Convention**: `medical-records-<feature>.cypress.spec.js`

## API Functions (`api/MrApi.js`)

### Session & Refresh
- `createSession()`: Create PHR session
- `getRefreshStatus()`: Get PHR refresh status for all extracts
- `postCreateAAL({ activityType, action, performerType, detailValue, status, oncePerSession })`: Log Account Activity

### Labs and Tests
- `getLabsAndTests()`: Get all labs and tests (v1)
- `getAcceleratedLabsAndTests({ startDate, endDate })`: Get labs with date range (v2)
- `getLabOrTest(id)`: Get single lab/test detail

### Radiology/Imaging
- `getImagingStudies()`: Get CVIX radiology studies list
- `getMhvRadiologyTests()`: Get MHV radiology reports
- `getMhvRadiologyDetails(id)`: Get radiology detail with PHR and CVIX data
- `requestImagingStudy(studyId)`: Request study download from CVIX
- `getImageList(studyId)`: Get images for a study
- `getImageRequestStatus()`: Get status of all image requests
- `getBbmiNotificationStatus()`: Get BBMI notification status

### Care Summaries and Notes
- `getNotes()`: Get all clinical notes (v1)
- `getAcceleratedNotes({ startDate, endDate })`: Get notes with date range (v2)
- `getNote(id)`: Get single note detail
- `getAcceleratedNote(id)`: Get single note detail (v2)

### Vitals
- `getVitalsList()`: Get vitals list (v1)
- `getVitalsWithOHData()`: Get vitals with Oracle Health data (v1 + OH)
- `getVitalsWithUnifiedData()`: Get unified vitals (v2)

### Conditions
- `getConditions()`: Get health conditions (v1)
- `getCondition(id)`: Get condition detail (v1)
- `getAcceleratedConditions()`: Get conditions (v2)
- `getAcceleratedCondition(id)`: Get condition detail (v2)

### Allergies
- `getAllergies()`: Get allergies (v1)
- `getAllergiesWithOHData()`: Get allergies with OH data (v1 + OH)
- `getAllergy(id)`: Get allergy detail (v1)
- `getAllergyWithOHData(id)`: Get allergy detail with OH data
- `getAcceleratedAllergies()`: Get allergies (v2)
- `getAcceleratedAllergy(id)`: Get allergy detail (v2)

### Vaccines
- `getVaccineList(page, useCache)`: Get vaccines with optional pagination
- `getVaccine(id)`: Get vaccine detail
- `getAcceleratedImmunizations()`: Get immunizations (v2)
- `getAcceleratedImmunization(id)`: Get immunization detail (v2)

### Sharing/Settings
- `getSharingStatus()`: Get VHIE opt-in/opt-out status
- `postSharingUpdateStatus(optIn)`: Update sharing status

### Blue Button/Download
- `getMedications()`: Get medications list
- `getAppointments(fromDate, toDate)`: Get appointments in date range
- `getDemographicInfo()`: Get demographic information
- `getMilitaryService()`: Get military service info
- `getPatient()`: Get patient/account summary

### CCD
- `generateCCD()`: Generate CCD document (v1)
- `downloadCCD(timestamp, format)`: Download generated CCD (v1)
- `downloadCCDV2(format)`: Direct CCD download (v2)

### Analytics
- `postRecordDatadogAction(metric, tags)`: Send Datadog metric to backend

## Development Workflow

### Local Development
- **Mock API**: `yarn mock-api --responses src/platform/mhv/api/mocks`
- **Dev server**: `yarn watch --env entry=medical-records`
- **Simulate login**: `localStorage.setItem('hasSession', true)` in browser console
- **CMS Data**: Fetch with `curl -o build/localhost/data/cms/vamc-ehr.json "https://www.va.gov/data/cms/vamc-ehr.json"`
- **Access URL**: `http://localhost:3001/my-health/medical-records`

### Testing Commands
- **Unit tests**: `yarn test:unit --app-folder mhv-medical-records`
- **Specific test**: `yarn test:unit path/to/test.unit.spec.js`
- **Coverage**: `yarn test:unit --app-folder mhv-medical-records --coverage --coverage-html`
- **Cypress GUI**: `yarn cy:open` (filter by `mhv-medical-records`)
- **Cypress CLI**: `yarn cy:run --spec "src/applications/mhv-medical-records/**/**/*"`

## Analytics & Monitoring

### Datadog RUM Configuration
- **Application ID**: `04496177-4c70-4caf-9d1e-de7087d1d296`
- **Service**: `va.gov-mhv-medical-records`
- **Sample Rates**: 50% session, 50% replay
- **Privacy**: `defaultPrivacyLevel: 'mask'`, `enablePrivacyForActionName: true`
- **Configuration**: Set in `App.jsx` with `useDatadogRum()`

### RUM Constants (`util/rumConstants.js`)
- `INITIAL_FHIR_LOAD_DURATION`: Metric for initial FHIR polling duration
- `SPINNER_DURATION`: Metric for spinner display duration
- `RADIOLOGY_DETAILS_MY_VA_HEALTH_LINK`: Action name for My VA Health links

### StatsD Frontend Actions (`statsdFrontEndActions`)
- List calls: `LABS_AND_TESTS_LIST`, `ALLERGIES_LIST`, `VACCINES_LIST`, etc.
- Detail calls: `LABS_AND_TESTS_DETAILS`, `ALLERGIES_DETAILS`, etc.
- Download calls: `DOWNLOAD_BLUE_BUTTON`, `DOWNLOAD_CCD`, `DOWNLOAD_SEI`

### Privacy & PII/PHI Protection
- **CRITICAL**: All input and display fields that may contain PII/PHI MUST be masked
- Use `data-dd-privacy="mask"` on sensitive elements
- Use `data-dd-action-name` to prevent innerText capture

## Feature Flags

### Using Feature Toggles
- **Selectors** (`util/selectors.js`):
  - `selectBypassDowntime`: Bypass downtime notification
  - `selectFilterAndSortFlag`: Enable filter and sort functionality
- **Access Pattern**:
  ```javascript
  const filterAndSortEnabled = useSelector(selectFilterAndSortFlag);
  ```
- **Feature Flag Names**: Import from `platform/utilities/feature-toggles/featureFlagNames`

## Redux State Shape

```javascript
state.mr = {
  allergies: {
    listCurrentAsOf: Date,
    listState: 'PRE_FETCH' | 'FETCHING' | 'FETCHED',
    allergiesList: Array,
    updatedList: Array,
    allergyDetails: Object,
  },
  vaccines: { /* similar structure */ },
  vitals: { /* similar structure */ },
  conditions: { /* similar structure */ },
  labsAndTests: {
    labsAndTestsList: Array,
    labsAndTestsDetails: Object,
    listState: String,
    listCurrentAsOf: Date,
    dateRange: { option, fromDate, toDate },
    imageStatus: Object,
  },
  careSummariesAndNotes: { /* similar structure */ },
  breadcrumbs: { /* breadcrumb array */ },
  alerts: { /* alert objects */ },
  refresh: {
    status: Array, // PHR refresh status list
    phase: String,
    statusPollBeginDate: Date,
    initialFhirLoad: Boolean,
  },
  sharing: {
    status: String,
    loading: Boolean,
  },
  downloads: {
    dateFilter: Object,
    recordFilter: Object,
    fileTypeFilter: String,
  },
  images: {
    imageList: Array,
    imageStudy: Object,
    requestStatus: Object,
  },
  blueButton: {
    data: Object,
    failed: Array,
  },
  pageTracker: { /* page tracking state */ },
}
```

## Common Patterns & Best Practices

### Action Creator Pattern
```javascript
export const getAllergiesList = (
  isCurrent = false,
  isAccelerating = false,
  isCerner = false,
) => async dispatch => {
  dispatch({
    type: Actions.Allergies.UPDATE_LIST_STATE,
    payload: loadStates.FETCHING,
  });
  try {
    let getData;
    let actionType;

    if (isAccelerating) {
      getData = getAcceleratedAllergies;
      actionType = Actions.Allergies.GET_UNIFIED_LIST;
    } else if (isCerner) {
      getData = getAllergiesWithOHData;
      actionType = Actions.Allergies.GET_LIST;
    } else {
      getData = getAllergies;
      actionType = Actions.Allergies.GET_LIST;
    }

    const response = await getListWithRetry(dispatch, getData);
    dispatch({ type: actionType, response, isCurrent });
  } catch (error) {
    dispatch(addAlert(ALERT_TYPE_ERROR, error));
    sendDatadogError(error, 'actions_allergies_getAllergiesList');
  }
};
```

### Reducer Pattern with FHIR Conversion
```javascript
export const convertAllergy = allergy => {
  return {
    id: allergy.id,
    type: isArrayAndHasItems(allergy.category)
      ? allergy.category.join(', ').replace(/^./, char => char.toUpperCase())
      : EMPTY_FIELD,
    name: allergy?.code?.text || EMPTY_FIELD,
    date: allergy?.recordedDate
      ? formatDateLong(allergy.recordedDate)
      : EMPTY_FIELD,
    reaction: getReactions(allergy),
    // ... more fields
  };
};
```

### Breadcrumb Management
- Breadcrumbs managed via Redux (`breadcrumbs` reducer)
- Use `Breadcrumbs` constants for standard configurations
- `MrBreadcrumbs` component renders breadcrumbs

### Downtime Notifications
- Use `DowntimeNotification` component from platform-monitoring
- Configure with `externalServices.mhvMr`, `externalServices.mhvPlatform`, `externalServices.global`
- Use `renderMHVDowntime()` render function
- `downtimeNotificationParams.appTitle`: `'this medical records tool'`

## Common Pitfalls & Anti-patterns

### What NOT to Do
- ❌ **Never** hardcode literal values; use constants instead
- ❌ **Never** skip error handling in async actions
- ❌ **Never** assume a record has a specific field; always check existence
- ❌ **Never** assume an array has elements; always check existence
- ❌ **Never** use moment.js for new code; prefer date-fns
- ❌ **Never** skip Datadog error tracking in catch blocks in Redux action creators

### Performance Considerations
- ✅ Use lazy loading for page containers
- ✅ Implement `useListRefresh` to avoid unnecessary fetches
- ✅ Use `listCurrentAsOf` to track data freshness
- ✅ Memoize expensive computations with `useMemo`
- ✅ Use `useCallback` for functions passed to child components

## Accessibility Requirements
- All components must meet WCAG 2.2 AA and Section 508 standards
- Use `<va-loading-indicator>` with `set-focus` for loading states
- Include `data-testid` attributes for E2E testing
- Run `cy.axeCheck()` in all Cypress tests
- Ensure proper heading hierarchy
- Use `focusOnErrorField()` for form validation errors

## Import Patterns

### Platform Utilities
```javascript
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
```

### MHV Utilities
```javascript
import {
  renderMHVDowntime,
  useDatadogRum,
  setDatadogRumUser,
  MhvSecondaryNav,
  useBackToTop,
} from '@department-of-veterans-affairs/mhv/exports';
```

### Component Library
```javascript
// Web components used directly in JSX
<va-loading-indicator message="Loading..." set-focus />
<va-back-to-top hidden={isHidden} />
<va-pagination page={currentPage} pages={totalPages} />
```

### Local Imports
```javascript
import { Actions } from '../util/actionTypes';
import { Paths, Breadcrumbs, EMPTY_FIELD, loadStates } from '../util/constants';
import { dateFormat, isArrayAndHasItems } from '../util/helpers';
import { getAllergies, getAllergy } from '../api/MrApi';
```

## Quick Reference Examples

### Adding a New Record Type
1. Add constants in `util/constants.js` (recordType, paths, breadcrumbs)
2. Create reducer in `reducers/` with conversion functions
3. Add action types in `util/actionTypes.js`
4. Create actions in `actions/`
5. Add API functions in `api/MrApi.js`
6. Create container and detail components
7. Add routes in `routes.jsx`
8. Add PDF/TXT helpers if downloadable
9. Write unit and E2E tests

### Handling PHR Refresh in a List Component
```javascript
useListRefresh({
  listState,
  listCurrentAsOf,
  refreshStatus: refresh.status,
  extractType: refreshExtractTypes.ALLERGY,
  dispatchAction: getAllergiesList,
  dispatch,
});
```

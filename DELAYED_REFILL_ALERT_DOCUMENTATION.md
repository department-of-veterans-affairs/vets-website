# Delayed Refill Alert Documentation

## Overview
This document explains the backend logic and data flow for the "Some refills are taking longer than expected" alert in the VA Health and Benefits (VAHB) medications application.

## Alert Component
**Location**: `src/applications/mhv-medications/components/shared/DelayedRefillAlert.jsx`

The `DelayedRefillAlert` component displays a warning alert when prescriptions are taking longer than expected to be refilled.

### Component Props
- `dataDogActionName` (string): DataDog tracking identifier for analytics
- `refillAlertList` (array): Array of prescription objects that are taking longer than expected
  - Each object contains:
    - `prescriptionId` (number, required): Unique identifier for the prescription
    - `prescriptionName` (string, required): Display name of the medication

### Visual Presentation
- **Alert Type**: Warning (yellow) alert using VA design system's `VaAlert` component
- **Headline**: "Some refills are taking longer than expected"
- **Content**: List of affected medications as clickable links
- **Sorting**: Medications are sorted alphabetically by prescription name
- **Links**: Each medication links to its detail page (`/prescription/{prescriptionId}`)

## Where the Alert is Displayed

The alert appears in two locations:

1. **Medications List Page** (`src/applications/mhv-medications/containers/Prescriptions.jsx`)
   - Line 165: `const refillAlertList = prescriptionsData?.refillAlertList || [];`
   - Lines 596-608: Renders the alert if `showRefillProgressContent` flag is enabled and `refillAlertList` has items

2. **Refill Prescriptions Page** (`src/applications/mhv-medications/containers/RefillPrescriptions.jsx`)
   - Line 49: `const refillAlertList = refillableData?.refillAlertList || [];`
   - Lines 210-217: Renders the alert if feature flag is enabled and list has items

## Backend Logic and API Integration

### API Endpoints
The alert data comes from two main API endpoints:

1. **Prescriptions List API**
   - Endpoint: `GET /my_health/v1/prescriptions`
   - Returns paginated prescription list with metadata

2. **Refillable Prescriptions API**
   - Endpoint: `GET /my_health/v1/prescriptions/list_refillable_prescriptions`
   - Returns list of prescriptions eligible for refill

### API Response Structure
Both endpoints return a `meta.recentlyRequested` array containing prescriptions that were recently requested for refill:

```json
{
  "data": [...],
  "meta": {
    "recentlyRequested": [
      {
        "id": "123",
        "type": "prescription_details",
        "attributes": {
          "prescriptionId": 123,
          "prescriptionName": "MEDICATION NAME",
          "dispStatus": "Active: Refill in Process" | "Active: Submitted",
          "refillDate": "2024-01-15T00:00:00.000Z",
          "refillSubmitDate": "2024-01-10T00:00:00.000Z",
          "rxRfRecords": [...]
        }
      }
    ]
  }
}
```

### Data Transformation Pipeline

**Location**: `src/applications/mhv-medications/api/prescriptionsApi.js`

1. **API Response Received**: Raw data from backend containing `meta.recentlyRequested` array

2. **Filter Processing** (Line 95-96 and Line 140-141):
   ```javascript
   refillAlertList: filterRecentlyRequestedForAlerts(
     response.meta?.recentlyRequested || [],
   )
   ```

3. **Filtering Function** (`src/applications/mhv-medications/util/helpers/filterRecentlyRequestedForAlerts.js`):
   - Takes the `recentlyRequested` array
   - Converts each prescription using `convertPrescription()`
   - Filters using `isRefillTakingLongerThanExpected()` function
   - Returns only prescriptions that meet the delay criteria

## Core Logic: When is a Refill "Taking Longer Than Expected"?

**Location**: `src/applications/mhv-medications/util/helpers/isRefillTakingLongerThanExpected.js`

A refill is considered delayed when **either** of these conditions is true:

### Condition 1: Refill in Process (Past Expected Date)
```javascript
dispStatus === 'Active: Refill in Process' 
  AND refillDate exists
  AND current date > refillDate
```
**Explanation**: The prescription status shows it's being processed, but the expected fill date (`refillDate`) has already passed.

### Condition 2: Submitted (More than 7 Days Ago)
```javascript
dispStatus === 'Active: Submitted'
  AND refillSubmitDate exists
  AND refillSubmitDate was more than 7 days ago
```
**Explanation**: The refill request was submitted, but it's been more than 7 days and it's still in submitted status (not yet processing).

### Date Fallback Logic
If the top-level `refillDate` or `refillSubmitDate` is not present, the function checks `rxRfRecords[0]` for the dates:
```javascript
if (Array.isArray(rx.rxRfRecords) && rx.rxRfRecords.length > 0) {
  refillDate = refillDate || rx.rxRfRecords[0]?.refillDate;
  refillSubmitDate = refillSubmitDate || rx.rxRfRecords[0]?.refillSubmitDate;
}
```

### Edge Cases Handled
- Returns `false` if prescription object is null/undefined
- Returns `false` if both `refillDate` and `refillSubmitDate` are missing
- Returns `false` if dates cannot be parsed
- Returns `false` if `dispStatus` doesn't match expected values

## Prescription Status Values

**Location**: `src/applications/mhv-medications/util/constants.js`

```javascript
export const dispStatusObj = {
  unknown: 'Unknown',
  active: 'Active',
  refillinprocess: 'Active: Refill in Process',  // Used in alert logic
  submitted: 'Active: Submitted',                // Used in alert logic
  expired: 'Expired',
  discontinued: 'Discontinued',
  transferred: 'Transferred',
  nonVA: 'Active: Non-VA',
  onHold: 'Active: On Hold',
  activeParked: 'Active: Parked',
};
```

## Feature Flag

The alert display is controlled by the `showRefillProgressContent` feature flag:
- **Selector**: `selectRefillProgressFlag` from `src/applications/mhv-medications/util/selectors.js`
- **Behavior**: When enabled, the alert is displayed if `refillAlertList` has items

## How Medication Links are Populated

1. **Backend Signal**: The backend API includes prescriptions in `meta.recentlyRequested` that have been recently requested for refill

2. **Frontend Filtering**: The frontend filters this list to only include prescriptions meeting the "delayed" criteria

3. **Component Rendering**: The `DelayedRefillAlert` component receives the filtered list and:
   - Sorts medications alphabetically by name
   - Creates a Link for each medication pointing to `/prescription/{prescriptionId}`
   - Displays the medication name as the link text

### Link Generation
```jsx
<Link
  id={`refill-alert-link-${rx.prescriptionId}`}
  to={`/prescription/${rx.prescriptionId}`}
  data-dd-action-name={dataDogActionName}
>
  {rx.prescriptionName}
</Link>
```

## Testing

### Unit Tests
- **Component Test**: `tests/components/shared/DelayedRefillAlert.unit.spec.jsx`
- **Logic Test**: `tests/util/helpers/isRefillTakingLongerThanExpected.unit.spec.jsx`

### E2E Tests
Multiple Cypress tests verify alert behavior:
- `medications-alert-longer-than-expected-multiple-refill-list-page.cypress.spec.js`
- `medications-alert-longer-than-expected-rx-refill-page.cypress.spec.js`
- `medications-alert-submitted-refill-delay-details-page.cypress.spec.js`

### Mock Data
**Location**: `src/applications/mhv-medications/mocks/api/mhv-api/prescriptions/index.js`

The mock API (lines 192-286) includes a comprehensive `recentlyRequested` array with edge cases:
- Past refill dates (should trigger alert)
- Recent submit dates (should NOT trigger alert)
- Future refill dates (should NOT trigger alert)
- Null/undefined dates
- Invalid date formats
- Various status combinations

## Data Flow Summary

```
Backend API
    ↓
meta.recentlyRequested (array of prescriptions recently requested)
    ↓
filterRecentlyRequestedForAlerts() - filters by delay criteria
    ↓
refillAlertList (array of delayed prescriptions)
    ↓
DelayedRefillAlert component
    ↓
User sees warning alert with clickable medication links
```

## Key Timeframes

- **Submitted Status**: Alert triggers after **7+ days** in submitted status
- **Refill in Process**: Alert triggers when **current date > expected refillDate**

## Alignment Considerations for Web & Mobile

To align the VAHB app alert with web and mobile implementations, ensure:

1. **Consistent Trigger Logic**: All platforms should use the same time thresholds (7 days for submitted, past refillDate for in-process)

2. **Same API Field Names**: Verify that `dispStatus`, `refillDate`, and `refillSubmitDate` field names match across platforms

3. **Consistent Status Values**: The exact string values for `dispStatus` must match:
   - `"Active: Refill in Process"` (not "Refill In Process" or other variations)
   - `"Active: Submitted"` (not "Submitted" alone)

4. **Feature Flag Naming**: If web/mobile use different flag names, document the mapping

5. **Date Parsing**: Ensure all platforms handle ISO 8601 date strings consistently

6. **Fallback Logic**: All platforms should check `rxRfRecords[0]` for dates if top-level dates are missing

## Related Files

### Core Implementation
- `src/applications/mhv-medications/components/shared/DelayedRefillAlert.jsx` - Alert component
- `src/applications/mhv-medications/util/helpers/isRefillTakingLongerThanExpected.js` - Delay detection logic
- `src/applications/mhv-medications/util/helpers/filterRecentlyRequestedForAlerts.js` - Filtering function
- `src/applications/mhv-medications/api/prescriptionsApi.js` - API integration

### Container Components
- `src/applications/mhv-medications/containers/Prescriptions.jsx` - Medications list page
- `src/applications/mhv-medications/containers/RefillPrescriptions.jsx` - Refill page

### Constants
- `src/applications/mhv-medications/util/constants.js` - Status definitions
- `src/applications/mhv-medications/tests/e2e/utils/constants.js` - Alert text constants

### Tests
- `tests/components/shared/DelayedRefillAlert.unit.spec.jsx`
- `tests/util/helpers/isRefillTakingLongerThanExpected.unit.spec.jsx`
- `tests/e2e/medications-alert-longer-than-expected-*.cypress.spec.js`

## Questions for Alignment

When aligning with web and mobile, verify:

1. Does the backend return `meta.recentlyRequested` to all platforms?
2. Are the field names in the API response identical?
3. Do all platforms use the same time thresholds (7 days, past refillDate)?
4. Are the `dispStatus` string values exactly the same?
5. Do all platforms check the `rxRfRecords` fallback?
6. Is the feature flag available on all platforms?

# Summary: Delayed Refill Alert - VAHB App Alignment

## Your Questions Answered

### Question 1: What backend logic or event triggers this alert?

**Answer**: The alert is triggered by a combination of backend API data and frontend logic:

#### Backend Component:
The backend API (`/my_health/v1/prescriptions`) returns a `meta.recentlyRequested` array containing prescriptions that have been recently requested for refill. This is the initial signal from the backend.

#### Frontend Logic:
The frontend then applies filtering logic to determine which prescriptions should show the alert. A refill is flagged as "taking longer than expected" when **either** condition is met:

1. **Refill in Process Status** - Past Expected Date
   - Status = `"Active: Refill in Process"`
   - AND the `refillDate` has passed (current date > refillDate)
   - **Example**: Expected fill date was Jan 10, but it's now Jan 15 and still processing

2. **Submitted Status** - More than 7 Days Old
   - Status = `"Active: Submitted"`  
   - AND the `refillSubmitDate` was more than 7 days ago
   - **Example**: Submitted on Jan 1, but it's now Jan 10+ and still not in process

#### Key Data Fields from API:
```javascript
{
  "dispStatus": "Active: Refill in Process" | "Active: Submitted",
  "refillDate": "2024-01-15T00:00:00.000Z",      // Expected fill date
  "refillSubmitDate": "2024-01-10T00:00:00.000Z", // When request was submitted
  "rxRfRecords": [...]  // Fallback location for dates if not at top level
}
```

#### Code Locations:
- **API Integration**: `src/applications/mhv-medications/api/prescriptionsApi.js` (lines 95-96, 140-141)
- **Filter Function**: `src/applications/mhv-medications/util/helpers/filterRecentlyRequestedForAlerts.js`
- **Core Logic**: `src/applications/mhv-medications/util/helpers/isRefillTakingLongerThanExpected.js`

---

### Question 2: What logic or data allows the Veteran's affected medications to populate as links within the alert?

**Answer**: The medication links are populated through this data flow:

#### Step-by-Step Process:

1. **Backend Provides List**:
   - API returns `meta.recentlyRequested` array with prescription objects
   - Each prescription includes: `prescriptionId`, `prescriptionName`, `dispStatus`, dates

2. **Frontend Filters**:
   - `filterRecentlyRequestedForAlerts()` function processes the array
   - Only prescriptions meeting the delay criteria are kept
   - Result is stored in `refillAlertList` array

3. **Component Receives Data**:
   - `DelayedRefillAlert` component receives `refillAlertList` prop
   - Each object in the array contains:
     ```javascript
     {
       prescriptionId: 12345,        // Used for link URL
       prescriptionName: "ASPIRIN 81MG" // Used for link text
     }
     ```

4. **Links are Generated**:
   ```jsx
   {refillAlertList.map(rx => (
     <Link to={`/prescription/${rx.prescriptionId}`}>
       {rx.prescriptionName}
     </Link>
   ))}
   ```

5. **Alphabetical Sorting**:
   - Before rendering, medications are sorted alphabetically by `prescriptionName`
   - Uses JavaScript's `localeCompare()` for proper string sorting

#### Example Data Flow:
```
API Response:
meta.recentlyRequested = [
  { prescriptionId: 101, prescriptionName: "ATORVASTATIN", dispStatus: "Active: Submitted", refillSubmitDate: "2024-01-01" },
  { prescriptionId: 202, prescriptionName: "LISINOPRIL", dispStatus: "Active: Refill in Process", refillDate: "2024-01-10" }
]
    ↓
Filtered (on Jan 15, 2024):
refillAlertList = [
  { prescriptionId: 101, prescriptionName: "ATORVASTATIN" },  // 14 days old
  { prescriptionId: 202, prescriptionName: "LISINOPRIL" }      // Past expected date
]
    ↓
Sorted Alphabetically:
[
  { prescriptionId: 101, prescriptionName: "ATORVASTATIN" },
  { prescriptionId: 202, prescriptionName: "LISINOPRIL" }
]
    ↓
Rendered as Links:
- ATORVASTATIN → /prescription/101
- LISINOPRIL → /prescription/202
```

#### Code Locations:
- **Component**: `src/applications/mhv-medications/components/shared/DelayedRefillAlert.jsx`
- **Sorting Logic**: Lines 9-15 in DelayedRefillAlert.jsx
- **Link Generation**: Lines 31-48 in DelayedRefillAlert.jsx
- **Data Source**: Container pages pass `refillAlertList` as prop

---

## Critical Details for Web/Mobile Alignment

### 1. Time Thresholds
- **Submitted Status**: 7 days (not 5, not 10 - exactly 7)
- **Refill in Process**: When current date > expected `refillDate`

### 2. Exact Status String Values (case-sensitive!)
- `"Active: Refill in Process"` (with colon, capital letters)
- `"Active: Submitted"` (with colon, capital letters)

### 3. Date Fields to Check
Primary fields:
- `refillDate` - Expected fill date for "Refill in Process" status
- `refillSubmitDate` - Submission date for "Submitted" status

Fallback location (if primary fields are null):
- `rxRfRecords[0].refillDate`
- `rxRfRecords[0].refillSubmitDate`

### 4. Feature Flag
- The alert display is controlled by `showRefillProgressContent` feature flag
- Must be enabled for alert to show

### 5. API Field Names
Ensure these exact field names are used across all platforms:
- `prescriptionId` (not `id` or `rxId`)
- `prescriptionName` (not `name` or `medicationName`)
- `dispStatus` (not `status` or `dispensingStatus`)
- `refillDate` (not `fillDate` or `expectedDate`)
- `refillSubmitDate` (not `submitDate` or `requestDate`)

---

## Where to Find the Code

### Core Alert Logic:
1. **isRefillTakingLongerThanExpected.js** - The delay detection algorithm (34 lines)
2. **filterRecentlyRequestedForAlerts.js** - Filters API data (19 lines)
3. **DelayedRefillAlert.jsx** - The alert component UI (64 lines)

### Integration Points:
1. **prescriptionsApi.js** - API transformation (lines 95-96, 140-141)
2. **Prescriptions.jsx** - List page integration (line 165, 596-608)
3. **RefillPrescriptions.jsx** - Refill page integration (line 49, 210-217)

### Tests:
1. **Unit tests**: Test the delay detection logic with edge cases
2. **E2E tests**: Verify alert displays correctly with mock data
3. **Mock API**: Includes comprehensive test data with various scenarios

---

## Recommendation for Alignment

To ensure consistency across web and mobile:

1. **Document the API Contract**: Create a formal spec for the `meta.recentlyRequested` structure
2. **Share Constants**: Consider a shared constants package for status values and time thresholds
3. **Unified Logic**: If possible, extract the delay detection logic to a shared utility
4. **Test Coverage**: Run the same test scenarios on all platforms
5. **Visual Consistency**: Ensure alert styling matches across platforms (currently uses VA design system's warning alert)

---

## Questions to Ask Your Backend Team

1. Is `meta.recentlyRequested` available in all API versions?
2. Are the field names consistent across all API consumers?
3. How is the `recentlyRequested` list populated? (What makes a prescription "recently requested"?)
4. Is there a maximum age for prescriptions in `recentlyRequested`?
5. Can the status values ever vary (e.g., different capitalization)?

---

## Quick Reference: The Two Conditions

```javascript
// Condition 1: Refill in Process - Past Date
if (dispStatus === "Active: Refill in Process" && Date.now() > Date.parse(refillDate)) {
  return true; // Show alert
}

// Condition 2: Submitted - Over 7 Days
const sevenDaysAgo = new Date().setDate(new Date().getDate() - 7);
if (dispStatus === "Active: Submitted" && Date.parse(refillSubmitDate) < sevenDaysAgo) {
  return true; // Show alert
}

return false; // Don't show alert
```

---

For complete technical details, see `DELAYED_REFILL_ALERT_DOCUMENTATION.md`.

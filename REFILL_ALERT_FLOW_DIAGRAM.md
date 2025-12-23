# Visual Flow Diagram: Delayed Refill Alert

## High-Level Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         Backend API                               │
│  /my_health/v1/prescriptions                                     │
│  /my_health/v1/prescriptions/list_refillable_prescriptions       │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │   API Response Structure       │
         │                               │
         │  {                            │
         │    data: [...],               │
         │    meta: {                    │
         │      recentlyRequested: [     │
         │        {                      │
         │          prescriptionId,      │
         │          prescriptionName,    │
         │          dispStatus,          │
         │          refillDate,          │
         │          refillSubmitDate,    │
         │          rxRfRecords: [...]   │
         │        }                      │
         │      ]                        │
         │    }                          │
         │  }                            │
         └───────────┬───────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────┐
    │ RTK Query Transform Response           │
    │ (prescriptionsApi.js)                  │
    │                                        │
    │ Lines 95-96 or 140-141:                │
    │   refillAlertList:                     │
    │     filterRecentlyRequestedForAlerts() │
    └────────────────┬───────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────────────────┐
    │ filterRecentlyRequestedForAlerts()                  │
    │ (filterRecentlyRequestedForAlerts.js)              │
    │                                                     │
    │ For each prescription in recentlyRequested:        │
    │   1. Convert prescription format                   │
    │   2. Check if taking longer than expected          │
    │   3. If yes, add to alert list                     │
    └────────────────┬───────────────────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────────────────────────────────┐
    │ isRefillTakingLongerThanExpected()                          │
    │ (isRefillTakingLongerThanExpected.js)                      │
    │                                                             │
    │ ┌─────────────────────────────────────────────────────┐   │
    │ │ Condition 1: Refill in Process                      │   │
    │ │   ✓ dispStatus = "Active: Refill in Process"       │   │
    │ │   ✓ refillDate exists                               │   │
    │ │   ✓ Current date > refillDate                       │   │
    │ │   → SHOW ALERT                                      │   │
    │ └─────────────────────────────────────────────────────┘   │
    │                         OR                                  │
    │ ┌─────────────────────────────────────────────────────┐   │
    │ │ Condition 2: Submitted Over 7 Days                  │   │
    │ │   ✓ dispStatus = "Active: Submitted"               │   │
    │ │   ✓ refillSubmitDate exists                         │   │
    │ │   ✓ refillSubmitDate was > 7 days ago              │   │
    │ │   → SHOW ALERT                                      │   │
    │ └─────────────────────────────────────────────────────┘   │
    └────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │   refillAlertList         │
         │   (filtered array)        │
         │                           │
         │   [                       │
         │     {                     │
         │       prescriptionId,     │
         │       prescriptionName    │
         │     },                    │
         │     ...                   │
         │   ]                       │
         └───────────┬───────────────┘
                     │
                     ├──────────────┬──────────────┐
                     │              │              │
                     ▼              ▼              ▼
         ┌───────────────┐  ┌──────────────┐  ┌──────────┐
         │ Prescriptions │  │   Refill     │  │ Feature  │
         │  List Page    │  │Prescriptions │  │   Flag   │
         │               │  │     Page     │  │          │
         │ Line 165      │  │   Line 49    │  │ Enabled? │
         └───────┬───────┘  └──────┬───────┘  └────┬─────┘
                 │                 │                │
                 └────────┬────────┴────────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │  DelayedRefillAlert     │
              │  Component              │
              │  (DelayedRefillAlert.jsx)│
              └───────────┬─────────────┘
                          │
                          ▼
              ┌─────────────────────────┐
              │  Sort Alphabetically    │
              │  by prescriptionName    │
              └───────────┬─────────────┘
                          │
                          ▼
              ┌─────────────────────────────────────────┐
              │  Render VA Alert Component               │
              │                                          │
              │  ⚠️  Some refills are taking longer      │
              │      than expected                       │
              │                                          │
              │  Go to your medication details to find   │
              │  out what to do next:                    │
              │                                          │
              │  🔗 ATORVASTATIN 10MG                    │
              │  🔗 LISINOPRIL 20MG                      │
              │  🔗 METFORMIN 500MG                      │
              └──────────────────────────────────────────┘
```

## Detailed Logic Flow for isRefillTakingLongerThanExpected()

```
┌─────────────────────────────────┐
│   Input: Prescription Object     │
│   {                              │
│     dispStatus,                  │
│     refillDate,                  │
│     refillSubmitDate,            │
│     rxRfRecords                  │
│   }                              │
└────────────┬────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │  Is rx null?       │
    │                    │───Yes──▶ Return false
    └────────┬───────────┘
             │ No
             ▼
    ┌─────────────────────────────────┐
    │  Get refillDate from:            │
    │  1. rx.refillDate (primary)     │
    │  2. rxRfRecords[0]?.refillDate  │
    │     (fallback)                  │
    └────────┬────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────┐
    │  Get refillSubmitDate from:     │
    │  1. rx.refillSubmitDate         │
    │  2. rxRfRecords[0]?.             │
    │     refillSubmitDate            │
    └────────┬────────────────────────┘
             │
             ▼
    ┌──────────────────────────────┐
    │  Do both dates exist?         │
    │  refillDate &&                │
    │  refillSubmitDate             │
    └────────┬─────────────────────┘
             │ No
             │──────────▶ Return false
             │ Yes
             ▼
    ┌─────────────────────────────────────────┐
    │  Check Condition 1:                      │
    │  dispStatus === "Active: Refill in       │
    │                  Process"                │
    │  AND                                     │
    │  Date.now() > Date.parse(refillDate)    │
    └────────┬────────────────────────────────┘
             │ True
             │──────────▶ Return true (ALERT!)
             │ False
             ▼
    ┌─────────────────────────────────────────┐
    │  Check Condition 2:                      │
    │  dispStatus === "Active: Submitted"     │
    │  AND                                     │
    │  Date.parse(refillSubmitDate) <         │
    │    (Date.now() - 7 days)                │
    └────────┬────────────────────────────────┘
             │ True
             │──────────▶ Return true (ALERT!)
             │ False
             ▼
        Return false (no alert)
```

## Timeline Example: When Alert Shows

### Scenario 1: Refill in Process - Past Expected Date

```
Timeline:
─────────────────────────────────────────────────────▶
        Jan 5          Jan 10        Jan 15    Jan 17
         │              │             │          │
         │              │             │          │
    Submit        Expected       Current     (still
    Refill      Refill Date       Date      processing)
    Request
    
    dispStatus changes:
    Jan 5:  "Active: Submitted"
    Jan 6:  "Active: Refill in Process"
    Jan 17: Still "Active: Refill in Process"
    
    Alert Status:
    Jan 5-10:  ✗ No alert (processing normally)
    Jan 11+:   ✓ ALERT! (past expected date)
```

### Scenario 2: Submitted - Over 7 Days

```
Timeline:
─────────────────────────────────────────────────────▶
        Jan 1         Jan 8           Jan 10
         │             │                │
         │             │                │
    Submit        7 Days           Current
    Refill         Later            Date
    Request
    
    dispStatus:
    Jan 1-10: "Active: Submitted" (still in submitted)
    
    Alert Status:
    Jan 1-8:   ✗ No alert (< 7 days)
    Jan 9+:    ✓ ALERT! (> 7 days in submitted)
```

## Component Rendering Flow

```
DelayedRefillAlert Component
├── Props Received
│   ├── dataDogActionName: string
│   └── refillAlertList: Array[
│       {prescriptionId, prescriptionName}
│   ]
│
├── Processing
│   └── sortPrescriptionsByName()
│       └── Sort by prescriptionName using localeCompare
│
└── Rendering
    ├── VaAlert (status="warning")
    │   ├── Headline: "Some refills are taking longer..."
    │   ├── Instructions: "Go to your medication details..."
    │   └── For each sorted prescription:
    │       └── <Link to={`/prescription/${rx.prescriptionId}`}>
    │           {rx.prescriptionName}
    │           </Link>
    └── End
```

## Data Structure at Each Stage

### 1. API Response (meta.recentlyRequested)
```javascript
[
  {
    id: "12345",
    type: "prescription_details",
    attributes: {
      prescriptionId: 12345,
      prescriptionName: "ATORVASTATIN 10MG",
      dispStatus: "Active: Refill in Process",
      refillDate: "2024-01-10T00:00:00.000Z",
      refillSubmitDate: "2024-01-05T00:00:00.000Z",
      // ... other fields
    }
  }
]
```

### 2. After convertPrescription() & filtering
```javascript
[
  {
    prescriptionId: 12345,
    prescriptionName: "ATORVASTATIN 10MG",
    dispStatus: "Active: Refill in Process",
    refillDate: "2024-01-10T00:00:00.000Z",
    // ... converted structure
  }
]
```

### 3. refillAlertList (simplified for component)
```javascript
[
  {
    prescriptionId: 12345,
    prescriptionName: "ATORVASTATIN 10MG"
  },
  {
    prescriptionId: 67890,
    prescriptionName: "LISINOPRIL 20MG"
  }
]
```

### 4. After Sorting (alphabetical)
```javascript
[
  {
    prescriptionId: 12345,
    prescriptionName: "ATORVASTATIN 10MG"  // A comes first
  },
  {
    prescriptionId: 67890,
    prescriptionName: "LISINOPRIL 20MG"    // L comes after A
  }
]
```

## Integration Points in Container Components

### Prescriptions.jsx (List Page)
```javascript
// Line 165: Get data from API response
const refillAlertList = prescriptionsData?.refillAlertList || [];

// Lines 596-608: Render if conditions met
const renderDelayedRefillAlert = () => {
  if (!showRefillProgressContent) return null;  // Feature flag check
  if (!refillAlertList?.length) return null;    // Has data check
  
  return (
    <DelayedRefillAlert
      dataDogActionName={dataDogActionNames.medicationsListPage.REFILL_ALERT_LINK}
      refillAlertList={refillAlertList}
    />
  );
};
```

### RefillPrescriptions.jsx (Refill Page)
```javascript
// Line 49: Get data from API response
const refillAlertList = refillableData?.refillAlertList || [];

// Lines 210-217: Conditional rendering
{showRefillProgressContent &&
  refillAlertList.length > 0 && (
    <DelayedRefillAlert
      dataDogActionName={dataDogActionNames.refillPage.REFILL_ALERT_LINK}
      refillAlertList={refillAlertList}
    />
  )}
```

## Key Takeaways

1. **Backend provides candidates** via `meta.recentlyRequested`
2. **Frontend filters** using time-based logic
3. **Two conditions** trigger the alert:
   - Refill in Process past expected date
   - Submitted for over 7 days
4. **Component receives** minimal data (id + name)
5. **Sorted alphabetically** before display
6. **Links generated** to prescription detail pages
7. **Feature flag** controls visibility

---

See `DELAYED_REFILL_ALERT_DOCUMENTATION.md` for complete technical details.
See `REFILL_ALERT_SUMMARY.md` for quick answers to common questions.

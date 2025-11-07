# HTTP Requests - MHV Medications App

This document lists all HTTP requests made by the mhv-medications client application.

All requests use the base URL from `environment.API_URL` and target the `/my_health/v1` API version.

## Prescriptions API

Base path: `/my_health/v1/prescriptions`

HTTP methods and paths:

```
GET    /my_health/v1/prescriptions
GET    /my_health/v1/prescriptions/{id}
GET    /my_health/v1/prescriptions/list_refillable_prescriptions
GET    /my_health/v1/prescriptions/{id}/documentation
PATCH  /my_health/v1/prescriptions/{id}/refill
PATCH  /my_health/v1/prescriptions/refill_prescriptions
GET    /my_health/v1/medical_records/allergies
GET    /my_health/v1/medical_records/allergies/{id}
GET    /my_health/v1/tooltips
POST   /my_health/v1/tooltips
PATCH  /my_health/v1/tooltips/{tooltipId}
POST   /my_health/v1/aal
```

### GET Requests

#### 1. Get Prescriptions List (paginated)
```
GET /my_health/v1/prescriptions?page={page}&per_page={perPage}&{sortEndpoint}&{filterOption}&include_image={bool}
```
- **Purpose**: Retrieve paginated list of prescriptions
- **Parameters**:
  - `page`: Page number (default: 1)
  - `per_page`: Items per page (default: 10)
  - `sortEndpoint`: Sorting criteria
  - `filterOption`: Filter criteria (optional)
  - `include_image`: Boolean to include prescription images (optional)
- **Source**: `prescriptionsApi.js` - `getPrescriptionsList`

#### 2. Get Prescriptions Export List
```
GET /my_health/v1/prescriptions?{filterOption}{sortEndpoint}{includeImage}
```
- **Purpose**: Retrieve complete list of prescriptions for export (no pagination)
- **Parameters**:
  - `filterOption`: Filter criteria (optional)
  - `sortEndpoint`: Sorting criteria
  - `includeImage`: Boolean to include prescription images (optional)
- **Source**: `prescriptionsApi.js` - `getPrescriptionsExportList`

#### 3. Get Prescription by ID
```
GET /my_health/v1/prescriptions/{id}
```
- **Purpose**: Retrieve details for a single prescription
- **Parameters**:
  - `id`: Prescription ID
- **Source**: `prescriptionsApi.js` - `getPrescriptionById`

#### 4. Get Refillable Prescriptions
```
GET /my_health/v1/prescriptions/list_refillable_prescriptions
```
- **Purpose**: Retrieve list of prescriptions eligible for refill
- **Source**: `prescriptionsApi.js` - `getRefillablePrescriptions`

#### 5. Get Prescription Documentation
```
GET /my_health/v1/prescriptions/{id}/documentation
```
- **Purpose**: Retrieve Krames health documentation HTML for a prescription
- **Parameters**:
  - `id`: Prescription ID
- **Source**: `prescriptionsApi.js` - `getPrescriptionDocumentation`

### PATCH Requests

#### 6. Refill Single Prescription
```
PATCH /my_health/v1/prescriptions/{id}/refill
```
- **Purpose**: Request a refill for a single prescription
- **Parameters**:
  - `id`: Prescription ID
- **Source**: `prescriptionsApi.js` - `refillPrescription`

#### 7. Bulk Refill Prescriptions
```
PATCH /my_health/v1/prescriptions/refill_prescriptions?ids[]={id1}&ids[]={id2}...
```
- **Purpose**: Request refills for multiple prescriptions
- **Parameters**:
  - `ids[]`: Array of prescription IDs
- **Source**: `prescriptionsApi.js` - `bulkRefillPrescriptions`

## Allergies API

Base path: `/my_health/v1/medical_records/allergies`

### GET Requests

#### 8. Get All Allergies
```
GET /my_health/v1/medical_records/allergies
```
- **Purpose**: Retrieve list of all allergies
- **Source**: `allergiesApi.js` - `getAllergies`

#### 9. Get Allergy by ID
```
GET /my_health/v1/medical_records/allergies/{id}
```
- **Purpose**: Retrieve details for a single allergy
- **Parameters**:
  - `id`: Allergy ID
- **Source**: `allergiesApi.js` - `getAllergyById`

## Tooltips API

Base path: `/my_health/v1/tooltips`

**Note**: All tooltip requests include the custom header `X-Key-Inflection: camel`

### GET Requests

#### 10. Get Tooltips List
```
GET /my_health/v1/tooltips
```
- **Purpose**: Retrieve list of tooltips
- **Headers**:
  - `Content-Type: application/json`
  - `X-Key-Inflection: camel`
- **Source**: `rxApi.js` - `getTooltipsList`

### POST Requests

#### 11. Create Tooltip
```
POST /my_health/v1/tooltips
```
- **Purpose**: Create a new tooltip
- **Headers**:
  - `Content-Type: application/json`
  - `X-Key-Inflection: camel`
- **Body**:
  ```json
  {
    "tooltip": {
      "tooltipName": "string",
      "hidden": false
    }
  }
  ```
- **Source**: `rxApi.js` - `createTooltip`

### PATCH Requests

#### 12. Hide Tooltip
```
PATCH /my_health/v1/tooltips/{tooltipId}
```
- **Purpose**: Update tooltip to hidden state
- **Parameters**:
  - `tooltipId`: Tooltip ID
- **Headers**:
  - `Content-Type: application/json`
  - `X-Key-Inflection: camel`
- **Body**:
  ```json
  {
    "tooltip": {
      "hidden": true
    }
  }
  ```
- **Source**: `rxApi.js` - `apiHideTooltip`

#### 13. Increment Tooltip Counter
```
PATCH /my_health/v1/tooltips/{tooltipId}?increment_counter=true
```
- **Purpose**: Increment the view counter for a tooltip
- **Parameters**:
  - `tooltipId`: Tooltip ID
  - `increment_counter=true`: Query parameter
- **Headers**:
  - `Content-Type: application/json`
  - `X-Key-Inflection: camel`
- **Note**: Counter only increments if session is unique (handled by API)
- **Source**: `rxApi.js` - `incrementTooltipCounter`

## Activity Logging API

Base path: `/my_health/v1/aal`

### POST Requests

#### 14. Log Medication Details View
```
POST /my_health/v1/aal
```
- **Purpose**: Log user activity when viewing medication details page
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "aal": {
      "activityType": "RxRefill",
      "action": "View Medication Detail Page",
      "detailValue": "RX #: {prescriptionNumber} RX Name: {prescriptionName}",
      "performerType": "Self",
      "status": "1"
    },
    "product": "rx",
    "oncePerSession": true
  }
  ```
- **Source**: `rxApi.js` - `landMedicationDetailsAal`

## Implementation Notes

- **API Base Path**: All endpoints use `${environment.API_URL}/my_health/v1` as the base
- **RTK Query**: Prescriptions and allergies use Redux Toolkit Query (`@reduxjs/toolkit/query/react`)
- **Caching**: Prescriptions API has a 1-hour cache (`keepUnusedDataFor: 60 * 60`)
- **Error Handling**: All APIs include standardized error handling
- **Platform Utilities**: Uses `@department-of-veterans-affairs/platform-utilities/exports` for `apiRequest` and `environment`

## Historical Endpoints (Removed)

The following endpoints appeared in legacy test code but are not present in the current mhv-medications application. They were used only as mocked E2E test helpers and have been removed from the working tree.

```
GET  /v0/prescriptions/preferences
PUT  /v0/prescriptions/preferences
```

History:
- Added in commit `f3b0ea2ecc` (2017-05-16) within legacy Rx E2E test helpers to mock retrieving and updating prescription email notification preferences.
- Removed in commit `a09f44760e` (2019-01-04) as part of cleaning up unused health tools code.

Notes:
- These were mock definitions (not production API calls) and no longer exist anywhere in current source files.
- Searches of the current codebase confirm no live usage of `prescriptions/preferences` paths.

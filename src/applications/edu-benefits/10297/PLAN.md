# 10297 Prefill Alignment with TOE

## Objective

Align the 10297 form prefill setup with the TOE (Transfer of Entitlement) application by:
1. Hooking up claimant data from the MEB API as the primary data source
2. Using `vapContactInfo` as a fallback when claimant data is not available

## Files to Create/Modify

### 1. Create `actions.js`

**Path:** `src/applications/edu-benefits/10297/actions.js`

Add action to fetch claimant info from the MEB API:
- `FETCH_PERSONAL_INFORMATION` - dispatched when fetch starts
- `FETCH_PERSONAL_INFORMATION_SUCCESS` - dispatched on successful response
- `FETCH_PERSONAL_INFORMATION_FAILED` - dispatched on error
- `fetchPersonalInformation()` - async action that calls `/meb_api/v0/forms_claimant_info`

### 2. Update `reducers/index.js`

**Path:** `src/applications/edu-benefits/10297/reducers/index.js`

Add a `data` reducer to store claimant info:
- Store API response in `state.data.formData`
- Track fetch status with `personalInfoFetchInProgress` and `personalInfoFetchComplete`

### 3. Update `App.jsx`

**Path:** `src/applications/edu-benefits/10297/containers/App.jsx`

- Connect component to Redux with `connect()`
- Dispatch `fetchPersonalInformation` when user is logged in
- Add state tracking to prevent duplicate fetches

### 4. Update `prefill-transformer.js`

**Path:** `src/applications/edu-benefits/10297/config/prefill-transformer.js`

Update to use claimant data as primary source with vapContactInfo fallback:

**Data Priority:**
1. **Primary:** `state.data?.formData?.data?.attributes?.claimant`
2. **Fallback:** `state.user.profile.vapContactInfo`

**Fields to prefill from claimant data:**
- `firstName`, `lastName`, `middleName`, `suffix` → `applicantFullName`
- `dateOfBirth` → `dateOfBirth`
- `contactInfo.emailAddress` → `contactInfo.emailAddress`
- `contactInfo.mobilePhoneNumber` → `contactInfo.mobilePhone`
- `contactInfo.homePhoneNumber` → `contactInfo.homePhone`
- `contactInfo.addressLine1`, `city`, `stateCode`, `zipCode`, `countryCode` → `mailingAddress`

## Data Flow

```
User logs in
    ↓
App.jsx dispatches fetchPersonalInformation()
    ↓
API call to /meb_api/v0/forms_claimant_info
    ↓
Reducer stores response in state.data.formData
    ↓
Prefill transformer reads:
  - claimant data (primary)
  - vapContactInfo (fallback)
    ↓
Form is prefilled with user data
```

## Claimant Data Structure (from TOE reference)

```javascript
state.data.formData.data.attributes.claimant = {
  claimantId: string,
  firstName: string,
  middleName: string,
  lastName: string,
  suffix: string,
  dateOfBirth: string, // "YYYY-MM-DD"
  notificationMethod: string, // "EMAIL" | "TEXT"
  contactInfo: {
    emailAddress: string,
    mobilePhoneNumber: string,
    homePhoneNumber: string,
    addressLine1: string,
    addressLine2: string,
    city: string,
    stateCode: string,
    zipCode: string,
    countryCode: string,
    addressType: string, // "DOMESTIC" | "MILITARY_OVERSEAS" | etc.
  }
}
```

## vapContactInfo Fallback Structure

```javascript
state.user.profile.vapContactInfo = {
  email: { emailAddress: string },
  mobilePhone: { areaCode: string, phoneNumber: string, isInternational: boolean },
  homePhone: { areaCode: string, phoneNumber: string, isInternational: boolean },
  mailingAddress: {
    addressLine1: string,
    addressLine2: string,
    city: string,
    stateCode: string,
    zipCode: string,
    countryCode: string,
  }
}
```

## Implementation Notes

- No feature flags needed since 10297 is not live yet
- Keep the existing phone number format (`{callingCode, countryCode, contact}`) used in 10297
- Keep the existing bank account prefill logic unchanged
- Return `state` in the transformer output for consistency with TOE

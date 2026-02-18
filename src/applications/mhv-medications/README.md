# MHV Medications

## Quick start to get running locally

Before you get started check [this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment) first to make sure you are setup to use the correct version of Node and Yarn.

- clone vets-website repo `git clone git@github.com:department-of-veterans-affairs/vets-website.git`
- run `yarn install`
- start app `yarn --cwd $( git rev-parse --show-toplevel ) watch --env entry=medications`
- turn on local mocks `yarn --cwd $( git rev-parse --show-toplevel ) mock-api --responses src/applications/mhv-medications/mocks/api/index.js`
- Run this in your browser console to simulate being logged in `localStorage.setItem('hasSession', true);`
- visit the app: `http://localhost:3001/my-health/medications`

## Running tests

Unit tests for can be run using this command: `yarn test:unit --app-folder mhv-medications`. To get detailed errors, run this command with `--log-level=error`. To get coverage reports run this command `yarn test:unit --app-folder mhv-medications --coverage --coverage-html`. View the report at `/coverage/index.html`

Cypress tests can be run with the GUI using this command: `yarn cy:open`. From there you can filter by `mhv-medications` to run just medications end to end tests.

Run Cypress from command line:

- Run all `yarn cy:run --spec "src/applications/mhv-medications/**/**/*"`
- Specify browser `-b electron`

# Developer Setup for Vets Website (Front-End) on a Fresh Mac

Created to walk users through setting up the `vets-website` project with Node, Yarn, NVM, and mock APIs.

---

## Cloning the Vets Website Repository

Start by cloning the repository via SSH:

```bash
git clone git@github.com:department-of-veterans-affairs/vets-website.git
cd vets-website
```

---

## Installing and Configuring NVM (Node Version Manager)

### 1. Add NVM initialization to `.zshrc`

Open or create the `.zshrc` file in your home directory:

```bash
vim ~/.zshrc
```

Add the following lines to the file:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

Save and close the file, then reload your terminal or run:

```bash
source ~/.zshrc
```

---

### 2. Install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

> After installation, restart your terminal or run `source ~/.zshrc` again to use NVM.

---

### 3. Install Node

Install the required Node.js version:

```bash
nvm install 22.22.0
nvm alias default 22.22.0
```

---

## Installing Yarn

Install the correct version of Yarn globally:

```bash
npm install -g yarn@1.19.1
```

Verify installed versions:

```bash
node --version    # Should output: v22.22.0
yarn --version    # Should output: 1.19.1
```

---

## Installing Project Dependencies

Install all JavaScript dependencies using Yarn:

```bash
yarn install
```

---

## Running the Local App and Mocks

To start the local environment, use two separate terminal windows:

### 1. Start the Frontend App

```bash
yarn --cwd $( git rev-parse --show-toplevel ) watch --env entry=medications
```

### 2. Start the Local Mock API

```bash
yarn --cwd $( git rev-parse --show-toplevel ) mock-api --responses src/applications/mhv-medications/mocks/api/index.js
```

---

## Simulating a Logged-In User (Browser Console)

To simulate a login session, open your browser’s Developer Console and run:

```js
localStorage.setItem('hasSession', true);
```

Then visit the medications page in your browser:

```
http://localhost:3001/my-health/medications
```

---

## Running Cypress E2E Tests

To run a specific end-to-end test file using Cypress:

```bash
yarn cy:run --spec "src/applications/mhv-medications/tests/e2e/medications-list-page-meds-by-mail-content.cypress.spec.js"
```

---

## Optional Developer Aliases

Add the following aliases to your `.zshrc` file to streamline development:

```bash
# Start the front-end with the medications entry
alias watch='yarn --cwd $( git rev-parse --show-toplevel ) watch --env entry=medications'

# Run the local mock API server
alias mock='yarn --cwd $( git rev-parse --show-toplevel ) mock-api --responses src/applications/mhv-medications/mocks/api/index.js'

# Run unit tests for the medications app with coverage reports
alias utests='yarn test:unit --app-folder mhv-medications --coverage --coverage-html'

# Run all e2e tests under mhv-medications
alias e2e='yarn cy:run --spec "src/applications/mhv-medications/**/**/*"'
```

After saving, reload your shell:

```bash
source ~/.zshrc
```

---

## You're Done!

Your Vets Website local setup is now complete. You can:

- Start the front-end with `watch`
- Run mock APIs with `mock`
- Simulate login with `localStorage.setItem('hasSession', true);`
- Run tests with `utests` or `e2e`

> For further information, refer to the [vets-website GitHub README](https://github.com/department-of-veterans-affairs/vets-website#readme)


## Front End Prescription Object Guide

### Overview

When working on the MHV Medications team, understanding the prescription object is important for developing new features or working with existing ones. The 'Prescription' object holds data about prescriptions as they move from the MHV API to vets-api and then to vets-website. This document explains each field's name, purpose, usage context, and examples. It covers how the data appears on the front end and traces field names back through vets-api and the MHV rxrefill API, including cases where field renames obscure the original data meaning (see [⚠️ Misleading Field Names](#️-misleading-field-names)).

### Table of Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [Field Descriptions and Transformations](#field-descriptions-and-transformations)
  - [Front End Prescription Object](#front-end-prescription-object)
  - [Tracking List Object](#tracking-list-object)
  - [Vets-api and MHV API Field Mappings](#vets-api-and-mhv-api-field-mappings)
  - [⚠️ Misleading Field Names](#️-misleading-field-names)

### Purpose

This document was created to help front-end developers understand the prescription object and identify which fields to use for new features and which ones are currently in use. It also helps improve communication between developers working on different parts of the stack by clarifying the names used for the same fields across the MHV rxrefill Java API, vets-api Ruby layer, and vets-website front end.

### Field Descriptions and Transformations

#### Front End Prescription Object

| Front End Field | Data Type | Example Value | Description | Usage Context |
|--|--|--|--|--|
| `prescriptionId` | number | `22625964` | Unique ID for each prescription record in the database This ID is different from the [prescriptionNumber](#prescription-number), which specifically identifies medications | Use this ID to search for and retrieve prescription details |
| <span id="prescription-number">`prescriptionNumber`</span> | string | `"2720466B"` | A specific identifier for medications, known as the prescription number | Primarily used in the UI to display the prescription number |
| <span id="prescription-name">`prescriptionName`</span> | string | `"ABACAVIR SO4 600MG/LAMIVUDINE 300MG TAB"` | The name of the medication | Shown in the UI on list and details pages If a non-VA prescription doesn't have a `prescriptionName`, use the [orderableItem](#orderable-item) field instead |
| `prescriptionImage` (not in use) | string | `"BASE_64_STRING"` | A Base-64 encoded image of the medication | This was once used to add images to PDFs but isn't used anymore due to safety concerns with including images in PDFs |
| `refillStatus` | string | `"active"` | The status of a prescription ("Active", "Inactive", etc) | Used as the primary key for PDF/TXT status definition lookups and for detecting pending medications/renewals (`neworder`/`renew` values). Also used in print layouts. [dispStatus](#disp-status) is preferred for rendering status-specific UI content in the browser |
| <span id="refill-submit-date">`refillSubmitDate`</span> | string/date | `"2024-02-29T14:47:25000Z"` | The date when a refill request was submitted | Used across multiple status contexts: displayed in the process list for Shipped, Submitted, Refill in Process, and Active statuses (step 1: "We received your refill request"). Also used for refill button suppression (hidden for 15 days after submission) and to detect delayed refills (> 7 days old) |
| `refillDate` | string/date | `"2024-01-28T05:00:00000Z"` | ⚠️ Despite the name, this is actually the **last fill date** — the date the pharmacy most recently filled/dispensed the prescription (VistA RDT[5], File 52,102.1). It was renamed from `lastFillDate` in the MHV rxrefill API | Displayed in the UI when the prescription status is 'RefillInProcess' with the text "We expect to fill this prescription on {refillDate}". Also used in delay detection logic to determine if a refill is taking longer than expected (current date > refillDate). **Note:** The UI text implies a future date, but this field contains a past date |
| `refillRemaining` | number | `3` | The number of refills left for a prescription | Display the number of refills remaining for a specific prescription |
| `facilityName` | string | `"Dayton Medical Center"` | The name of the medical facility where the prescription was issued | Display this name in the UI to inform users about the origin of the prescription |
| <span id="ordered-date">`orderedDate`</span> | string/date | `"2023-10-31T04:00:00000Z"` | The date on which the prescription was first issued (VistA "Issue Date", renamed from `issueDateTime` in the MHV API) | Displayed on VA prescription details pages. For Non-VA prescriptions, displayed as "Documented on {orderedDate}" rather than "prescribed". Also used in conditional logic for date-based calculations |
| `quantity` | number | `30` | The total number of medication units prescribed, such as pills or applications | Display this number in the UI to clearly show how much medication a prescription includes |
| `expirationDate` | string/date | `"2024-10-31T04:00:00000Z"` | ⚠️ The expiration **or cancel** date of the medication. If the Rx was canceled, this may be the cancel date rather than the expiration date (VistA RDT[7] "Expiration/Cancel Date", renamed from `expirationCancelDate`) | Display this date in the UI to show when the medication expires |
| <span id="dispensed-date">`dispensedDate`</span> | string/date | `"2024-10-31T04:00:00000Z"` | ⚠️ Despite the name, this is actually the pharmacy **release date** (VistA RDT[6]), not the VistA dispensed date (RDT[22]). Renamed from `releaseDateTime` in the MHV API | Use the [sortedDispensedDate](#sorted-dispensed-date) field first, when available. Use this field as a fallback. ProcessList.jsx also pulls from `rxRfRecords[0].dispensedDate` as a source for the most recent dispensed date |
| <span id="station-number">`stationNumber`</span> | string | `"998"` | The unique identifier used to determine facilities | Not displayed visually to users, but **functionally critical** — used for API routing (especially for Oracle Health/Cerner), URL parameter management (`?stationNumber=`), and prescription matching during bulk refills |
| `isRefillable` | boolean | `true` | Whether a prescription can be refilled | **Critical UI field** — controls whether the refill button is rendered, filters which prescriptions appear on the refill page, and gates refill-related UI elements on detail and list pages |
| `isRenewable` (not currently available) | boolean | `true` | Whether a prescription can be renewed | This field would most likely not be used in the UI, but can be used for searching or filtering |
| `isTrackable` | boolean | `true` | Whether a prescription can be tracked | This field would most likely not be used in the UI, but can be used for searching or filtering |
| <span id="cmop-ndc-number">`cmopNdcNumber`</span> | string | `"00013264681"` | The CMOP NDC number (unique identifier for medications) | This field would most likely not be used in the UI, but has been used to get a prescription image and retrieve medication insert information for a specific medication |
| `inCernerTransition` (not in use) | boolean | `true` | Determines if the prescription belongs to a facility transitioning to Cerner | This field is not currently used but could be used to display Cerner-specific messaging for specific prescriptions |
| `notRefillableDisplayMessage` (not in use) | string | `"A refill request cannot be submitted at this time Please review the prescription status and fill date If you need more of this medication, please call the pharmacy phone number on your prescription label"` | The message to be displayed when a prescription isn't refillable | This field should not be used in the UI or on VA.gov This was previously used on MHV classic to display the message in the UI |
| `sig` | string | `"TAKE 1 DAILY FOR 30 DAYS"` | Instructions for a prescription | Display instructions for a prescription in the UI |
| <span id="cmop-division-phone">`cmopDivisionPhone`</span> | string | `"(783)272-1072"` | The formatted phone number for a facility | Components use `pharmacyPhoneNumber(rx)` helper which resolves in order: (1) `cmopDivisionPhone`, (2) [dialCmopDivisionPhone](#dial-cmop-division-phone), (3) `rxRfRecords[].cmopDivisionPhone`, (4) `rxRfRecords[].dialCmopDivisionPhone` |
| `userId` (not in use) | number | `17621060` | The ID of the user associated with a prescription | This field is not currently used in the UI and will most likely not be used in the future |
| `providerFirstName` | string | `"JOHN"` | The first name of the doctor who prescribed the medication | Use this field to show the first name of the doctor who prescribed the medication |
| `providerLastName` | string | `"SMITH"` | The last name of the doctor who prescribed the medication | Use this field to show the last name of the doctor who prescribed the medication |
| `remarks` | string | `"RENEWED FROM RX # 2720412A"` | The remarks from a provider (up to 200 characters) when processing or discontinuing prescriptions | Currently used to show part of the "provider notes" for a prescription |
| `divisionName` (not in use) | string | `"DAYTON"` | The division name for the facility (a subdivision of [stationNumber](#station-number)) | This field is currently not in use and there are no current plans to use this field in the future |
| `modifiedDate` (not in use) | string/date | `"2024-07-01T14:50:05000Z"` | The date for when this record was last updated | This field is currently not in use and there are no current plans to use this field in the future |
| `institutionId` (not in use) | number | `10` | The ID to the facility where the prescription came from | This field is currently not in use and there are no current plans to use this field in the future |
| <span id="dial-cmop-division-phone">`dialCmopDivisionPhone`</span> | string | `"00172-4266-70"` | The unformatted facility phone number | Second in the `pharmacyPhoneNumber()` resolution chain — see [cmopDivisionPhone](#cmop-division-phone). Also checked on `rxRfRecords` entries as the final fallback |
| <span id="disp-status">`dispStatus`</span> | string | `"Active"` | The status of a prescription (Active, Inactive, etc) for the UI | Used to show the status of a medication in the UI and show status-specific content |
| `ndc` (not in use) | string | `"00172-4266-70"` | The NDC number associated with a prescription | This field is not in use and there are no current plans to use this field in the future. Use [cmopNdcNumber](#cmop-ndc-number) for NDC-related lookups |
| `reason` (not in use) | string | `"Rash and other nonspecific skin irritation"` | The reason for a prescription | This field is currently not in use and there are no current plans to use this field in the future. Use [indicationForUse](#indication-for-use) to display the indication for use |
| `prescriptionNumberIndex` (not in use) | string | unknown | A value that helps determine the order for a specific refill (Ex. "RX", "RF1", "RF2") | This field is currently not in use and there are no current plans to use this field in the future |
| `prescriptionSource` | string | `"RX"` | A value that determines the source of a prescription. For example, if the prescription is a refill, original fill, or "Non-VA" prescription | Checked for three key values: `NV` (Non-VA — controls Non-VA-specific UI and labels), `PD` (Pending Dispense — controls pending med/renewal UI on cards and details), and `PF` (Partial Fill — used in print/refill history views) |
| `disclaimer` | string | `"Non-VA medication recommended by VA provider"` | A disclaimer note made by a provider | Used to show part of the "provider notes" for a prescription |
| <span id="indication-for-use">`indicationForUse`</span> | string | `"relieves coughs"` | A valid reason to use a certain prescription | This field is currently used to show the "reason for use" noted by a provider |
| `indicationForUseFlag` (not in use) | string/boolean | `"1"` | If an `indicationForUse` field exists | This field is currently not in use and there are no current plans to use this field in the future |
| `category` (not in use) | string | `"Documented By VA"` | The "category" of a medication | This field is not in use and there are no current plans to use this field in the future. The options are `"Documented By VA"` if the prescription is Non-VA, otherwise `"Rx Medication"`. This was a field used by MHV classic and will most likely not be used |
| <span id="orderable-item">`orderableItem`</span> | string | `"HALCINONIDE"` | A fallback prescription name for Non-VA prescriptions | Used only as a fallback option if the [prescriptionName](#prescription-name) field does not exist. This should continue to be used only as a fallback for Non-VA prescriptions |
| <span id="sorted-dispensed-date">`sortedDispensedDate`</span> | string/date | `"2024-06-17"` | The [dispensedDate](#dispensed-date) field using the current sort order | Used in the UI to represent the date a prescription was dispensed The [dispensedDate](#dispensed-date) field should be used as a fallback |
| <span id="shape">`shape`</span> | string | `"OVAL"` | The shape of a prescription (when applicable) | Used along with [color](#color), [frontImprint](#front-imprint) and [backImprint](#back-imprint) to describe a prescription |
| <span id="color">`color`</span> | string | `"WHITE"` | The color of a prescription | Used along with [shape](#shape), [frontImprint](#front-imprint) and [backImprint](#back-imprint) to describe a prescription |
| <span id="front-imprint">`frontImprint`</span> | string | `"TEVA;3147"` | The information printed on the front of a prescription | Used along with [shape](#shape), [color](#color) and [backImprint](#back-imprint) to describe a prescription |
| <span id="back-imprint">`backImprint`</span> | string | `"12"` | The information printed on the back of a prescription | Used along with [shape](#shape), [frontImprint](#front-imprint) and [color](#color) to describe a prescription |
| `trackingList` | array | See [Tracking List Object Example](#tracking-list-object-example) | An array of tracking data for a prescription | Used to display tracking information for a prescription |
| `rxRfRecords` | array | Array of Prescription objects | An array of refill history data | This field is used to display refill history data for a prescription. **NOTE:** The object at index `0` is the most recent refill |
| `tracking` (not in use) | boolean | `true` | Indicates if a prescription has tracking information | This field is currently not in use and there are no current plans to use this field in the future |

#### Tracking List Object

| Front End Field | Example Value | Data Type | Description | Usage Context |
|--|--|--|--|--|
| `carrier` | `"USPS"` | string | The shipping carrier used for the delivery | Used to show which carrier is handling the shipment |
| `completeDateTime` | `"2024-05-28T04:39:11-04:00"` | string/date | The date and time when the shipment was completed | To display or log when the shipment was finalized |
| `dateLoaded` (not in use) | `"2024-04-21T16:55:19-04:00"` | string/date | The date and time when the shipment was processed | To track when the shipment was loaded for transport |
| `divisionPhone` (not in use) | `"(401)271-9804"` | string | The phone number of the facility that shipped the prescription | Use when needing to show the facility phone number |
| `id` (not in use) | `9878` | number | A unique identifier for the tracking record | This field will most likely never be displayed in the UI, but could be useful for searching |
| `isLocalTracking` (not in use) | `false` | boolean | Indicates if the tracking is managed locally | This field will most likely never be displayed in the UI, but could be useful for filtering |
| `ndc` (not in use) | `"00113002240"` | `string` | The National Drug Code associated with the item | This field will most likely never be displayed in the UI. We commonly use [cmopNdcNumber](#cmop-ndc-number) instead, but could be useful for searching |
| `othersInSamePackage` (not in use) | `false` | boolean | Indicates if other items are in the same package | Not used currently, but could be useful to show/filter if multiple items are shipped under one tracking number |
| `rxNumber` (not in use) | `2719780` | number | Prescription number associated with the shipment | This field will most likely never be displayed in the UI, but could be useful for searching |
| `stationNumber` (not in use) | `995` | number | Identifier for the facility from which the prescription came from | This field will most likely never be displayed in the UI, but could be useful for searching/filtering |
| `trackingNumber` | `"332980271979930000002300"` | string | The tracking number assigned to the shipment | Used to show the tracking number in the UI |
| `viewImageDisplayed` (not in use) | `false` | boolean | Indicates if an image of the item was displayed | This field isn't currently used and there are no plans to use it in the future |

#### Vets-api and MHV API Field Mappings

> **MHV API Field** = the actual JSON key returned by the MHV rxrefill Java API (camelCase, over the wire).
> **MHV DTO Field** = the internal Java DTO field name before the API renames it. Where these differ, the rename may obscure the data's original meaning.
> Fields marked ⚠️ have a name that misrepresents the underlying data — see notes below the table.

| Front End Field | Vets-API Field | MHV API Field | MHV DTO Field | Notes |
|--|--|--|--|--|
| `prescriptionId` | `prescription_id` | `prescriptionId` | `id` | MHV database primary key, not a VistA identifier |
| `prescriptionNumber` | `prescription_number` | `prescriptionNumber` | `prescriptionNumber` | |
| `prescriptionName` | `prescription_name` | `prescriptionName` | `drugName` | Renamed from `drugName` |
| `prescriptionImage` (not in use) | `prescription_image` | none | none | |
| `refillStatus` | `refill_status` | `refillStatus` | `status` | Renamed from generic `status` |
| `refillSubmitDate` | `refill_submit_date` | `refillSubmitDate` | `lastRefillSubmittedDate` | MHV app-level field (not from VistA) |
| `refillDate` | `refill_date` | `refillDate` | `lastFillDate` | ⚠️ Renamed from `lastFillDate` — actually the date pharmacy last filled/dispensed the Rx (VistA RDT[5]), not a future refill date |
| `refillRemaining` | `refill_remaining` | `refillRemaining` | `numberOfRefills` | Renamed from `numberOfRefills` |
| `facilityName` | `facility_api_name` | `facilityName` / `facilityApiName` | `institution.name` | vets-api prefers `facilityApiName` when present, falls back to `facilityName` |
| `orderedDate` | `ordered_date` | `orderedDate` | `issueDateTime` | Renamed from `issueDateTime` (VistA RDT[4]) |
| `quantity` | `quantity` | `quantity` | `quantity` | |
| `expirationDate` | `expiration_date` | `expirationDate` | `expirationCancelDate` | ⚠️ Renamed from `expirationCancelDate` — may be a cancel date, not an expiration date |
| `dispensedDate` | `dispensed_date` | `dispensedDate` | `releaseDateTime` | ⚠️ Renamed from `releaseDateTime` (VistA RDT[6] Release Date). The actual VistA `dispensedDate` (RDT[22]) exists on the DTO but is not mapped to this field |
| `stationNumber` | `station_number` | `stationNumber` | `institution.stationNumber` | |
| `isRefillable` | `is_refillable` | `isRefillable` | `refillable` | Jackson serializes `getIsRefillable()` as `isRefillable` |
| `isRenewable` | `is_renewable` | `isRenewable` | unknown | Detail endpoint only |
| `isTrackable` | `is_trackable` | `isTrackable` | none | Computed by MHV API |
| `cmopNdcNumber` | `cmop_ndc_number` | `cmopNdcNumber` | `cmopNdcNumber` | |
| `inCernerTransition` (not in use) | `in_cerner_transition` | `inCernerTransition` | none | Computed by MHV API |
| `notRefillableDisplayMessage` (not in use) | `not_refillable_display_message` | `notRefillableDisplayMessage` | none | Computed by MHV API |
| `sig` | `sig` | `sig` | `sig` | Complex HL7 parsing: non-renew uses RDT[50], renew uses RDT[65] |
| `cmopDivisionPhone` | `cmop_division_phone` | `cmopDivisionPhone` | `cmopDivisionPhone` | |
| `userId` (not in use) | `user_id` | `userId` | `userId` | Detail endpoint only |
| `providerFirstName` | `provider_first_name` | `providerFirstName` | `providerFirstName` | Detail endpoint only |
| `providerLastName` | `provider_last_name` | `providerLastName` | `providerLastName` | Detail endpoint only |
| `remarks` | `remarks` | `remarks` | `remarks` | Detail endpoint only |
| `divisionName` (not in use) | `division_name` | `divisionName` | `divisionName` | Detail endpoint only |
| `modifiedDate` (not in use) | `modified_date` | `modifiedDate` | `modifiedDate` | Detail endpoint only |
| `institutionId` (not in use) | `institution_id` | `institutionId` | `institutionId` | Detail endpoint only |
| `dialCmopDivisionPhone` | `dial_cmop_division_phone` | `dialCmopDivisionPhone` | `dialCmopDivisionPhone` | Detail endpoint only |
| `dispStatus` | `disp_status` | `dispStatus` | computed | Display-formatted status; detail endpoint only |
| `ndc` (not in use) | `ndc` | `ndc` | `ndc` | Detail endpoint only |
| `reason` (not in use) | `reason` | `reason` | `reason` | Detail endpoint only |
| `prescriptionNumberIndex` | `prescription_number_index` | `prescriptionNumberIndex` | `prescriptionNumberIndex` | Detail endpoint only |
| `prescriptionSource` | `prescription_source` | `prescriptionSource` | `prescriptionSource` | Detail endpoint only |
| `disclaimer` | `disclaimer` | `disclaimer` | `disclaimer` | Detail endpoint only |
| `indicationForUse` | `indication_for_use` | `indicationForUse` | `indicationForUse` | Detail endpoint only |
| `indicationForUseFlag` (not in use) | `indication_for_use_flag` | `indicationForUseFlag` | `indicationForUseFlag` | Detail endpoint only |
| `category` | `category` | `category` | `category` | Detail endpoint only |
| `orderableItem` | `orderable_item` | `orderableItem` | `orderableItem` | Detail endpoint only |
| `sortedDispensedDate` | `sorted_dispensed_date` | none | none | Computed by vets-api, not from MHV API |
| `shape` | `shape` | `shape` | `shape` | Detail endpoint only |
| `color` | `color` | `color` | `color` | Detail endpoint only |
| `frontImprint` | `front_imprint` | `frontImprint` | `frontImprint` | Detail endpoint only |
| `backImprint` | `back_imprint` | `backImprint` | `backImprint` | Detail endpoint only |
| `trackingList` | `tracking_list` | `trackingList` | none | Nested object; detail endpoint only |
| `rxRfRecords` | `rx_rf_records` | `rxRFRecords` | none | Nested object; detail endpoint only |
| `tracking` (not in use) | `tracking` | `tracking` | `isTracking` | Jackson serializes `isTracking()` as `tracking`; detail endpoint only |

##### ⚠️ Misleading Field Names

| Field | API Name | Actual Data Source | Why It's Misleading |
|--|--|--|--|
| `refillDate` | `refillDate` | VistA `lastFillDate` (RDT[5], File 52,102.1) | Name implies a future refill date. Actually the **last fill date** — when the pharmacy most recently filled the prescription. |
| `dispensedDate` | `dispensedDate` | VistA `releaseDateTime` (RDT[6]) | Named "dispensed" but actually the pharmacy **release date**. The real VistA `dispensedDate` (RDT[22]) exists on the DTO but is never exposed. |
| `expirationDate` | `expirationDate` | VistA `expirationCancelDate` (RDT[7]) | Could be the **cancel date** rather than the expiration date if the Rx was canceled. |

## Application Architecture

### Routing and Data Flow

The MHV Medications application architecture combines React Router, Redux Toolkit Query (RTK Query), and Redux for state management. Here's how the different pieces work together:

#### Route Structure

The application uses React Router V6 (via the v5-compat package) and implements route-based code splitting with lazy loading:

```jsx
// Key routes
/                           // Prescriptions list
/refill                     // Refill prescriptions
/prescription/:id           // Prescription details
/prescription/:id/documentation  // Prescription documentation
```

All routes are wrapped in an `AppWrapper` component that:
- Handles access control via `useMyHealthAccessGuard`
- Provides the app container and layout
- Implements lazy loading with Suspense

#### Data Loading Pattern

The application uses a loader pattern to coordinate data fetching:

1. **Route Loaders**: Each route can specify a loader function that pre-fetches required data
2. **RTK Query Integration**: Loaders use RTK Query endpoints to fetch data
3. **Deferred Loading**: The `defer` utility from React Router allows showing UI while data loads

For example, the prescriptions list page:
```javascript
// Route definition
{
  path: '/',
  element: <AppWrapper Component={Prescriptions} />,
  loader: (...args) => {
    return Promise.all([prescriptionsLoader(...args)]);
  }
}
```

#### RTK Query and Redux Integration

The application uses RTK Query for API calls and caching:

1. **API Slices**: Separate API slices for prescriptions and allergies
2. **Automatic Hooks**: RTK Query generates hooks like `useGetPrescriptionsListQuery`
3. **Transformations**: API responses are transformed into consistent formats
4. **Caching**: RTK Query handles caching and invalidation automatically

Example data flow:
1. User visits prescriptions list
2. Router calls the prescriptionsLoader
3. Loader dispatches RTK Query actions
4. RTK Query makes API calls and caches responses
5. Components access data via generated hooks

#### State Management

The application uses a hybrid approach to state management:

- **Server State**: Managed by RTK Query (prescriptions, allergies)
- **UI State**: Managed by Redux (sorting, filtering preferences)
- **Route State**: Managed by React Router (current page, IDs)

#### Performance Optimizations

1. **Code Splitting**: Components are lazy loaded with React.lazy
2. **Suspense**: Loading states are handled with Suspense boundaries
3. **Deferred Loading**: Non-critical data is loaded after initial render
4. **Caching**: RTK Query provides automatic caching and revalidation

#### Access Control

Access to the application is protected by:
1. `useMyHealthAccessGuard` hook
2. Integration with VA.gov authentication
3. Route-level access control in the AppWrapper


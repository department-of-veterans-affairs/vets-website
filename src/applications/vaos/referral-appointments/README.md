# Community Care Direct Scheduling

Allows Veterans to self-schedule appointments for community care referrals.

This feature is part of the Appointments app and integrates with the appointments list routing component for entry into the feature.

[`src/applications/vaos/appointment-list/index.jsx`](../appointment-list/index.jsx)

More documentation: https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/health-care/appointments/va-online-scheduling/engineering/architecture/community-care-technical-documentation.md

## Get started

1. Start the dev server:
   ```
   yarn watch --env entry=vaos
   ```

2. Start the mock API server:
   ```
   yarn mock-api --responses src/applications/vaos/services/mocks/index.js
   ```

3. Navigate to `http://localhost:3001/my-health/appointments` and click on the "Review referrals and requests" link

## Business rules

- Vets-api does not currently send referrals if they are expired
- Only the first appointment can be directly scheduled
- If there are appointments already booked, the app will not let you continue with scheduling
- Only certain types of care are allowed other referral types are filtered from the list view on the frontend [src/applications/vaos/referral-appointments/utils/referrals.js](utils/referrals.js)


## Local testing and test scenarios

Different referral IDs in the mock data test various error states. Each referral ID is configured to trigger specific errors for testing purposes.

### Error Test Scenarios

You can find referrals that test error scenarios at the bottom of the referral list. Hover over the links to schedule and you should see a link with an error ID in it, for example: `?id=draft-no-slots-error`.

The following referral UUIDs are configured to test specific error conditions:

| Referral UUID | Error Scenario | Test Link |
| ------------- | -------------- | --------- |
| `appointment-submit-error` | Tests error handling when submitting an appointment | [Test locally](http://localhost:3001/my-health/appointments/schedule-referral?id=appointment-submit-error) |
| `details-retry-error` | Tests retry logic for referral details | [Test locally](http://localhost:3001/my-health/appointments/schedule-referral?id=details-retry-error) |
| `details-error` | Tests general error handling for referral details | [Test locally](http://localhost:3001/my-health/appointments/schedule-referral?id=details-error) |
| `draft-no-slots-error` | Tests error when no appointment slots are available | [Test locally](http://localhost:3001/my-health/appointments/schedule-referral?id=draft-no-slots-error) |
| `referral-without-provider-error` | Tests referrals that don't have an assigned provider | [Test locally](http://localhost:3001/my-health/appointments/schedule-referral?id=referral-without-provider-error) |
| `eps-error-appointment-id` | Tests EPS (appointment system) error handling | [Test locally](http://localhost:3001/my-health/appointments/schedule-referral?id=eps-error-appointment-id) |
| `out-of-pilot-station` | Tests referrals from stations not in the pilot program (Station ID: 123) | [Test locally](http://localhost:3001/my-health/appointments/schedule-referral?id=out-of-pilot-station) |

Error responses can be found in the mock responses file: [`src/applications/vaos/services/mocks/index.js`](../services/mocks/index.js)

## Pilot Sites

Pilot access is limited to certain stations based on station IDs.

The feature visibility is controlled in two stages:
1. If a user's facilities don't include a pilot station, they won't see the feature
2. When scheduling, referrals are checked against valid station IDs to ensure they can proceed

Due to three-character station ID limitations in user objects, users from station 657 are initially allowed into the feature, but their specific referral station IDs are validated before allowing scheduling to proceed.

Pilot logic is implemented in: [`src/applications/vaos/referral-appointments/utils/pilot.js`](utils/pilot.js)

### Staging Sites
| Station Number | Station Name|
| --------------| -------------|
| 983 | Staging |
| 984 | Staging |

### Original Pilot Sites

| Station Number | Station Name |
| ------------- | ------------- |
| 659 | W.G. (Bill) Hefner Salisbury Department of Veterans Affairs Medical Center |
| 659BY | TBD |
| 659BZ | TBD |
| 659GA | TBD |
| 657 | John J. Cochran Veterans Hospital |
| 657A5 | Marion VA Medical Center |
| 657GJ | TBD |
| 657GK | TBD |
| 657GL | TBD |
| 657GM | TBD |
| 657GO | TBD |
| 657GP | TBD |
| 657GQ | TBD |
| 657GR | TBD |
| 657GT | TBD |
| 657GU | TBD |
| 657QD | TBD |

### Portland Pilot Expansion

| Station Number | Station Name |
| ------------- | ------------- |
| 648 | Portland VA Medical Center |
| 648A4 | Vancouver VA Medical Center |
| 648GA | Robert D. Maxwell Department of Veterans Affairs Clinic |
| 648GB | Salem VA Clinic |
| 648GD | Astoria VA Clinic |
| 648GE | Fairview VA Clinic |
| 648GF | Hillsboro VA Clinic |
| 648GG | West Linn VA Clinic |
| 648GH | Newport VA Clinic |
| 648GI | Portland VA Clinic |
| 648GJ | Loren R. Kaufman VA Clinic |
| 648GK | Lincoln City VA Clinic |

## Running tests

### Unit tests
```bash
# Run all unit tests for the VAOS app
yarn test:unit --app-folder vaos

# Run unit tests with coverage
yarn test:unit --app-folder vaos --coverage

# Run unit tests with HTML coverage report
yarn test:unit --app-folder vaos --coverage --coverage-html
```

### Cypress E2E tests
```bash
# Open Cypress test runner
yarn cy:open

# Run Cypress tests from command line
yarn cy:run --spec "src/applications/vaos/tests/e2e/**/*.cypress.spec.js"

# Run only Community Care referral tests
yarn cy:run --spec "src/applications/vaos/tests/e2e/**/referral*.cypress.spec.js"
```

**Note:** Before running Cypress tests, ensure the dev server is running on port 3001 with `yarn watch --env entry=vaos` and that the mock service is not running. Cypress has its own intercepts.

### Screenshots

Screenshots are disabled by default during test runs to speed up regular e2e testing. To capture screenshots, pass the `--env screenshots=vaos` flag:

```bash
yarn cy:run --env screenshots=vaos --spec "src/applications/vaos/tests/e2e/**/referral*.cypress.spec.js"
```

After the command completes, screenshots are saved to the `cypress/screenshots` folder at the root of the project. Each Cypress test file gets its own subfolder containing all screenshots from that file:

```
cypress/screenshots/
├── referral-appointments.cypress.spec.js/
│   ├── referrals-and-requests-page-with-referrals.png
│   ├── referral-detail-page.png
│   ├── referral-selecting-slot-times-selected-slot.png
│   ├── referral-review-page.png
│   └── referral-complete-page.png
├── referral-api-errors.cypress.spec.js/
│   ├── referrals-list-api-error-500.png
│   ├── referral-detail-api-error-500.png
│   └── ...
└── referral-details-api-errors.cypress.spec.js/
    └── ...
```

## Technical details

### Redux Toolkit Query (RTK Query)
This feature uses RTK Query for API state management. The main API slice is defined in:
- [`src/applications/vaos/redux/api/vaosApi.js`](../redux/api/vaosApi.js)

RTK Query documentation: https://redux-toolkit.js.org/rtk-query/overview

### Mock Service Worker (MSW)
Some unit tests use MSW for API mocking. Examples can be found in:
- [`src/applications/vaos/referral-appointments/ReferralsAndRequests.unit.spec.jsx`](ReferralsAndRequests.unit.spec.jsx)

MSW documentation: https://mswjs.io/


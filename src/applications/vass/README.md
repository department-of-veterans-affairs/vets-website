# VASS

The VASS (Veteran Affairs Solid Start) project allows veterans to self schedule and cancel appointments with VASS system through a api layer in vets-api.

## URL
http://localhost:3001/service-member/benefits/solid-start/schedule
https://staging.va.gov/service-member/benefits/solid-start/schedule

## Common commands
```bash
# Development
yarn watch --env entry=vass
yarn watch --env entry=vass,auth,static-pages,login-page,verify,profile

# Mock API
Local development of the application requires use of the [mock API](https://github.com/department-of-veterans-affairs/vets-website#running-a-mock-api-for-local-development). Run the following command to provide the mock API VASS specific mock data:

```
yarn mock-api --responses src/applications/vass/services/mocks/index.js
```

# Unit tests
yarn test:unit --app-folder vass
yarn test:unit --app-folder vass --log-level all

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/vass/tests/e2e/**/*.cypress.spec.js"
```

### Screenshots

Screenshots are disabled by default during test runs to speed up regular e2e testing. To capture screenshots, pass the `--env screenshots=vass` flag:

```bash
yarn cy:run --env screenshots=vass --spec "src/applications/vass/tests/e2e/**/*.cypress.spec.js"
```

After the command completes, screenshots are saved to the `cypress/screenshots` folder at the root of the project. Each Cypress test file gets its own subfolder containing all screenshots from that file:

```
cypress/screenshots/
├── happy-path.cypress.spec.js/
│   ├── vass_schedule_verifyIdentity.png
│   ├── vass_schedule_enterOTP.png
│   ├── vass_schedule_dateTimeSelection.png
│   ├── vass_schedule_topicSelection.png
│   ├── vass_schedule_review.png
│   ├── vass_schedule_confirmation.png
│   ├── vass_schedule_dateTimeSelection_firstSlotSelected.png
│   ├── vass_schedule_review_beforeDateTimeChange.png
│   ├── vass_schedule_dateTimeSelection_secondSlotSelected.png
│   ├── vass_schedule_review_afterDateTimeChange.png
│   ├── vass_schedule_confirmation_changedDateTime.png
│   ├── vass_schedule_review_beforeTopicChange.png
│   ├── vass_schedule_topicSelection_changingTopic.png
│   ├── vass_schedule_review_afterTopicChange.png
│   ├── vass_schedule_confirmation_changedTopic.png
│   ├── vass_cancel_cancelAppointmentPage.png
│   ├── vass_cancel_cancelConfirmation.png
│   ├── vass_cancel_verifyIdentity_cancellationLink.png
│   ├── vass_cancel_enterOTP_cancellationLink.png
│   ├── vass_cancel_cancelAppointmentPage_fromLink.png
│   ├── vass_cancel_cancelConfirmation_fromLink.png
│   ├── vass_alreadyScheduled_page.png
│   ├── vass_alreadyScheduled_cancelAppointmentPage.png
│   └── vass_alreadyScheduled_cancelConfirmation.png
└── error-path.cypress.spec.js/
    ├── vass_error_verify_invalidCredentials.png
    ├── vass_error_verify_3FailedAttempts.png
    ├── vass_error_verify_rateLimited.png
    ├── vass_error_verify_serverError500.png
    ├── vass_error_verify_serviceUnavailable503.png
    ├── vass_error_verify_emptyLastName.png
    ├── vass_error_verify_emptyDateOfBirth.png
    ├── vass_error_otp_invalidCode.png
    ├── vass_error_otp_lastAttempt.png
    ├── vass_error_otp_accountLocked.png
    ├── vass_error_otp_expired.png
    ├── vass_error_otp_serverError500.png
    ├── vass_error_otp_serviceUnavailable503.png
    ├── vass_error_otp_emptyInput.png
    ├── vass_error_otp_nonNumericInput.png
    ├── vass_error_otp_tooShort.png
    ├── vass_error_availability_notWithinCohort.png
    ├── vass_error_availability_alreadyBooked.png
    ├── vass_error_availability_noSlots.png
    ├── vass_error_availability_serverError500.png
    ├── vass_error_availability_serviceUnavailable503.png
    ├── vass_error_topics_serverError500.png
    ├── vass_error_topics_serviceUnavailable503.png
    ├── vass_error_create_saveFailed.png
    ├── vass_error_create_serverError500.png
    ├── vass_error_create_serviceUnavailable503.png
    ├── vass_error_details_notFound.png
    ├── vass_error_details_serverError500.png
    ├── vass_error_details_serviceUnavailable503.png
    ├── vass_error_cancel_failed.png
    ├── vass_error_cancel_appointmentNotFound.png
    ├── vass_error_cancel_cancellationNotFound.png
    ├── vass_error_cancel_serverError500.png
    ├── vass_error_cancel_serviceUnavailable503.png
    └── vass_error_navigation_noUuid.png
```

## Mock UUIDs
There are several different mock UUIDs that can be used as a value for the `uuid` URL param when testing locally with the mock API.

### Happy Path
**URL:** `http://localhost:3001/service-member/benefits/solid-start/schedule?uuid=c0ffee-1234-beef-5678`
**Cancel URL:** `http://localhost:3001/service-member/benefits/solid-start/schedule?uuid=c0ffee-1234-beef-5678&cancel=true`

| Field | Value |
|-------|-------|
| uuid | `c0ffee-1234-beef-5678` |
| lastname | `Smith` |
| dob | `1935-04-07` |
| otc | `123456` |
| email | `s****@email.com` |

### Error Scenarios

#### OTC Verification - VASS API Error
**URL:** `http://localhost:3001/service-member/benefits/solid-start/schedule?uuid=authenticate-otc-vass-api-error`

Triggers a VASS API error (500) during OTC verification step.

| Field | Value |
|-------|-------|
| uuid | `authenticate-otc-vass-api-error` |
| lastname | `Smith` |
| dob | `1935-04-07` |
| otc | `123456` |
| email | `s****@email.com` |

#### OTC Verification - Service Error
**URL:** `http://localhost:3001/service-member/benefits/solid-start/schedule?uuid=authenticate-otc-service-error`

Triggers a service error (500) during OTC verification step.

| Field | Value |
|-------|-------|
| uuid | `authenticate-otc-service-error` |
| lastname | `Smith` |
| dob | `1935-04-07` |
| otc | `123456` |
| email | `s****@email.com` |

#### Not Within Cohort
**URL:** `http://localhost:3001/service-member/benefits/solid-start/schedule?uuid=not-within-cohort`

User successfully authenticates but is not within the eligible cohort for scheduling. Error occurs when fetching appointment availability.

| Field | Value |
|-------|-------|
| uuid | `not-within-cohort` |
| lastname | `Smith` |
| dob | `1935-04-07` |
| otc | `123456` |
| email | `s****@email.com` |

### Testing Notes
- The mock API enforces a **3 attempt limit** for low-auth verification (identity verification with lastname + dob)
- After 3 failed attempts, a 15-minute lockout is enforced
- The mock API enforces a **5 attempt limit** for OTC verification
- After 5 failed OTC attempts, the account is locked and a new OTC must be requested
- Failed attempt counters reset after 15 minutes

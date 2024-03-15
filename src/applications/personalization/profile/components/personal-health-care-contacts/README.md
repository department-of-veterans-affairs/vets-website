# Personal health care contacts

Displays a Veteran's Emergency contacts and Next of Kin at `/profile/contacts`.

Gated by `profile_contacts` feature toggle.

## Front-end states, backend responses, and renered UI

[CONDITIONS] -> [VA PROFILE RESPONSE]-> [VETS API RESPONSE] -> [UI]

CONDITIONS:
  - `profile_contacts` feature toggle off
VA PROFILE: N/A
VETS_API: `/v0/profile/contacts` responds with 404
UI: Link to `/profile/contacts` is not displayed, Personal health care contacts component is not shown.
E2E: Yes

CONDITIONS:
  - `profile_contacts` feature toggle on
  - Veteran is not health care enrolled (no ES record)
VA PROFILE: 403/404
VETS API: 403/404
UI: LoadFail, "This page isn't available right now."
E2E: Yes, however implementation/copy may change.

CONDITIONS:
  - `profile_contacts` feature toggle on
  - Veteran is health care enrolled with no contacts
VA PROFILE: 200
VETS API: 200
UI: Instructions
E2E: Yes

CONDITIONS:
  - `profile_contacts` feature toggle on
  - VA Profile, MVI, or EVSS are in scheduled downtime (via PagerDuty)
VA PROFILE: N/A
VETS API: N/A
UI: DowntimeNotification
E2E: `src/applications/personalization/profile/tests/e2e/account-security/downtime.cypress.spec.js`

CONDITIONS:
  - `profile_contacts` feature toggle on
  - Breakers is reporting an outage
VA PROFILE: N/A
VETS API: 500
UI: LoadFail, "This page isn't available right now."
E2E: Yes

CONDITIONS:
  - `profile_contacts` feature toggle on
  - Veteran is health care enrolled with contacts
VA PROFILE: 200
VETS API: 200
UI: PersonalHealthCareContacts
E2E: Yes

CONDITIONS:
VA PROFILE:
VETS API:
UI:

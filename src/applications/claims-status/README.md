# Claim Status Tool

This tool allows va users to check the status of thier VA claim, decision review or appeal online.

## Feature Flag Status

This table should be updated whenever a feature flag is added or its status changes.

- **Descriptions**: [features.yml](https://github.com/department-of-veterans-affairs/vets-api/blob/master/config/features.yml)
- **Current status**: [Flipper UI](https://api.va.gov/flipper/features)

_Last updated: 2026-03-02_

| Feature Flag | Staging Status | Production Status | Used in vets-website | Notes |
|---|---|---|---|---|
| `claim_letters_access` | Fully Enabled | Fully Enabled | Yes | Can likely be removed |
| `cst_claim_letters_use_lighthouse_api_provider` | Fully Enabled | Fully Enabled | No | Can likely be removed |
| `cst_claim_letters_use_lighthouse_api_provider_mobile` | Fully Enabled | Fully Enabled | No | Can likely be removed |
| `cst_claim_phases` | Fully Enabled | Partially Enabled (2 actors, 100% of actors) | Yes | |
| `cst_claims_list_filter` | Disabled | Disabled | Yes | |
| `cst_evidence_requests_content_override_mobile` | Partially Enabled (2 actors) | Disabled | No | |
| `cst_filter_ep_290` | Disabled | Disabled | No | |
| `cst_filter_ep_960` | Disabled | Fully Enabled | No | Can likely be removed; Staging/prod mismatch |
| `cst_include_ddl_5103_letters` | Fully Enabled | Fully Enabled | Yes | Can likely be removed |
| `cst_include_ddl_boa_letters` | Disabled | Disabled | Yes | Rollout on hold by stakeholder request |
| `cst_include_ddl_sqd_letters` | Fully Enabled | Partially Enabled (1 actor, 100% of actors) | No | |
| `cst_multi_claim_provider` | Disabled | Disabled | No | |
| `cst_multi_claim_provider_mobile` | Disabled | Disabled | No | |
| `cst_override_reserve_records_mobile` | Disabled | Disabled | No | |
| `cst_send_evidence_failure_emails` | Fully Enabled | Fully Enabled | No | Can likely be removed |
| `cst_send_evidence_submission_failure_emails` | Fully Enabled | Fully Enabled | No | Can likely be removed |
| `cst_show_document_upload_status` | Fully Enabled | Partially Enabled (50% of actors) | Yes | Actively being rolled out |
| `cst_suppress_evidence_requests_mobile` | Disabled | Disabled | No | |
| `cst_suppress_evidence_requests_website` | Disabled | Fully Enabled | No | Can likely be removed; Staging/prod mismatch |
| `cst_synchronous_evidence_uploads` | Disabled | Disabled | No | |
| `cst_timezone_discrepancy_mitigation` | Fully Enabled | Fully Enabled | Yes | Temporary mitigation — keep flagged until Lighthouse fixes UTC timestamps |
| `cst_update_evidence_submission_on_show` | Fully Enabled | Fully Enabled | No | Can likely be removed |
| `cst_use_claim_title_generator_mobile` | Fully Enabled | Fully Enabled | No | Can likely be removed |
| `cst_use_claim_title_generator_web` | Fully Enabled | Fully Enabled | No | Can likely be removed |
| `cst_use_dd_rum` | Fully Enabled | Fully Enabled | Yes | Can likely be removed |
| `letters_hide_service_verification_letter` | Fully Enabled | Disabled | No | Staging/prod mismatch |
| `stem_automated_decision` | Not in features.yml anymore | Not in features.yml anymore | Yes | Referenced in code but removed from backend |

## How to run locally

### Run vets-api locally

1. Open up the project in **VSCode** or in a **terminal instance** by cding into the vets-api project.
2. Once in the vets-api project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

   ```code block
   bundle install
   ```

   - Run vets-api locally

   ```code block
   foreman start -m all=1,clamd=0,freshclam=0
   ```

### Run vets-website locally

1. Open up the project in **VSCode** or in a **terminal instance** by cding into the vets-website project.
2. Take a look at [src/applications/claims-status/manifest.json](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/claims-status/manifest.json) to see what the service name is that you’ll need for the vets-website yarn watch command and for the url

   - Service Name: entryName
   - Localhost Url: rootUrl (EX: <http://localhost:3001/track-claims/your-claims/>)

3. Once in the vets-website project use the following commands:

   - If you just did a git pull or this is your first time running the project run this command

   ```code block
   yarn install
   ```

   - Run vets-website locally

   ```code block
   yarn watch --env entry=auth,claims-status,static-pages,login-page,terms-of-use,verify
   ```

### How to login into localhost with mocked-auth and view the claim status tool with betamocks

1. If you dont already have a setting.local.yml file in `vets-api` then follow these instructions to add one and create a certificate for benefits-claims so that you can login with localhost
2. Go to <http://localhost:3001/sign-in/mocked-auth>
3. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
4. Select a profile from the drop down (EX: vets.gov.user+228@gmail.com) and click the ‘Continue signing in’ button.
5. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/track-claims/your-claims/> and you will be directed to the Claim Status Tool service.

### How to login into localhost with mocked-auth and view the claim status tool with a staging user

1. In `vets-api` go to `lib/lighthouse/benefits_claims/service.rb` and change the line that says `@icn = icn` to an icn from a user in staging (EX: `@icn = 'STAGING_USER_ICN'`)
2. In your `config/settings.local.yml` you can change your use_mocks to be false for benefits_claims
3. Run `vets-api`
4. Select ID.me from the drop down list and click the ‘Sign in with mocked authentication’ button.
5. Select a profile from the drop down (EX: vets.gov.user+228@gmail.com) and click the ‘Continue signing in’ button.
6. You’ll be logged into localhost and the page will spin since we are only running certain services. Change the url to <http://localhost:3001/track-claims/your-claims/> and you will be directed to the Claim Status Tool service.
7. You should now see claims for that staging user ![Screenshot 2025-03-06 at 9 24 56 AM](https://github.com/user-attachments/assets/034e484d-a455-4d76-a845-a79096954c62)

### Run vets-website locally with mock data
1. Follow instructions in [Run vets-website locally](#run-vets-website-locally).
2. Run the mock data as a separate terminal window: `yarn mock-api --responses src/applications/claims-status/tests/local-dev-mock-api/common.js`
3. Update mock data in `src/applications/claims-status/tests/local-dev-mock-api/common.js`
4. Quickly create many claims by updating the variable passed into the `generateMockClaims()` method and setting `USE_MANY_CLAIMS` to `true`.
# Form: CH 31 - Veteran Readiness and Employment

### Context

CH31 is also called form 28-1900

### Async and Error Handling for CH36

- VRE::Submit1900Job
  - Finds SavedClaim::VeteranReadinessEmploymentClaim by claim_id
  - Claim.add_claimant_info
    - add_veteran_info —> Rescues and logs error to sentry in BGS::People::Service#find_person_by_participant_id
    - add_office_location —> check_office_location
      - Rescues and logs error to sentry (to vfs-ebenefits team with code 000: ‘not found’) if office location not found
  - Claim.send_to_vre
    - Uploads documents via VBMSUploader and logs results to StatsD
    - If user.participant_id not blank, sends async VBMS confirmation email to user
    - If user.participant_id is blank or VBMS upload fails, sends async central mail confirmation email to user
    - check_office_location
      - Rescues and logs error to sentry (to vfs-ebenefits team with code 000: ‘not found’) if office location not found
    - If user is not nil, sends Veteran Readiness Employment email to regional VA office
    - If office location is a permitted office location, submit Ch31 Form
      - Raises Ch31NilClaimError if claim is nil
        - Rescues Ch31NilClaimError and logs exception to sentry (to vfs-ebenefits team with error: ‘Claim cannot be null’)
      - Submits info to VRE
      - Raises Ch31Error if VRE response returns with an error
        - Rescues Ch31Error and logs exception to sentry (to vfs-ebenefits team with error message returned from VRE)

This is a brief overview of VRE::CreateCh31SubmissionsReportJob in terms of async calls, error handling, and possible red flags:

- VRE::CreateCh31SubmissionsReportJob

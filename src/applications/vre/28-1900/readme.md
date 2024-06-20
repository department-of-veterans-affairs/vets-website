# Form: CH 31 - Veteran Readiness and Employment

### Context

CH31 is also called form 28-1900

### Async and Error Handling for CH31

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
  - It looks like it used to be triggered via cron job, but has been commented out a little while back and is no longer being called.
  - There is currently no error handling or triggering of sidekiq jobs (other than queuing up an email to be sent).
  - We don’t seem to be guarding against when there are no submitted claims returned for the report. It doesn’t look like an empty result set would result in any errors based on how it is being used in the mailer template. But if this job was experiencing issues in the past, empty results could be a potential culprit.
  - 

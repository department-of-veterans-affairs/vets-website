# Form: CH 36 - Educational and Career Counseling

### Context

CH36 is also called form 25-8832

The program is called Chapter 36 or Personalized Career Planning and Guidance (PCPG) and the form to apply for those benefits is 25-8832. The form was recently renumbered from 28-8832 to 25-8832

### Async and Error Handling for CH36

- short_name = 'education_career_counseling_claim'
- FORM = '28-8832'

- Create SavedClaim::EducationCareerCounselingClaim

  - argument: ClaimsBaseController::filteredParams :form
    - formatted JSON string
    - validate against VetsJsonSchema::SCHEMAS['education_career_counseling_claim']
    - lib/pdf_fill/forms/va288832.rb
      - claimantInformation
      - claimantAddress
      - veteranFullName
      - ssn
      - dob
      - vaFileNumber
      - serviceNumber
      - veteranSsn
      - signature
      - signatureDate
      - claimantName
      - claimantSsn
      - claimantDob
      - claimantVaFileNumber
      - claimantEmail
      - claimantRelationship
      - claimantTelephone
      - claimantMailingAddress
      - veteranName
      - veteranSocialSecurityNumber
      - veteranVaFileNumber
    - ** could not find conditions or other error handling **

- Save claim

  - SavedClaim::EducationCareerCounselingClaim < ApplicationRecord < ActiveRecord::Base

- If return is FALSE (`unless claim.save`)

  - ** could not find conditions or other error handling **
  - increment failure count for "#{stats_key}.failure" == api.education_career_counseling_claim.failure
  - tag sentry logs with `team: 'vfs-ebenefits'`
  - raises Common::Exceptions::ValidationErrors

- On save complete:
  - CentralMail::SubmitCareerCounselingJob.perform_async
    - CentralMail::SubmitCareerCounselingJob.send_confirmation_email
      - retrieve email from `user_uuid` or form::claimantInformation.emailAddress
      - return (no error) if no email found
      - VANotify::EmailJob
        - VaNotify::Service.new(Settings.vanotify.services.va_gov.api_key).send_email
        - catches Common::Exceptions::BackendServiceException
          - if status_code == 400, log to sentry
          - else raise exception
  - Rails log claimId + class::FORM
  - clear saved form
  - render claim using json data
    - where is the object conversion to json string?

App Name: `Form 21P-527EZ`

Application for Veterans Pension 

Active engineers: Scott Gorman (full stack), Matt Knight (engineering lead), Daniel Lim (full stack),Todd Rizzolo (front end), Wayne Weibel (full stack), and Tai Wilkin (full stack)

Form ID (if different from app name): `21P-527EZ`

# Background

The Veterans Pension program provides monthly payments to wartime Veterans who meet certain age or disability requirements, and who have income and net worth within certain limits. 

## How the form works for the user

The applicant is shown an introduction page that gives an overview of the process to apply for burial benefits. It includes 2 steps:

- `Prepare`
- `Apply`

### Authentication

The applicant is encouraged to sign in to start the application.
Note: The applicant may begin the application without signing in.

### The Application

The form is configured using the VA Forms library. The `/config/form.js` config file includes 6 chapters:

- `Applicant Information` (3 pages)
- `Military History` (4 pages)
- `Health and employment information` (14 pages)
- `Household information` (14 pages)
- `Financial information` (13 pages)
- `Additional Information` (6 pages)

The default form configuration includes a `Review Application` step that gives the applicant to review and edit their application before submitting the application.

Each individual chapter of the form has it's own folder labeled 01 - 05 followed by the section name (`/config/chapters/`). Each folder houses the individual pages for the corresponding chapter.

## Front End

The original form system is used to build this application and follows a pretty standard implementation with just a few areas worth noting.

### Feature Toggles (front end)

Active toggle names: 
- `pension_form_enabled`: Enable the pension form
- `pension_ipf_callbacks_endpoint`: Pension IPF VANotify notification callbacks endpoint
- `pension_browser_monitoring_enabled`: Pension Datadog RUM monitoring
- `pension_claim_submission_to_lighthouse`: Pension claim submission uses Lighthouse API

The form is built using `/config/form.js` which is imported and used inside `/PensionsApp.jsx` with the `<RoutedSavableApp />` component from the platform. 

In `/PensionsApp.jsx` we dynamically render a loading indicator if the app is in an `isLoading` state from Redux. This allows us to show a loading indicator while we check the `PensionFormEnabled` feature toggle boolean to decide whether we show the form or not. 

If the feature toggle is not enabled we display a deactivation page (`/components/NoFormPage.jsx`) which explains 'the online form is not working right now' with a prompt and instructions to apply by mail or in person instead. 

If the feature toggle is enabled then the form renders a `<SaveInProgressIntro />` component from the platform and an introduction to start the form.
The toggle can be used in the event the form needs to be fully deactivated for any reason.

### Custom Styling
The custom styling in `/sass/pensions.scss` is needed to address to fix spacing in the Array Views and to override widget styles to match v3 web components until there is a web component pattern replacement.

## Back End

### Saving Progress (back end)

The form is saved to the database every time a change is made to the form via an api endpoint `/v0/in_progress_forms/21P-527EZ` that saves the most recent form data and metadata. When the api responds with a `200 status code` a saved alert is displayed in the UI with a timestamp.

### Documents Upload (back end)

On the `Additional Information` step the applicant has an option to upload required and supporting documents. The documents are uploaded via an api endpoint to `/v0/claim_attachments`. The `vets-api/app/controllers/v0/claim_documents_controller.rb` controller is then responsible for handling the creation of claim documents or attachments.

### Form submission

Note: The applicant can submit the form whether they are signed in or not.

After the applicant completes the form and submits the payload is sent to the api endpoint `/v0/pension_claims`.

If the submission fails, an error alert is displayed in the UI and an error is logged to the browser console. If the error is `429 Too Many Requests` status code it creates a corresponding error object with additional information about the rate limit reset time.

The submit api endpoint uses the `vets-api/app/controllers/v0/pension_claims_controller.rb` controller on the back end. The main method we use in that controller is the `create` method. This method starts out by creating a `claim` object. The `claim` object is created with the `new` method of the `SavedClaim::Pension`. If for some reason the `claim` did not get created, meaning that the form payload has not passed our validation, we log the error and iterate StatsD `api.pension_claim.failure`.

After we create the claim, the claim is sent to Lighthouse using the `SavedClaim::Pension#upload_to_lighthouse` method. In this method, we process any attached documents, and then we send the data to a background job (`Lighthouse::PensionBenefitIntakeJob.perform_async`) for asynchronous processing. 

Once the claim has been successfully passed to the background job, we clear out the current saved claim data so that this claim doesn't stay in the applicant's `save in progress` function on the form. We log the success and iterate StatsD `api.pension_claim.success`. A JSON response is sent to the front end, where a confirmation page with a confirmation number is displayed on success.

On failure, we log the error and iterate StatsD `api.pension_claim.failure`. 

Errors anywhere within the synchronous `PensionClaimsController#create` method are raised and returned to the front end for display. Errors within the asynchronous `Lighthouse::PensionBenefitIntakeJob` are not. 

### Asynchronous claim submission

Following [Sidekiq best practices](https://github.com/sidekiq/sidekiq/wiki/Best-Practices#1-make-your-job-parameters-small-and-simple), the Sidekiq job is only passed the claim ID and, when available, the user ID. In the `init` method, we apply the Sentry tag `pension_21p527ez`, initialize the `BenefitsIntake::Service`, and fetch the Claim from the database. An error can be thrown if it's not found. 

The Sidekiq job then creates PDFs of the claim and any attachments and requests upload to the intake service. We log the started job and iterate StatsD `worker.lighthouse.pension_benefit_intake_job.begun`. 

A `FormSubmissionAttempt` is created to enable polling of the status of the claim in Lighthouse.

We create metadata for the claim, log the attempt to upload to Lighthouse, and iterate StatsD `worker.lighthouse.pension_benefit_intake_job.attempt`, then attempt to upload the claim to Lighthouse. If it fails, we log the failure, iterate StatsD `worker.lighthouse.pension_benefit_intake_job.failed`, and cleanup the created PDFs. 

If it continues failing, the Sidekiq job will retry 14 times, or for approximately a day. When the retries are exhausted, we log the exhaustion and iterate StatsD `worker.lighthouse.pension_benefit_intake_job.exhausted`. This triggers the [Sidekiq Exhaustion for Pension Benefit Intake Job Monitor](https://github.com/department-of-veterans-affairs/va.gov-team-sensitive/blob/master/teams/benefits/playbooks/pensions/pensions-retry-exhausted.md).

If the job succeeds, we send a confirmation email, log the success, and iterate StatsD `worker.lighthouse.pension_benefit_intake_job.success`, then cleanup the created PDFs.

## Useful commands


| Command      | Purpose      |
| -------------------------------------------------- | ---------------------------------------------------- |
| `yarn watch --env entry=static-pages,auth,login-page,pensions` | Minimal `yarn watch` for faster compilation (front end) |
| `yarn run eslint --quiet --ext .js --ext .jsx src/applications/pensions` | Lint Pensions (front end)   |
| `yarn cy:run --headed --no-exit --spec src/applications/pensions/tests/e2e/pensions.cypress.spec.js`             | Run the standard Cypress end-to-end tests in a browser (front end)  |
| `yarn test:coverage-app pensions` | Test unit-test code coverage (front end) |
| `yarn cy:run --headed --no-exit --spec src/applications/pensions/tests/e2e/pensionsKeyboardOnly.cypress.spec.js` | Run the keyboard-only Cypress end-to-end tests in a browser (front end)  |
| `yarn test:unit --app-folder pensions`  | Run all unit tests for Pensions  (front end) |
| `yarn test:unit {filepath}` | Run a single test file (front end)| 
| `bundle exec rspec {filepath}` | Run a single test file (back end)|
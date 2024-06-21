App Name: `Form 21P-530EZ`
Application for Burial Benefits (Under 38 U.S.C. Chapter 23)
Active engineers: Sean Midgley (front end), Dakota Larson (front end), Evan Smith (back end), Thomas Blackwell (back end)
Form ID (if different from app name): `21P-530EZ`

# Background

This application is used to submit a claim for any of the following named burial allowances and related burial benefits:

- `Non-service-connected Burial Allowance`
- `Service-connected Burial Allowance`
- `Plot or Interment Allowance`
- `Transportation Benefit`
- `Unclaimed Remains of Veteran`

## Note

In production, VA.gov provides a downloadable form only when searching for a 'Burial' or '21P-530' form that can be manually filled out and mailed in for review. In lower environments, the applicant is redirected to 'This form is not working page' or the form based on a feature toggle variable.

## How the form works for the user

The applicant is shown an introduction page that gives an overview of the process to apply for burial benefits. It includes 4 steps:

- `Determine eligibility`
- `Gather information`
- `Apply`
- `Decision by mail`

The applicant may click a link [Find out if you're eligible for a Veterans burial allowance](https://va.gov/burials-memorials/veterans-burial-allowance/) that redirects them to a static page.

## Authentication

The applicant is encouraged to sign in to start the application.
Note: The applicant may begin the application without signing in. (Review security risks and check save on progress endpoints)

## The Application

The form is configured using the VA Forms library. The `/config/form.js` config file includes 5 chapters:

- `Claimant Information` (4 pages)
- `Deceased Veteran Information` (3 pages)
- `Military History` (5 pages)
- `Benefits Selection` (12 pages)
- `Additional Information` (3 pages)

The default form configuration includes a `Review Application` step that gives the applicant to review and edit their application before submitting the application.

The form system uses Redux and thus we also use Redux in our form so we have a `/actions` and a `/reducers` folder to hold the respective Redux code.

Each individual chapter of the form has it's own folder labeled 01 - 05 followed by the section name (`/config/chapters/). Each folder houses the individual pages for the corresponding chapter.
All of the applications helper functions, labels, and additional validation is located in the utility folder (`/utils`). This includes submission, polling, and error handling.

## Callouts on how the front end works

The original form system is used to build this application and follows a pretty standard implementation with just a few areas worth noting.

### Feature Toggles (front end)

Active toggle names: 
- `burial_form_enabled`

The form is built using `/config/form.js` which is imported and used inside `/BurialsApp.jsx` with the `<RoutedSavableApp />` component from the platform. 
In `/BurialsApp.jsx` we dynamically render a loading indicator if the app is in an `isLoading` state from Redux. This allows us to show a loading indicator while we check the `BurialFormEnabled` feature toggle boolean to decide whether we show the form or not. 
If the feature toggle is not enabled we display a deactivation page (`NoFormPage.jsx`) which explains 'the online form is not working right now' with a prompt and instructions to apply by mail or in person instead. 
If the feature toggle is enabled then the form renders a `<SaveInProgressIntro />` component from the platform and an introduction to start the form.
Note: this was put in place in the event the form needs to be fully deactivated for any reason.

This iteration of the form was built in 2024 and referred to as first `burials-v2`, then `burials-ez`.
***explain redirect and flipper for redirect***

### Custom Styling
All custom styling in `/sass/burials.scss` is needed specifically to address WCAG contrast violations that the lighter colored "help text" or "hint" presents and fixes spacing in the Array Views.

### Saving Progress (back end)

The form is saved to the database every time a change is made to the form via an api endpoint `/v0/in_progress_forms/21P-530` that saves the most recent form data and metadata. When the api responds with a `200 status code` a saved alert is displayed in the UI with a timestamp.

### Documents Upload (back end)

On the `Additional Information` (5 of 6) step the applicant has an option to upload required and supporting documents. The documents are uploaded via an api endpoint to `/v0/claim_attachments`. The `vets-api/app/controllers/v0/claim_documents_controller.rb` controller is then responsible for handling the creation of claim documents or attachments.

Note: On dev, the endpoint returns a `422 Unprocessable Content` status code and the file is not accepted to continue with the form.

### Form submission

Note: The applicant can submit the form whether they are signed in or not.

After the applicant completes the form and submits the payload is sent to the api endpoint `/v0/burial_claims` and a 'Claim Submitted' page with a confirmation number is displayed on success.

If the submission fails, an error alert is displayed in the UI and an error is logged to the browser console. If the error is `429 Too Many Requests` status code it creates a corresponding error object with additional information about the rate limit reset time.

The submit api endpoint uses the `vets-api/app/controllers/v0/burial_claims_controller.rb` controller on the back end. The main method we use in that controller is the `create` method, this method starts out by creating a `claim` object. The `claim` object is created with the `new` method of the `SavedClaim:Burial`. We then check if for some reason the `claim` did not get created, meaning that the form payload has not passed our validation, we then log the error via Sentry tagged `benefits-memorial-1` and raise an exception.

After we create the claim we then process any attached documents, which are needed for some of the workflows in the form, and then using the structured data service we send the data to background job (Central Mail) for asynchronous processing. Once the claim has been submitted successfully, at this point we clear out the current saved claim data so that this claim doesn't stay in the applicant's `save in progress` function on the form. We then render JSON to the front end.

### After submission

The claim is submitted using the `structured_data_services` call inside `vets-api/app/controllers/v0/burial_claims_controller.rb` based on the payload of the form. Asynchronous processing occurs after a successful claim save. It kicks off a Sidekiq job queue in `vets-api/app/sidekiq/structured_data/process_data_job.rb` that does the following:

- Extracts and processes various data from the claim based on the `saved_claim_id`
- Processes attachments by uploading claim data and attachments
- Asynchronously sends a confirmation email via `VANotify::EmailJob.perform_async`

### Async and Error Handling

In `vets-api/app/sidekiq/structured_data/process_data_job.rb` the 'retry' option is set to false so the job will NOT be retired in case of failure. This means that if it fails, it won't be automatically reprocessed. If an error occurs, the 'rescue' option is set to re-raise any exceptions and propagate the exception to higher levels.

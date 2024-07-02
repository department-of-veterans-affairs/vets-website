#### Form 21P-527EZ

# Application for Veterans Pension

### Base URLs

[https://www.staging.va.gov/pension/apply-for-veteran-pension-form-21p-527ez](https://www.staging.va.gov/pension/apply-for-veteran-pension-form-21p-527ez)

[https://www.va.gov/pension/apply-for-veteran-pension-form-21p-527ez](https://www.va.gov/pension/apply-for-veteran-pension-form-21p-527ez)

### Content

#### Introduction

```json
{
  "title": "Introduction",
  "path": "/introduction"
}
```

#### Chapters and Pages

The details of the chapters and pages of the form can be found in the generated [structure.json](../structure.json) file. The `generate-form-docs` script outputs the title and page details of each chapter, including page 'titles', 'paths', and 'depends' values. This file serves as a general reference of the structure of the Application for Veterans Pension form.

##### How to generate structure.json

1. Run the `generate-form-docs` script

This will output the latest form documentation to the 'structure.json' file

```sh
yarn generate-form-docs -- pensions
```

#### Review and Submit

```json
{
  "title": "Review and submit",
  "path": "/review-and-submit"
}
```

### Context

VA Form 21P-527EZ (Application for Veterans Pension) is intended for wartime Veterans who want to file a pension claim.

This form, 21P-527EZ, should not be confused with VA Form 21P-527 (Income, Net Worth, and Employment Statement), which allows Veterans who have already filed a claim for pension benefits to add financial evidence to their existing claim. VA21-527 is paper-only.

### Form Submission

#### Async and Error Handling

527EZ is submitted via a POST request to /v0/in_progress_forms/21P-527EZ.

- `app/controllers/claims_base_controller.rb` - Enters submission flow via `ClaimsBaseController#create` - Creates and validates an instance of the class, removing any copies of the form that had been previously saved by the user. - Adds Sentry tags via `lib/pension_burial/tag_sentry.rb` - Creates a new instance of `SavedClaim::Pension` (`app/models/saved_claim/pension.rb`) via `V0::PensionClaimsController::ClaimsBaseController` (`app/controllers/v0/pension_claims_controller.rb`) - argument: ClaimsBaseController::filteredParams :form - formatted JSON string - **schema validation appears to only check if keys :short_name and :form are present** - If the claim fails to save, StatsD failure count is increased and a ValidationError is raised - If claim is saved successfully: - _async_ Runs `SavedClaim#process_attachments!` which attempts to process any files and workflows that are present and send them to internal partners for processing via `CentralMail::SubmitSavedClaimJob#perform_async` (see below for details on `perform_async`) - StatsD success count is increased and some claim data is logged, the saved form is cleared, and the success page is rendered
- `app/sidekiq/central_mail/submit_saved_claim_job.rb` - `CentralMail::SubmitSavedClaimJob#perform` - argument: saved claim ID - **async sidekick job** - Adds Sentry tags via `lib/pension_burial/tag_sentry.rb` - Attempts to find the claim by ID - No error handling if claim not found - Creates a PDF of the claim using `.to_pdf`, which forwards to `PdfFill::Filler#fill_form` (`lib/pdf_fill/filler.rb`) - Converts the data to a hash using `PdfFill::Forms` (`lib/pdf_fill/forms/va21p527ez.rb`) - In some cases, has alternate handling if data is null - Otherwise, no specific error handling - Creates a file and filepath; adds additional extra docs in some cases (flow unclear) - No error handling - `CentralMail::SubmitSavedClaimJob#process_record` is run for the claim and each persistent attachment - argument: claim object - Creates a new `CentralMail::DatestampPdf` (`lib/central_mail/datestamp_pdf.rb`) - No error handling in `#process_record` or `#perform` for errors in this step. DatestampPDF has some logging and error handling in its methods, with some errors being raised to the called method. Because this is occurring in the async method, I don't think these errors would be returned to the user. - `CentralMail::SubmitSavedClaimJob#create_request_body` - Generates request metadata in `CentralMail::SubmitSavedClaimJob#generate_metadata` - Mostly involves pulling data off the claim, but also reads data from the PDF files created in `#process_record` - No specific error handling - Runs `to_faraday_upload` for each created file - No specific error handling - Passes the created request body to `CentralMail::Service#upload` (`lib/central_mail/service.rb`) - Adds additional Sentry tags via Raven - Uploads the data - Upload occurs in a `with_monitoring do` block - Adds additional Sentry tags via Raven after request completes, and increases StatsD upload failure count if the request fails - Logs the response if the claim type is VRE - skipped in the pension flow - Deletes all local copies of created files - No specific error handling - If the upload response is a success: - Update the claim's central*mail_submission status to success if it has a central_mail_submission - No specific error handling - Send a confirmation email if the claim has the send_confirmation_email method **(unclear if pension does)** - No specific error handling - Else if the upload response fails: - raise CentralMailResponseError - \_Error handling*: If any error occurs in the entirety of `CentralMail::SubmitSavedClaimJob#perform`: - Update the claim's central_mail_submission status to failure if it has a central_mail_submission - Re-raise the error to the calling method

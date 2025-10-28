# Form 21-4140 Employment Questionnaire API

This module exposes VA Form 21-4140 (Employment Questionnaire for Individual Unemployability re-evaluation) through the `EmploymentQuestionairres` engine. Submissions are persisted as `EmploymentQuestionairres::SavedClaim` records and forwarded to Lighthouse Benefits Intake, including any attachments the claimant provides.

## Base URL and Authentication

- **Engine mount:** `/employment_questionairres`
- **API version:** `v0`
- **Authentication:** Standard VA.gov session cookies. The controller inherits from `ClaimsBaseController`, which loads the user if a session is present but does not require authentication. Include the `X-CSRF-Token` header when submitting from a browser.
- **Feature toggle:** The background upload job requires `medical_expense_reports_form_enabled` to be enabled. If the flag is off, `EmploymentQuestionairres::BenefitsIntake::SubmitClaimJob` exits early and no upload occurs.

## Submit Form 21-4140

`POST /employment_questionairres/v0/form4140`
`POST /employment_questionairres/v0/claims` *(alias)*

| Requirement | Value |
|-------------|-------|
| Headers | `Content-Type: application/json`, `Accept: application/json` |
| Body wrapper | `employment_questionairres_claim[form]` must be a JSON string |
| Validation | `EmploymentQuestionairres::SavedClaim` schema and PDF filler requirements |
| Attachments | Optional. Provide `files[]` array with `confirmationCode` values from PersistentAttachment uploads |

### Example Request

```http
POST /employment_questionairres/v0/form4140 HTTP/1.1
Content-Type: application/json
Accept: application/json

{
  "employment_questionairres_claim": {
    "form": "{\"veteranFullName\":{\"first\":\"John\",\"middle\":\"A\",\"last\":\"Doe\"},\"claimantFullName\":{\"first\":\"Derrick\",\"middle\":\"A\",\"last\":\"Stewart\"},\"veteranSocialSecurityNumber\":\"333224444\",\"employmentStatus\":{\"radio\":\"0\",\"date_mailed\":\"2025-10-15\"},\"employmentHistory\":[{\"nameAndAddress\":\"ACME Corp, 456 Industrial Ave, Springfield, IL\",\"typeOfWork\":\"Construction Worker\",\"hoursPerWeek\":40,\"dateRange\":{\"from\":\"2020-04-04\",\"to\":\"2020-06-20\"},\"timeLost\":\"2 weeks\",\"grossEarningsPerMonth\":3500}],\"signatureSection1\":{\"date_signed\":\"2025-10-15\",\"veteranSocialSecurityNumber\":\"333224444\"},\"files\":[{\"confirmationCode\":\"3c75f6f2-4a0f-45da-8bea-5df442a2c4d2\"}]}"
  }
}
```

**Key fields** (see `modules/employment_questionairres/spec/lib/employment_questionairres/pdf_fill/test.json`):

- `veteranFullName`, `claimantFullName`
- `veteranSocialSecurityNumber` (or `vaFileNumber`)
- `veteranAddress`, `veteranContact`
- `employmentStatus`, `employmentHistory[]` with `dateRange.from` / `dateRange.to`
- `signatureSection1` (veteran signature) and `signatureSection2` (witness if present)
- `files[]` array linking previously uploaded attachments by `confirmationCode`

### Success Response

Serialized via `SavedClaimSerializer` (`app/serializers/saved_claim_serializer.rb`).

```json
{
  "data": {
    "id": "8d5206fe-9a5f-46c3-af2b-54a9808ac7c2",
    "type": "saved_claims",
    "attributes": {
      "submitted_at": "2025-10-27T14:22:51Z",
      "regional_office": [
        "Department of Veteran Affairs",
        "Pension Intake Center",
        "P.O. Box 5365",
        "Janesville, Wisconsin 53547-5365"
      ],
      "confirmation_number": "VBA-21-4140-ARE-123456",
      "guid": "8d5206fe-9a5f-46c3-af2b-54a9808ac7c2",
      "form": "VBA-21-4140-ARE"
    }
  }
}
```

### Failure Modes

- **422 Unprocessable Entity** – validation errors from `EmploymentQuestionairres::SavedClaim` (`Common::Exceptions::ValidationErrors`).
- **500 Internal Server Error** – unexpected exceptions; errors are logged via `EmploymentQuestionairres::Monitor`.

### Side Effects

On successful submission:

1. `EmploymentQuestionairres::SavedClaim#process_attachments!` links `PersistentAttachment` records by `confirmationCode`.
2. `EmploymentQuestionairres::BenefitsIntake::SubmitClaimJob.perform_async` runs on the `low` queue:
   - Stamps the claim PDF and attachments (`PDFUtilities::DatestampPdf`).
   - Validates each document with `BenefitsIntake::Service#valid_document?`.
   - Creates `Lighthouse::Submission` / `SubmissionAttempt` rows and tags the `benefits_intake_uuid` in Datadog tracing.
   - Calls Lighthouse Benefits Intake `perform_upload` to transmit the submission.
   - Sends VANotify “submitted” emails via `EmploymentQuestionairres::NotificationEmail` (failures are monitored).
   - Retries up to 16 times; on exhaustion the monitor records `track_submission_exhaustion`.

Temporary PDFs are deleted in an `ensure` block; cleanup errors are tracked.

## Retrieve Submitted Claim

`GET /employment_questionairres/v0/form4140/{guid}`
`GET /employment_questionairres/v0/claims/{guid}` *(alias)*

- `{guid}` is the `guid` returned from the submit response (saved in `saved_claims.guid`).
- Returns the same JSON structure as the submit response.
- **404 Not Found** – no matching claim; controller records `track_show404`.

Example:

```json
{
  "data": {
    "id": "8d5206fe-9a5f-46c3-af2b-54a9808ac7c2",
    "type": "saved_claims",
    "attributes": {
      "submitted_at": "2025-10-27T14:22:51Z",
      "regional_office": [
        "Department of Veteran Affairs",
        "Pension Intake Center",
        "P.O. Box 5365",
        "Janesville, Wisconsin 53547-5365"
      ],
      "confirmation_number": "VBA-21-4140-ARE-123456",
      "guid": "8d5206fe-9a5f-46c3-af2b-54a9808ac7c2",
      "form": "VBA-21-4140-ARE"
    }
  }
}
```

## Operational Notes

- **Attachments:** Upload first using the global VA.gov upload APIs; supply returned `confirmationCode` values in the form payload so `process_attachments!` can associate them.
- **Prefill:** `EmploymentQuestionairres::FormProfiles::VA21p8416` provides prefill metadata and field mappings when prefill is enabled.
- **Monitoring:** `EmploymentQuestionairres::Monitor` records create/show attempts, validation errors, submission retries, email failures, and cleanup issues.
- **PDF generation:** `EmploymentQuestionairres::PdfFill::Va214140` maps form JSON to the redesign PDF template (extras enabled via `extras_redesign: true`).
- **Datadog:** The job tags `benefits_intake_uuid`; request traces also tag `form_id`.

Store this document alongside the engine for quick discovery: `modules/employment_questionairres/documentation/form-21-4140-api.md`.

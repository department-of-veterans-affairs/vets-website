# Mock API Responses for Mock Simple Forms Patterns V3

This directory contains mock API responses for local development and testing of the Mock Simple Forms Patterns V3 application.

## Usage

To use these mocks for local development, run:

```bash
yarn mock-api --responses ./src/applications/simple-forms/mock-simple-forms-patterns-v3/tests/e2e/fixtures/mocks/local-mock-responses.js
```

Then start the development server:

```bash
yarn watch --env entry=mock-form-patterns-v3
```

## Files

### Mock Data Files (JSON)

- **user.json** - Mock user data with profile, contact information, and veteran status
- **featureToggles.json** - Feature flag configurations
- **sip-get.json** - Save-in-progress GET response (empty form)
- **sip-put.json** - Save-in-progress PUT response (saved form)
- **submit.json** - Form submission response with confirmation number

### Constants and Prefill Data

Located in `../../mocks/`:

- **constants/user.js** - User data constants (name, contact info, addresses)
- **endpoints/in-progress-forms/mock-simple-forms-patterns-v3.js** - Prefill data structures
  - `prefill` - Basic prefill with veteran information
  - `prefillMaximal` - Extended prefill including employers and treatment records

### Main Response File

- **local-mock-responses.js** - Maps API endpoints to mock responses

## Customization

To customize mock data:

1. **User Information**: Edit `constants/user.js`
2. **Prefill Data**: Edit `endpoints/in-progress-forms/mock-simple-forms-patterns-v3.js`
3. **API Responses**: Edit the individual JSON files or `local-mock-responses.js`

## Available Mock Endpoints

- `GET /v0/user` - User profile and contact information
- `GET /v0/maintenance_windows` - Maintenance windows (empty array)
- `GET /v0/feature_toggles` - Feature flags
- `GET /v0/in_progress_forms/FORM_MOCK_PATTERNS_V3` - Retrieve saved form
- `PUT /v0/in_progress_forms/FORM_MOCK_PATTERNS_V3` - Save form progress
- `POST /simple_forms_api/v1/simple_forms` - Submit form

## Notes

- The form ID is `FORM_MOCK_PATTERNS_V3` (must match the formId in config/form.js)
- Prefill data structures match the schema expected by the prefill-transformer
- Mock user data aligns with the test fixtures in `fixtures/data/minimal-test.json`

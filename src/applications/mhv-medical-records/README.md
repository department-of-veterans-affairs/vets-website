# mhv-medical-records

## App

This app provides veterans with access to their medical records from My HealtheVet (MHV) on VA.gov. Veterans can view, download, and print their various medical records including lab results, radiology reports, care summaries, vaccines, allergies, vital signs, health conditions, and notes.

## Quick start to get running locally

Before you get started check [this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment) first to make sure you are setup to use the correct version of Node and Yarn.

- clone vets-website repo `git clone git@github.com:department-of-veterans-affairs/vets-website.git`
- run `yarn install`
- create the directory structure if it doesn't exist
  `mkdir -p build/localhost/data/cms`
- fetch the CMS data and save to the specified location
  `curl -o build/localhost/data/cms/vamc-ehr.json "https://www.va.gov/data/cms/vamc-ehr.json"`
- turn on local mocks `yarn mock-api --responses src/platform/mhv/api/mocks`
- start app `yarn watch --env entry=medical-records`
- Run this in your browser console to simulate being logged in `localStorage.setItem('hasSession', true);`
- visit the app: `http://localhost:3001/my-health/medical-records`

## Running tests

Unit tests can be run using this command: `yarn test:unit --app-folder mhv-medical-records`. To get detailed errors, run this command with `--log-level=error`. To get coverage reports run this command `yarn test:unit --app-folder mhv-medical-records --coverage --coverage-html`. View the report at `/coverage/index.html`

Cypress tests can be run with the GUI using this command: `yarn cy:open`. From there you can filter by `mhv-medical-records` to run end to end tests for this app.

Run Cypress from command line:

- Run all `yarn cy:run --spec "src/applications/mhv-medical-records/**/**/*"`
- Use the `-b electron` option to specify the Electron browser, which is lightweight, tightly integrated with Cypress, and comes pre-installed, removing the need for separate installation.

### Test coverage

```bash
$ yarn test:unit --app-folder mhv-medical-records --coverage --coverage-html
$ cd ./coverage
$ npx http-server
$ open http://localhost:8080
```

## Features

The MHV Medical Records application provides access to the following types of medical records:

- **Lab and test results** - Chemistry/Hematology, Microbiology, Pathology lab results
- **Radiology** - Imaging reports and studies  
- **Care summaries and notes** - Provider notes, discharge summaries, consultation reports
- **Vaccines** - Immunization records
- **Allergies** - Allergy and adverse reaction information
- **Vital signs** - Blood pressure, weight, temperature, and other vital measurements
- **Health conditions** - Problem list and diagnoses
- **Notes** - Various clinical notes and documentation

## Architecture

The application follows standard VA.gov patterns with:

- **Redux** for state management
- **React Router** for navigation
- **RJSF** (React JSON Schema Form) for form components when applicable
- **VA Design System** web components for UI consistency
- **Platform utilities** for API requests and common functionality

Key directories:
- `actions/` - Redux action creators
- `api/` - API service functions
- `components/` - Reusable React components
- `containers/` - Connected components and page containers
- `hooks/` - Custom React hooks
- `reducers/` - Redux reducers for state management
- `sass/` - Styling and CSS
- `tests/` - Unit and integration tests
- `mocks/` - Mock API responses for development

## Mock API Development

The application includes comprehensive mock data for local development. Mock responses are configured in `src/applications/mhv-medical-records/mocks/api/index.js` and include:

- Medical record data for all supported record types
- Error scenarios for testing error handling
- Maintenance window notifications
- Authentication and session management

To use mock data during development, ensure the mock API server is running with the responses file specified.

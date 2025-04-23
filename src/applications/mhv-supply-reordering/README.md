# mhv-supply-reordering

## Background Info

About: This app provides an interface to re-order Hearing Aid and Sleep Apnea accessories
Slack Channel: [#va-cto-supply-reordering](https://dsva.slack.com/archives/C05DFSM57FW/p1689711688225089)

## App

Form app generated with `yarn new:app`. Changes to the following files were reverted, since `VA_FORM_IDS.FORM_VA_2346A` already exists.

- `src/platform/forms/constants.js`
- `src/platform/forms/tests/forms.unit.spec.js`

## Quick start to get running locally

Before you get started check [this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment) first to make sure you are setup to use the correct version of Node and Yarn.

- clone vets-website repo `git clone git@github.com:department-of-veterans-affairs/vets-website.git`
- run `yarn install`
- turn on local mocks `yarn mock-api --responses src/applications/mhv-supply-reordering/mocks/index.js`
- start app `yarn watch --env entry=mhv-supply-reordering`
- Run this in your browser console to simulate being logged in `localStorage.setItem('hasSession', true);`
- visit the app: `http://localhost:3001/my-health/order-medical-supplies`

Note: The application fetches supply data from `/v0/in_progress_forms/mdot`. This endpoint is mocked in the local development environment.

## Running tests

Unit tests can be run using this command: `yarn test:unit --app-folder mhv-supply-reordering`. To get detailed errors, run this command with `--log-level=error`. To get coverage reports run this command `yarn test:unit --app-folder mhv-supply-reordering --coverage --coverage-html`. View the report at `/coverage/index.html`

Cypress tests can be run with the GUI using this command: `yarn cy:open`. From there you can filter by `mhv-supply-reordering` to run end to end tests for this app.

Run Cypress from command line:

- Run all `yarn cy:run --spec "src/applications/mhv-supply-reordering/**/**/*"`
- Specify browser `-b electron`

### Test coverage

```bash
$ yarn test:unit --app-folder mhv-supply-reordering --coverage --coverage-html
$ cd ./coverage
$ npx http-server
$ open http://localhost:8080
```

## VA Forms - Web Component Fields and Patterns

[[docs](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-web-component-fields-and-patterns)]

[[examples](https://staging.va.gov/mock-form-patterns/introduction)]

A web-component-field is a design system web component for use in forms. These can be found at `src/platform/forms-system/src/js/web-component-fields`.

A web-component-pattern is a group of web-component-fields that can span one or more pages (e.g. - a multi-page form). These can be found at `src/platform/forms-system/src/js/web-component-patterns`.

## Form Flow

- IntroductionPage
- ChooseSupplies
- ContactInformation (optionally: EditEmail, EditAddress)
- ReviewPage
- ConfirmationPage

## API Responses

[[mocker-api](https://github.com/jaywcjlove/mocker-api/tree/v2.9.0?tab=readme-ov-file#usage)]

[[vets-api OpenAPI documentation](https://department-of-veterans-affairs.github.io/va-digital-services-platform-docs/api-reference/#/in_progress_forms)]

`GET /v0/in_progress_forms/MDOT` returns the following... (note the lack of a `data` property)

```json
{
  "formData": {
    "fullName": {},
    "permanentAddress": {},
    "temporaryAddress": {},
    "ssnLastFour": "",
    "gender": "",
    "vetEmail": "",
    "dateOfBirth": "",
    "eligibility": {},
    "supplies": []
  },
  "metadata": {
    "version": 0,
    "prefill": true,
    "returnUrl": ""
  }
}
```

When requesting `GET /v0/in_progress_forms/MDOT`, the MDOT client in vets-api will make a request to the system of record for veteran details and supplies available to the veteran. See `V0::InProgressFormsController.camelized_prefill_for_user` and `FormProfiles::MDOT#prefill`. On the front-end, test against the possible responses for `MDOT::Client.new(user).get_supplies` which are mapped to `mdot.exceptions` values in `vets-api/config/locales/exceptions.en.yml` and then passed along in the response. Also, see `vets-api/spec/support/vcr_cassettes/mdot/get_supplies*.yml`.

## Dynamic Form Fields

[[using update and replace schema funcs](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-how-to-use-updateschema-and-repla)]

see `src/applications/disability-benefits/all-claims/pages/toxicExposure/toxicExposureConditions.js` for an example.

## Device Types, Device Names

How do we access other device types? (e.g. - assistive devices, nebulizers). Are these included in the request for supplies?

The `productGroup` property of a supply can be one of the following values: `['accessories', 'batteries', 'apnea']`. `'assistive devices'` will be added to this list in the near future.

The `deviceName` property of a supply indicates the associated device for the supply.

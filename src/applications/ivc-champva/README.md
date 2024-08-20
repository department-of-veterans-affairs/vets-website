# IVC-CHAMPVA Forms Readme

_Integrated Veteran Care - [Civilian Health and Medical Program of the Department of Veterans Affairs](https://www.va.gov/health-care/family-caregiver-benefits/champva/) (IVC-CHAMPVA)_

## Executive Summary

This document contains context and other relevant notes that apply specifically
to the forms implemented in this `ivc-champva` directory. It provides pointers
on running the applications locally, testing methods, and other useful info.

> [!IMPORTANT]
> [platform documentation](https://depo-platform-documentation.scrollhelp.site/developer-docs/) is always the best place to go for form application development information. This document should be consulted _in addition_ to those resources, not _instead_ of.

> [!NOTE]
> Any shell commands shown in this document assume a MacOS console environment and `bash`/`zsh`

## Contents

- [Purpose of IVC forms apps](#purpose-of-ivc-forms-apps)
- [Running the applications locally](#running-the-applications-locally)
  - Setup
  - Developing a form
  - Useful developer resources
  - Developer conveniences
- [Testing](#testing)
  - Unit testing
  - E2E testing
- [Connecting to vets-api](#connecting-to-vets-api)
  - Standing up the API locally
  - Mocking API Locally
  - Test Save In Progress Locally

## Purpose of IVC Forms Apps

The purpose of the IVC forms apps is to allow Veterans and their families to
apply for CHAMPVA benefits digitally rather than through traditional mail.

Each form app contained in this `ivc-champva` directory maps 1:1 to an
existing paper form that Veterans may use to apply for some benefit.

## Running the Applications Locally

This section covers running VA.gov locally and accessing the IVC-CHAMPVA
form apps.

### Setup

To run the IVC-CHAMPVA form apps locally:

1.  Follow all the steps contained in the [Platform documentation for running VA.gov locally](https://depo-platform-documentation.scrollhelp.site/developer-docs/run-and-build-va-gov-locally).

2.  Once you have completed local VA.gov setup per Platform
    documentation, simply
    start the server by running the following in a shell at the root of the `vets-website` repository (this will open a new browser window):
    `` bash # Run from root of `vets-website` repo - opens local VA.gov in web browser yarn watch --open ``

3.  Then, in the newly opened browser window append the specific
    form application sub URL you wish to access to the base site URL
    (**http://localhost:3001**). The individual form app URL can be found in
    the `manifest.json` for that particular form app.
    For example, to access form 10-7959C append the following rootURL value to **http://localhost:3001**:

    ```JavaScript
    // vets-website/src/applications/ivc-champva/10-7959C/manifest.json:
    // ...
    {
      "rootUrl": "/health-care/champva/other-insurance-form-10-7959c",
      // ...
    }
    // ...
    ```

    yielding: **localhost:3001/health-care/champva/other-insurance-form-10-7959c**

### Developing a Form

The IVC-CHAMPVA forms follow the process outlined for developing a
schema-less form found in the [Form
Digitization Development Guide](https://github.com/department-of-veterans-affairs/VA.gov-team-forms/blob/main/Engineering/Form%20Digitization%20development%20guide.md).

### Useful Developer Resources

These are some helpful links that contributed to certain implementation
aspects of the existing IVC-CHAMPVA forms.

- [Form digitization process](https://github.com/department-of-veterans-affairs/VA.gov-team-forms/blob/main/Engineering/Form%20Digitization%20development%20guide.md)
- [Example form skeleton PR](https://github.com/department-of-veterans-affairs/vets-website/pull/25232)
- [Passthrough CustomPage component](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/simple-forms/mock-simple-forms-patterns/pages/mockCustomPage.js) (useful for creating custom pages while still leveraging standard `uiSchema` and `schema` configuration)
- [Form library web component pattern source code](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/platform/forms-system/src/js/web-component-patterns)

### Developer Conveniences

This section contains some specific form configurations/tips that aid
with development.

**Pre-populating a form with test data**

To pre-populate a local form with test data

1. Create a JSON file that contains the test data you want the form to load.
   An example can be seen in
   `vets-website/src/applications/ivc-champva/10-7959C/tests/e2e/fixtures/data/test-data.json`.
   Note that the data keys should match exactly to the schema keys contained in your form config. I.e., if your form collects a `applicantName`, then your test data would look like:

   ```JSON
   {
     "data": {
       "applicantName": {"first": "John", "last": "Apple"}
     }
   }
   ```

2. Import the test data file in `form.js`:
   ```JavaScript
    // src/applications/ivc-champva/10-10d/config/form.js
   import mockData from "path/to/test-data.json";
   ```
3. Set the first form page's `initialData` property in `form.js`

   ```JavaScript
   // src/applications/ivc-champva/10-10d/config/form.js
   // ...
   const formConfig = {
     chapters: {
         pages: {
            page1: {
              initialData: mockdata.data,
            },
         }
     }
   }
   // ...
   ```

4. Save `form.js` and refresh the browser window

## Testing

This section provides some notes on the current unit test and E2E test
implementations.

### Unit testing

Unit testing for IVC-CHAMPVA form applications follows the procedures
outlined in this [Platform documentation](https://depo-platform-documentation.scrollhelp.site/developer-docs/unit-tests).

When adding unit tests to future IVC-CHAMPVA forms, check the existing unit
tests first to see if there are any that meet your present need. If so,
you can copy them to your new form app's `tests` directory and adapt as needed.

To run unit tests for a particular form application, run the following from within
the vets-website repository. Be sure to adjust the path to point to the form app
you want to test.

```bash
# Example unit test command for IVC form 10-10D
# In vets-website repo: run to generate coverage report for form app 10-10D:
yarn test:coverage-app ivc-champva/10-10D # <- change `10-10D` to desired form app
```

If you receive an obscure failure or err when running the unit test coverage
report it may be helpful to run the unit tests with `verbose` logging enabled:

```bash
# Example unit test command for IVC form 10-10D
# In vets-website repo: run unit tests with verbose debugging
yarn test:unit --app-folder ivc-champva/10-10D --coverage --coverage-html --log-level verbose # <- change `10-10D` to desired form app
```

### End to End testing

End to End (E2E) for IVC-CHAMPVA form applications follows the procedures
outlined in this [Platform documentation](https://depo-platform-documentation.scrollhelp.site/developer-docs/end-to-end-testing-with-cypress)

To run E2E tests for a particular form application, run the following from
within the vets-website repository. Be sure to adjust the path to point to the
E2E test you want to run.

```bash
# Example E2E test command for IVC form 10-10D
yarn cy:run --spec "src/applications/ivc-champva/10-10D/tests/10-10D.cypress.spec.js"
```

If you want to follow along visually while the E2E tests run, use the web browser
interface for Cypress.

1. Launch the web browser interface by running the following within the vets-website repo:
   ```bash
   yarn cy:open
   ```
2. Two web browser windows will open. In the test UI search for the desired
   test and click to run as shown in the below screenshot:
   ![image of cypress testing UI in Chrome](images/cypress.png 'Cypress testing UI')
3. Clicking on a test will begin the automated run in the same browser window.
   You will be able to watch as the form is automatically filled.

## Connecting to vets-api

This section discusses connecting a local instance of VA.gov to a local
instance of the backend API contained in the vets-api repo.

### Standing up the API locally

To stand up the API locally follow the instructions found in this
[Platform documentation](https://depo-platform-documentation.scrollhelp.site/developer-docs/running-vets-api-locally).

> [!NOTE]
> The "hybrid setup" referred to in [this document](https://depo-platform-documentation.scrollhelp.site/developer-docs/base-setup-vets-api) and explained in [this document](https://github.com/department-of-veterans-affairs/vets-api/blob/master/docs/setup/hybrid.md) has proven to be the most simple to set up/reliable (in our experience thus far).

If all goes well, once setup is complete the API (in hybrid mode) is started by running the following from within vets-api:

```bash
# Run this from within vets-api to start the Docker portion of the hybrid API setup
docker-compose -f docker-compose-deps.yml up
```

then, in another terminal window:

```bash
# Run this from within vets-api to start the rails server (hybrid API setup)
rails s
```

### Mocking API Locally

For some local development, a mocked API makes things easier and faster (for instance, testing Save In Progress or some Prefill behavior).

To mock portions of the API, [follow this guide here](https://github.com/department-of-veterans-affairs/vets-website#running-a-mock-api-for-local-development).

### Test Save In Progress Locally

To Save In Progress locally you must mock vets-api locally to intercept the frontend's User and SIP GET/PUT calls and return mock responses for them.

1. Read over the [vets-website README info on Running a mock API](https://github.com/department-of-veterans-affairs/vets-website#running-a-mock-api-for-local-development). You will need to mock JSON static-responses for the user, SIP GET, & SIP PUT calls.
2. View the example mock set up in [ivc-champva/10-7959C](https://github.com/department-of-veterans-affairs/vets-website/pull/29340)'s local-mock-responses file to get an idea of how to set up your responses and mocks files.
3. To trigger the In-Progress state of the Intro-page's SIP-alert add the desired form-ID as a string into the `user.json`'s "in-progress-forms" array ([example here](https://github.com/department-of-veterans-affairs/vets-website/blob/8483a502755da0397e0a23ace2bd97d1791493de/src/applications/ivc-champva/10-7959C/tests/e2e/fixtures/mocks/user.json#L22)) -- e.g., `"in-progress-forms": ["10-7959C"]`, and the sip-get.json & sip-put.json support the SIP-alerts you see just above a form-pages back-continue buttons, as you input data into the fields
4. Launch the mocked API using the following command
    ```bash
    # Run in vets-website
    yarn mock-api --responses path/to/responses.js
    ```
5. To simulate a logged in user, visit the form locally in your browser and enter the following into the browser console:

   ```JavaScript
   // When viewing a form with a mocked API, imitate a logged in user by setting this in local storage:
   localStorage.setItem('hasSession', true);
   ```

For an example of a functional API mock for SIP, see this [ivc-champva/10-7959C](https://github.com/department-of-veterans-affairs/vets-website/pull/29340) pull request.

## Scheduling Maintenance Windows for External Backend Service (PEGA)

IVC CHAMPVA forms rely on the Pega backend service for handling form submissions. Periodically, it may be necessary to schedule some downtime while if Pega will be taken down for maintenance or some other reason.

To handle this, each IVC CHAMPVA form app is wrapped in a `DowntimeNotification` 
component. These read the state of the [Pega service in Pager Duty](https://dsva.pagerduty.com/service-directory/P3ZJCBK).

### Create a maintenance window

When a maintenance window is known, it can be scheduled in advance and then
automatically applied to the IVC CHAMPVA forms. To create a maintenance window,
navigate to the [Pega service in Pager Duty](https://dsva.pagerduty.com/service-directory/P3ZJCBK):

![Image of Pega service in Pager Duty (staging)](images/pager_duty/pager_duty0.png 'Pega service in Pager Duty (staging)')

Once on the service screen, scroll to the bottom where you will see the 
maintenance window section.

![Image of maintenance window section](images/pager_duty/pager_duty1.png 'Maintenance window section')

Click `Add a Maintenance Window`.

![Image of new maintenance window modal](images/pager_duty/create_window.png 'Add a maintenance window modal')

Enter the details for the maintenance window and save. Once the maintenance 
window is active, you will see a message indicating the active maintenance.

|Scheduled|Active|
|------|-----|
|![Image of scheduled window](images/pager_duty/window.png 'Scheduled maintenance window')| ![Image of active window](images/pager_duty/active_window.png 'Active maintenance window')|

When a maintenance window is active, IVC CHAMPVA forms display this message:

![Image of active maintenance window on IVC CHAMPVA form](images/pager_duty/maintenance.png 'Active maintenance message')

Maintenance windows may either be manually dismissed in Pager Duty, or will naturally expire.
Nothing needs to be done for the messages to show up on Va.gov, as the external service downtime
is automatically pulled in by each form via the `DowntimeNotification` component.

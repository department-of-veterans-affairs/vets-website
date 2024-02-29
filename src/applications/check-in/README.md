# Check-in Experience developer guide
The check-in experience application is split across two smaller applications, check-in and pre-check-in.

More specific details can be found in the specific README files for each sub-app.

check-in [README](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/check-in/day-of/README.md)

pre-check-in [README](https://github.com/department-of-veterans-affairs/vets-website/blob/main/src/applications/check-in/pre-check-in/README.md)

## Quick start to get running locally
Before you get started check [this page](https://depo-platform-documentation.scrollhelp.site/developer-docs/setting-up-your-local-frontend-environment) first to make sure you are setup to use the correct version of Node and Yarn.
  - clone vets-website repo `git clone git@github.com:department-of-veterans-affairs/vets-website.git`
  - navigate to the check-in application `cd src/applications/check-in`
  - run `yarn install`
  - run `yarn workspace @department-of-veterans-affairs/applications-check-in install`
  - turn on local mocks `yarn --cwd $( git rev-parse --show-toplevel ) mock-api --responses src/applications/check-in/api/local-mock-api/index.js`
  - start app `yarn --cwd $( git rev-parse --show-toplevel ) watch --env entry=check-in,pre-check-in,travel-claim`
  - visit the app:
    - check-in `http://localhost:3001/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287`
    - pre-check-in `http://localhost:3001/health-care/appointment-pre-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287`
    - travel-claim `http://localhost:3001/my-health/appointment-travel-claim/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287`
  - Login using the mock user, Last name: `Smith` DOB: `04-07-1935`

## Mock UUIDs
There are several different mock UUIDs that can be used as a value for the `id` URL param.
### Check-in
  - defaultUUID: `46bebc0a-b99c-464f-a5c5-560bc9eae287`
  - aboutToExpireUUID: `25165847-2c16-4c8b-8790-5de37a7f427f`
  - pacificTimezoneUUID: `6c72b801-74ac-47fe-82af-cfe59744b45f`
  - allAppointmentTypesUUID: `bb48c558-7b35-44ec-8ab7-32b7d49364fc`
  - missingUUID: `a5895713-ca42-4244-9f38-f8b5db020d04`
  - noFacilityAddressUUID: `5d5a26cd-fb0b-4c5b-931e-2957bfc4b9d3`
  - demographicsConfirmedUUID: `3f93c0e0-319a-4642-91b3-750e0aec0388`

### Pre-check-in
  - defaultUUID: `46bebc0a-b99c-464f-a5c5-560bc9eae287`
  - phoneApptUUID: `258d753c-262a-4ab2-b618-64b645884daf`
  - alreadyPreCheckedInUUID: `4d523464-c450-49dc-9a18-c04b3f1642ee`
  - canceledAppointmentUUID: `9d7b7c15-d539-4624-8d15-b740b84e8548`
  - canceledPhoneAppointmentUUID: `1448d690-fd5f-11ec-b939-0242ac120002`
  - expiredUUID: `354d5b3a-b7b7-4e5c-99e4-8d563f15c521`
  - expiredPhoneUUID: `08ba56a7-68b7-4b9f-b779-53ba609140ef`
  - missingUUID: `a5895713-ca42-4244-9f38-f8b5db020d04`
  - noFacilityAddressUUID: `5d5a26cd-fb0b-4c5b-931e-2957bfc4b9d3`
  - allDemographicsCurrentUUID: `e544c217-6fe8-44c5-915f-6c3d9908a678`
  - onlyDemographicsCurrentUUID: `7397abc0-fb4d-4238-a3e2-32b0e47a1527` (NoK and Emergency Contact not current)

### Travel-claim
  - defaultUUID: `46bebc0a-b99c-464f-a5c5-560bc9eae287`
  - multiApptSingleFacilityUUID: `d80ade2e-7a96-4a30-9edc-efc08b4d157d`
  - multiApptMultiFacilityUUID: `8379d4b5-b9bc-4f3f-84a2-9cb9983a1af0`

## Design system
99% of the styling comes from the VA design system [component library](https://design.va.gov/components/) and [utility classes](https://design.va.gov/foundation/utilities/). For the remaining 1% of styling there is an scss file in the `sass` directory in the project root.

When adding features, use components from the design system as much as possible. For general spacing, layout, typography, borders, etc... use the utility classes rather than adding to the style sheet.

## Code style
### Try to be generic
The check-in and pre-check-in apps are very similar, so when possible use and add to the common reducer, selector, and utils found in the root of the two apps.
### Function parameters
If you have more than two parameters, structure the parameters in an object to increase readability and ease of use.
## Page routing
Internal page routing is defined in `utils\navigation`. Within this directory there are sub-directories for `day-of` and `pre-check-in`. The index file in each sub-directory contains an object that determines the order of the pages. Within the hooks there is a `useFormRouting` hook that is used to route to the next page, previous page, error page, or any specific page in the app.

## Running tests
Unit tests for both check-in and pre-check-in can be run using this command: `yarn test:unit --app-folder check-in`. To get detailed errors, run this command with `--log-level=error`. To get coverage reports run this command `yarn test:unit --app-folder check-in --coverage --coverage-html`. View the report at `/coverage/index.html`

Cypress tests can be run with the GUI using this command: `yarn cy:open`. From there you can filter by `check-in` to run just check-in and pre-check-in end to end tests.

Run Cypress from command line:
- Run all `yarn cy:run --spec "src/applications/check-in/**/**/*"`
- Specify browser `-b electron`

## Writing tests
### Unit tests
Components that need to access data from redux (or have children that do) require a provider wrapper to initialize a mock store. Also needed for most components is a provider wrapper to import the i18n translations. To help reduce the repatative boiler plate a new provider has been created that incorporates both of these providers with default data. Located in `tests\unit\utilsCheckInProvider.jsx` the file exports the `CheckInProvider` component that can be imported into a unit test and wrapped around the component you are testing. This provider also sets up a basic router prop the will be automatically passed to its children. Also included is the requred `scheduledDowntimeState` redux store via the `createStore` util used within the provider. You can pass overrides to both the store and the router for the custom data needs of your component or test.
## Flaky tests
We have a running ticket every sprint to address flaky tests that are flagged by platform. When addressing a test, add it to our running log here: https://docs.google.com/spreadsheets/d/1tqsbBonIbSSq3enPQcd-yg0KSzSBp38TRD3D_tKq3qU/edit#gid=0

You can get the stress tests to re-run in a PR by simply adding a comment in the test or by making any other change. Look at the issues and address any thing that comes up when the test is run in the pipeline. If the tests pass, mark the test as `Snoozed` in the sheet and incriment the instances. If you do work on the test, mark the test as `Fixed problem` in the sheet. Make sure to keep the notes for each test updated. If a test continues to get flagged but works when snoozing, make a plan to re-write the test. Tests that pass stress tests in a PR are automatically removed from the flaky tests list.
## Translations
This application uses i18next to translate text to Spanish and Tagalog. Translation files for English, Spanish, and Tagalog are located in `/locals` at the root of the check-in application. All text is contained in the `translation.json` file for each language. The application should only reference the unique key for each text string with a `<Trans />` component or a `t()` function. Never hard code text within the application.

### Adding new text
When new text is needed in the application, first make a key in the English `translation.json` file. Add the new key to the bottom of the file. Keep your key no more than 80 characters long. You can simply use the first few unique characters of the string or a descriptive key that describes the text is acceptable. Example `check-in-disclaimer-text`. Each word in the key should be separated by a `-`. Do not add the key to any of the other `translation.json` files. A diff of the json files will be performed periodically and the missing keys in other files will be used to request new translations.

### Adding translations
After we receive new translations, you can add them to their respective `translation.json` files. At this time it is a good practice to alphabetize the English, Spanish, and Tagalog keys.

### Changing text
If there is a need to change text, the best practice is to create a new key. If you used a descriptive key rather than the actual text for the key, you can add a v(X) on to the end of the key. Example `check-in-disclaimer-text-v2`. This way the changed text keys will come up for translation in the next diff audit. The exception to this rule is for simple grammar changes where the translation likely won't be affected.

## Ticket lifecycle
When starting a new ticket follow these steps:
  - Assign the ticket to your self if not already assigned to you.
  - Move the ticket to in-progress.
  - Name your branch with this convention `checkin/[ticket#]/[short-description]`
  - Creating a draft PR early on is helpful for others to help troubleshoot issues.
  - When you are finished create a PR or convert your draft to a PR. If the automated tests pass, copy a link to the PR and post it to the [#check-in-experience-engineering slack chat](https://dsva.slack.com/archives/C02G6AB3ZRS) requesting a review by tagging `@check-in-fe`
  - After approval, you can merge. Then move the ticket to the validate column.
  - Add a comment to the ticket with mobile size (320-375px) screenshots and tag the UX team to review.
  - If it is approved, you can move the ticket to the closed column.

Merging your PR may mean merging to a feature branch. Always be aware that anything that gets merged to `main` will get deployed in the next daily deployment. If you aren't sure if something should get merged to `main` ask in slack. Also make sure to not merge anything that may have gone stale since the PR was first created. It is helpful to rebase before merging just to make sure you are up to date.

If you have any questions along the way be sure to ask in slack.

## How it works
Check-in allows veterans to check into an appointment on the day of their appointment while physically at a VA clinic. They also get the opportunity to file a mileage only travel-claim if they are eligible. The veteran texts `check-in` to `VEText` and gets returned a short-url that re-directs to the check-in application with a unique UUID for the appointment.

Pre-check-in allows veterans to pre-check into an appointment between 1 -7 days ahead of the appointment. This usually happens when the veteran is not at a VA clinic. The vet will receive a text from `VEText` with a short-url that re-directs to the pre-check-in application with a unique UUID for the appointment.

Travel-claim allows veterans to file a mileage only travel claim on the day of the appointment they are filing for. The veteran texts `travel` to `VEText` and gets returned a short-url that re-directs to the travel-claim application with a unique UUID for the appointment.

## Generating screenshots with Cypress
We use Cypress to capture screenshots of each page of this application. The screenshot capturing is conditional on the env variable `with_screenshots` and won't run in CI. The following commands will generate screenshots in the `vets-website/cypress/screenshots` directory, these are to be run headless with out the Cypress GUI running.

Current features PCI & day-of: `yarn cy:run --env with_screenshots=true --spec src/applications/check-in/tests/e2e/screenshots/screenshots-current.all.cypress.spec.js`

Current features PCI only: `yarn cy:run --env with_screenshots=true --spec src/applications/check-in/tests/e2e/screenshots/screenshots-current.pci.cypress.spec.js`

Current features day-of only: `yarn cy:run --env with_screenshots=true --spec src/applications/check-in/tests/e2e/screenshots/screenshots-current.day-of.cypress.spec.js`

Phone appointments PCI: `yarn cy:run --env with_screenshots=true --spec src/applications/check-in/tests/e2e/screenshots/screenshots-phone.pci.cypress.spec.js`

Travel Pay day-of: `yarn cy:run --env with_screenshots=true --spec src/applications/check-in/tests/e2e/screenshots/screenshots-travel-pay.day-of.cypress.spec.js`

Errors only day-of: `yarn cy:run --env with_screenshots=true --spec src/applications/check-in/tests/e2e/screenshots/screenshots-errors.day-of.cypress.spec.js`

Errors only PCI: `yarn cy:run --env with_screenshots=true --spec src/applications/check-in/tests/e2e/screenshots/screenshots-errors.pci.cypress.spec.js`

### Adding additional screenshots
There is a cypress command that gets imported in our local commands named `createScreenshots`. It is best used after an axe check on the page you wish to capture. Add cy.createScreenshots([filename]) and also make sure that the test is imported in one of the screenshot scripts listed above. Filename syntax should be `application--page-name` example: `Pre-check-in--Validate-with-DOB`. The command will automatically get screenshots for translated versions of the page.

## Adding Feature Toggles

To add a feature toggle follow the steps oulined in the VA Platform Documentation on [Feature Toggles](https://depo-platform-documentation.scrollhelp.site/developer-docs/feature-toggles-guide). Additionally add the feature toggle to selectors, mocks and the readme for Pre-check-in and/or Check-in apps.

- src/applications/check-in/utils/selectors/feature-toggles.js
- src/applications/check-in/utils/selectors/tests/feature-toggles.unit.spec.js
- src/applications/check-in/api/local-mock-api/mocks/v2/feature-toggles/index.js
- src/applications/check-in/day-of/README.md
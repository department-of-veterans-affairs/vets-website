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
  - turn on local mocks `yarn mock-api --responses src/applications/check-in/api/local-mock-api/index.js`
  - start app `yarn watch --env entry=check-in,pre-check-in`
  - visit the app:
    - check-in `http://localhost:3001/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287`
    - pre-check-in `http://localhost:3001/health-care/appointment-pre-check-in/?id=0429dda5-4165-46be-9ed1-1e652a8dfd83`
  - Login using the mock user, Last name: `Smith` Last four: `1234` or DOB `03-15-1989`

## Mock UUIDs
There are several different mock UUIDs that can be used as a value for the `id` URL param.
### Check-in
  - defaultUUID: `46bebc0a-b99c-464f-a5c5-560bc9eae287`
  - aboutToExpireUUID: `25165847-2c16-4c8b-8790-5de37a7f427f`
### Pre-check-in
  - defaultUUID: `0429dda5-4165-46be-9ed1-1e652a8dfd83`
  - alreadyPreCheckedInUUID: `4d523464-c450-49dc-9a18-c04b3f1642ee`
  - canceledAppointmentUUID: `9d7b7c15-d539-4624-8d15-b740b84e8548`
  - expiredUUID: `354d5b3a-b7b7-4e5c-99e4-8d563f15c521`

## Design system
99% of the styling comes from the VA design system [component library](https://design.va.gov/components/) and [utility classes](https://design.va.gov/foundation/utilities/). For the remaining 1% of styling there is an scss file in the `sass` directory in the root of each sub-application.

When adding features, use components from the design system as much as possible. For general spacing, layout, typography, borders, etc... use the utility classes rather than adding to the style sheet.

## Try to be generic
The check-in and pre-check-in apps are very similar, so when possible use and add to the common reducer, selector, and utils found in the root of the two apps.

## Page routing
Internal page routing is defined in `utils\navigation`. Within this directory there are sub-directories for `day-of` and `pre-check-in`. The index file in each sub-directory contains an object that determines the order of the pages. Within the hooks there is a `useFormRouting` hook that is used to route to the next page, previous page, error page, or any specific page in the app.

## Running tests
Unit tests for both check-in and pre-check-in can be run using this command: `yarn test:unit --app-folder check-in`. To get detailed errors, run this command with `--log-level=error`

Cypress tests can be run with the GUI using this command: `yarn cy:open`. From there you can filter by `check-in` to run just check-in and pre-check-in end to end tests.

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
Check-in allows veterans to check into an appointment on the day of their appointment while physically at a VA clinic. The veteran texts `check-in` to `VEText` and gets returned a short-url that re-directs to the check-in application with a unique UUID for the appointment.

Pre-check-in allows veterans to pre-check into an appointment between 1 -7 days ahead of the appointment. This usually happens when the veteran is not at a VA clinic. The vet will receive a text from `VEText` with a short-url that re-directs to the pre-check-in application with a unique UUID for the appointment.
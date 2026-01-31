# Appointments

This is the front end source for the Appointments application. Veterans can schedule, request, and view appointments through this application.

It is a React/Redux application that makes heavy use of MomentJS. Tests are written with React Testing Library and Cypress.


## Quick start

1. Clone vets-website locally and run `yarn install`
2. Run `yarn --cwd $( git rev-parse --show-toplevel ) watch --env entry=vaos`
3. In a separate terminal run `yarn mock-api --responses src/applications/vaos/services/mocks/index.js`
4. Open http://localhost:3001 and type `localStorage.setItem('hasSession', true)` into the dev console
5. Open http://localhost:3001/my-health/appointments/

## Frontend Documentation

Documentation for the frontend of the VAOS application is generated using [JSDoc](https://jsdoc.app/).

### Documentation outline

The documentation navigation is separated into type sections. We currently have sections for `Modules` and `Global`. The `Modules` section consists of services and helper method definitions broken up by file. The `Global` section contains type definitions for the resource objects that we receive from our various [data sources](https://github.com/department-of-veterans-affairs/vets-website/tree/main/src/applications/vaos#api-interaction).

### Documentation guidelines

We want to document shared services and helper methods as well as any type definitions for VAOS specific resource objects. This includes `/services` functions and transformers, mock data helpers, and type definitions in `*.types` files.

### Generate the docs

Run the following command:

```
yarn jsdoc -c src/applications/vaos/jsdoc.json
```

Docs are generated at `src/applications/vaos/docs/index.html`

You can also watch the docs for changes and rebuild:

```
npx nodemon --exec "yarn jsdoc -c src/applications/vaos/jsdoc.json" --watch src/applications/vaos --ignore 'docs/*' -e js,jsx,md,json
```

## Organization

The application has four major sections

- /appointment-list
  - The code for the appointment list and detail pages
- /new-appointment
  - The code for the new appointment and request flows
- /covid-19-vaccine
  - In progress vaccine appointment scheduling MVP
- /referral-appointments
  - The code for the referrals and requests and scheduling a Commnunity Care referral appointment

Application sections are generally organized into three folders:

- /components
  - Pages and sub-components for that section of the application
- /redux
  - The Redux actions, reducers, and selectors used in that part of the app
- /sass
  - Any styles used by the section of the app

Each section also has an index.jsx file which includes global logic for that section, the routes for that section, and an exported reducer

### API interaction

VAOS interacts with several different backend systems, via endpoints defined in vets-api.

Those services are:

- Mobile Appointment Service (VAMF)
  - Source for video and VistA appointments
- var-resources (VAMF)
  - Scheduling and requests related endpoints
- Mobile facilities service (VAMF)
  - Request and direct scheduling settings by facility
- VA facilities service (Lighthouse)
  - VA facility data
- Community care provider search (PPMS)
  - Community care provider listing

### Mock API

Local development of the application requires use of the [mock API](https://github.com/department-of-veterans-affairs/vets-website#running-a-mock-api-for-local-development). Run the following command to provide the mock API VAOS specific mock data:

```
yarn mock-api --responses src/applications/vaos/services/mocks/index.js
```
### Mock scenarios for Referrals and Requests

- http://localhost:3001/my-health/appointments/schedule-referral?id=error
  - Should show a generic referral error indicating that vets-api returned any error status code when fetching that referral.


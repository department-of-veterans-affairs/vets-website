# VA Online Scheduling

This is the front end source for the VAOS application. Veterans can schedule, request, and view appointments through this application.

It is a React/Redux application that makes heavy use of MomentJS. Tests are written with React Testing Library and Cypress.

## Frontend Documentation

Documentation for the frontend of the VAOS application is generated using [JSDoc](https://jsdoc.app/).

### Documentation outline

The documentation navigation is separated into type sections. We currently have sections for `Modules` and `Global`. The `Modules` section consists of services and helper method definitions broken up by file. The `Global` section contains type definitions for the resource objects that we receive from our various [data sources](https://github.com/department-of-veterans-affairs/vets-website/tree/master/src/applications/vaos#api-interaction).

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

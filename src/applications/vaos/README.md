# VA Online Scheduling

This is the front end source for the VAOS application. Veterans can schedule, request, and view appointments through this application.

It is a React/Redux application that makes heavy use of MomentJS. Tests are written with React Testing Library and Cypress.

Generate the docs:

```
yarn jsdoc -c src/applications/vaos/jsdoc.json
```

Docs are generated at `src/applications/vaos/docs/index.html`

Watch the docs for changes and rebuild:

```
npx nodemon --exec "yarn jsdoc -c src/applications/vaos/jsdoc.json" --watch src/applications/vaos --ignore 'docs/*' -e js,jsx,md,json
```

## Organization

The application has four major sections

- /appointment-list
  - The code for the appointment list and detail pages
- /new-appointment
  - The code for the new appointment and request flows
- /express-care
  - The code for the new Express Care request flow
- /project-cheetah
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
- Mobile facilties service (VAMF)
  - Request and direct scheduling settings by facility
- VA facilities service (Lighthouse)
  - VA facility data
- Community care provider search (PPMS)
  - Community care provider listing

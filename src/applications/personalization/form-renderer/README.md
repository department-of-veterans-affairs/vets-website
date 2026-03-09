# form-renderer

## URL
http://localhost:3001/my-va/submissions/:id

## Common commands
```bash
# Development
yarn watch --env entry=form-renderer
yarn watch --env entry=form-renderer,auth,static-pages,login-page,verify,profile

# Mock API
yarn mock-api --responses src/applications/personalization/form-renderer/mocks/mock-api-full-data.js

# Unit tests
yarn test:unit src/applications/personalization/form-renderer/tests/App.unit.spec.jsx

# E2E tests
yarn cy:open
yarn cy:run --spec "src/applications/form-renderer/tests/e2e/form-renderer.cypress.spec.js"
```

## Mock API

The mock API server found at `/form-renderer/mocks/mock-api-full-data.js` contains mocks for both hitting the form-renderer directly, and for seeing it after submitting a 686c. 

The testdata.js file contains a truncated mock template and mock submission form data to populate the renderer. The FULL template and data can be found at https://github.com/department-of-veterans-affairs/form-renderer/blob/main/dev-playgrounds/sandbox-bundled/src/testdata.js

If you need to expand the add more info to the template or data for testing purposes, simply edit the `testdata.js` file locally. 

The same goes for the 686c form data. If you need more expanded 686 data, check out /src/applications/dependents/686c-674/tests/mock-api-full-data.js

### Viewing the renderer directly (without having to fill out the form):

Start the mock API by running:

`yarn mock-api --responses src/applications/form-renderer/mocks/mock-api-full-data.js`

Start the application by running:

`yarn watch --env entry=form-renderer`

Navigate to: `localhost:3001/my-va/submissions/12345`

The renderer should load. 

### Viewing the Renderer after filling out the 686 

Start the mock API by running:

`yarn mock-api --responses src/applications/form-renderer/mocks/mock-api-full-data.js`

Start the mock API by running:

`yarn watch --env entry=form-renderer,686C-674-v2,dependents-view-dependents`

(Note that this is different from running it the direct way. This command also starts the dependents applications.)

At `localhost:3001`, click the profile at the top right (should say John). Click "Dependents". Click "Add or remove a dependent". Scroll down, and click "Continue your application". Fill out form, and submit. Click "Download or print the information you submitted (opens in a new tab)" and the renderer should open. 

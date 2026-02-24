# Profile 2.0
<!-- TOC -->

- [Profile 2.0](#profile-20)
  - [Test users](#test-users)
  - [Contact info and the VA Profile service](#contact-info-and-the-va-profile-service)
  - [Direct deposit](#direct-deposit)
  - [Connected apps](#connected-apps)
  - [Set up Codespaces for testing](#set-up-codespaces-for-testing)
    - [Prerequisites](#prerequisites)
    - [Step 1: ready your dockerfile](#step-1-ready-your-dockerfile)
    - [Step 2: Creating the code space](#step-2-creating-the-code-space)
    - [Step 3: Changes to make the site run the environment](#step-3-changes-to-make-the-site-run-the-environment)
      - [Turn off CORS](#turn-off-cors)
      - [Disable the FOOTER IMAGE](#disable-the-footer-image)
      - [Trick user session](#trick-user-session)
    - [Step 4: Start mock API](#step-4-start-mock-api)
      - [Start the API](#start-the-api)
      - [Make it public](#make-it-public)
      - [Test it](#test-it)
    - [Step 5: Start the website](#step-5-start-the-website)
      - [Build](#build)
      - [Run](#run)
      - [PORTS](#ports)
      - [Things of note](#things-of-note)
- [Testing](#testing)
  - [Unit tests](#unit-tests)
  - [e2e tests](#e2e-tests)
    - [Open Cypress UI](#open-cypress-ui)
    - [Run Cypress from command line](#run-cypress-from-command-line)

<!-- /TOC -->
## Test users

Users must be LOA3 to access most of the Profile features. Users must also have two-factor set up to access the Direct Deposit feature.

Staging test users for all sections are laid out in [this spreadsheet](https://docs.google.com/spreadsheets/d/1pirWRnmdJb5o_BxY8N4Qbq3_mB1PdZ-x-gwzgMZO66k/edit#gid=0). [This is another doc containing Direct Deposit test users](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity-personalization/direct-deposit/test-users.md).

## Contact info and the VA Profile service

Contact info is powered by the VA Profile service (Slack Channel #va-profile) formerly known as Vet 360. You'll still see references to Vet 360 or just 360 in the code. It is not possible to connect to VA Profile through `vets-api` when running locally. All calls to update contact info are mocked entirely in the front end by short-circuiting API requests at the Redux action-creator level by making a call to the `isVAProfileServiceConfigured()` helper. `local-vapsvc.js` provides a lot of helper functions you can call from action creators to simulate different scenarios such as a failure.

VA Profile is an asynchronous, transaction-based service. Making updates is a two step process. First, you create a transaction ("Please update the phone number to 555-123-1234") and get back a transaction ID. Then you check on the status of that transaction ("Have you finished with transaction ID ABC-123?") until it has resolved or failed.

## Direct deposit

Users must be LOA3 and have 2FA set up to access Direct Deposit. Users must also be eligible for Direct Deposit (based on the response from the `GET v0/profile/direct_deposits` endpoint) to see the feature (most user will not see the feature in their Profile). Some users who have direct deposit set up are blocked from accessing the feature because they are flagged as deceased, incompetent, or having a fiduciary.

## Connected apps

When running the app locally, all test users will have 2 connected apps available to them as they are mocked [here](src/applications/personalization/profile/mocks/endpoints/connected-apps/index.js).

[How to connect apps in staging](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/identity-personalization/profile/Combine%20Profile%20and%20Account/QA/how-to-turn-on-connected-apps.md)

## Set up Codespaces for testing

### Prerequisites

- Have some commits on a feature branch to test

### Step 1: ready your dockerfile

1. Update the [dockerfile](https://github.com/department-of-veterans-affairs/vets-website/blob/main/.devcontainer/Dockerfile#L29) on your local branch by removing `libappindicator1`.

### Step 2: Creating the code space

1. Push your branch to github
2. Create a code space with at least **16GB of ram**

### Step 3: Changes to make the site run the environment

 > commits of differences: <https://github.com/department-of-veterans-affairs/vets-website/compare/main...profile/spike/42144/codespaces>

#### Turn off CORS

Turn off CORS for all api calls by commenting out `credentials: 'include` for relevant API calls

- [feature toggle](src/platform/utilities/feature-toggles/flipper-client.js)
- [profile dashboard, platform utilities](src/platform/utilities/api/index.js)
- [keepAliveSSO](src/platform/utilities/sso/keepAliveSSO.js)

#### Disable the FOOTER IMAGE

- For some reason, there is a synchronous image call in the footer that needs to be removed or the initial load of the page will be blocked until that times out
  - [footer](src/platform/site-wide/va-footer/components/Footer.jsx)

#### Trick user session

- Force the user to have a session by adding `localStorage.setItem('hasSession', true);` in the site header in `src/platform/site-wide/header/index.js`
- Update the the `local-vapsvc.js` return true
  - this ensures that calls actually go out the mock api
  - [local-vapsvc.js](src/platform/user/profile/vap-svc/util/local-vapsvc.js)

### Step 4: Start mock API

#### Start the API

Open a terminal and start the the mock api

```bash
yarn mock-api --responses src/applications/personalization/profile/mocks/server.js
```

#### Make it public

Be sure to change the PORT from private to public.

#### Test it

Open the mock api url, and visit `/v0/user` to test it. You should see a JSON response of the user object, remember this url.

### Step 5: Start the website

#### Build

Since we are running the site as a static site, build the app in localhost mode. We need build for the locally environment so we can change the API url to the mock api we are running in this instance

```bash
 yarn build:webpack:local --env api="http://localhost:3000"
```

Use the the url from step 4 as your api url

#### Run

We are going to serve the built website through a static server, defining the PORT as `3001`

```bash
WEB_PORT=3001 node src/platform/testing/e2e/test-server.js --buildtype=localhost
```

#### PORTS

Just like the API, make sure to change the PORT to public.

#### Things of note

- The main content will never load, that is static content. That is outside the scope of this setup.
- Sometimes its a refresh or two to get things going
- If you make changes, you will have to re-build and re-start the server

# Testing

## Unit tests

Run all unit tests for Profile:
```
yarn test:unit src/applications/personalization/profile/tests/**/*.unit.spec.js*
```

## e2e tests

**Before running any Cypress tests**, first make sure that:
1. `vets-website` is being served locally on port 3001
2. any mock server is **NOT** running
   - this includes `vets-api` or our local mock server 

### Open Cypress UI
Caveat: can be buggy and laggy
```
yarn cy:open
```
### Run Cypress from command line
Run all e2e tests for Profile:
```
yarn cy:run --spec "src/applications/personalization/profile/tests/e2e/**/*"
```

Run specific test:
```
yarn cy:run --spec "path/to/test-file.cypress.spec.js"
```
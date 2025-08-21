# Travel Pay

<!-- TOC -->

- [Travel Pay](#travel-pay)
  - [Test Users](#test-users)
  - [Local FE development only](#local-fe-development-only)
    - [Start mock API](#start-mock-api)
      - [Start the API](#start-the-api)
      - [Test it](#test-it)
    - [Start the website](#start-the-website)
      - [Build](#build)
      - [Run](#run)
      - [Trick user session](#trick-user-session)
      - [Things of note](#things-of-note)

<!-- /TOC -->

## Test users

Users should have a contact in Dynamics and travel related claims already in BTSSS in order to show their statuses.

Staging test users are laid out in [this spreadsheet](https://docs.google.com/spreadsheets/d/1hpFNNk1Iv4X1W8C9dc13KA73V1mhI1zZ).

## Local FE development (non-api)

### Start mock API

#### Start the API

Open a terminal and start the the mock api

```bash
yarn mock-api --responses src/applications/travel-pay/services/mocks/index.js
```

#### Test it

Open the mock api url, and visit `/v0/user` to test it. You should see a JSON response of the user object.

### Start the website

#### Build

Since we are running the site as a static site, build the app in localhost mode. We need build for the locally environment so we can change the API url to the mock api we are running in this instance

```bash
yarn build:webpack:local --env api="http://localhost:3000"
```

#### Run

We are going to serve the built website through a static server, defining the PORT as `3001`

```bash
WEB_PORT=3001 node src/platform/testing/e2e/test-server.js --buildtype=localhost
```

#### Trick user session

- Force the user to have a session by opening your console and typing `localStorage.setItem('hasSession', true)` into the dev console

#### Things of note

- The main content will never load, that is static content. That is outside the scope of this setup.
- Sometimes its a refresh or two to get things going
- If you make changes, you will have to re-build and re-start the server

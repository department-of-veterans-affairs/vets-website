## Start mock API

Open a terminal and start the the mock api

```bash
yarn mock-api --responses src/platform/mhv/api/mocks
```

## Run MHV apps

To run all MHV apps:

- start the mock API
- start app `yarn watch --env entry=mhv-landing-page,mhv-secure-messaging,medications,medical-records,vaos`
- If necessary, run this in your browser console to simulate being logged in `localStorage.setItem('hasSession', true);`
- visit the app: `http://localhost:3001/my-health/`

If you only want to run a subset of apps, remove apps you don't want from the `yarn watch...` command.

## Start mock API in Codespaces

- In Github Profile settings, navigate to `Codespaces`, add a secret `VETS_WEBSITE_MHV_MOCK_SERVICE` with value `YES`.
- Create `Codespaces` instance. Once the build succeeds, the following commands will already be running:
  - `yarn mock-api --responses src/platform/mhv/api/mocks`
  - `yarn watch`
- Change both Ports visibility to `Public`.

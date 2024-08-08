## Start mock API

Open a terminal and start the the mock api

```bash
yarn mock-api --responses src/platform/mhv/api/mocks
```

## Start mock API in Codespaces

- In Github Profile settings, navigate to `Codespaces`, add a secret `VETS_WEBSITE_MHV_MOCK_SERVICE` with value `YES`.
- Create `Codespaces` instance. Once the build succeeds, the following commands will already be running:
  - `yarn mock-api --responses src/platform/mhv/api/mocks`
  - `yarn watch`
- Change both Ports visibility to `Public`.

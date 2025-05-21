# MHV on va.gov

## Helpful commands

To watch all the MHV apps

``` sh
yarn watch --env entry=auth,mhv-landing-page,mhv-secure-messaging,medications,medical-records,mhv-supply-reordering
```

To run the mocks for MHV

``` sh
yarn mock-api --responses src/platform/mhv/api/mocks/index.js
```

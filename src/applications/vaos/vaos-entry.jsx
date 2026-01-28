import 'platform/polyfills';
import './sass/vaos.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';

import startApp from 'platform/startup/router';
import createRoutesWithStore from './routesV2';
import manifest from './manifest.json';
import reducer from './redux/reducer';
import { vaosApi } from './redux/api/vaosApi';
import slice from './services/appointment/apiSlice';
import facilitySlice from './services/location/apiSlice';
// import healthCareSlice from './services/healthcare-service/apiSlice';
import schedulingCofigurationSlice from './services/scheduling-configuration/apiSlice';
import healthcareSlice from './services/healthcare-service/apiSlice';

startApp({
  url: manifest.rootUrl,
  createRoutesWithStore,
  reducer,
  entryName: manifest.entryName,
  additionalMiddlewares: [
    vaosApi.middleware,
    slice.middleware,
    facilitySlice.middleware,
    // healthCareSlice.middleware,
    schedulingCofigurationSlice.middleware,
    healthcareSlice.middleware,
  ],
});

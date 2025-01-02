import '@department-of-veterans-affairs/platform-polyfills';
import './sass/default-routing.scss';

import { startAppFromRouterV6 } from '@department-of-veterans-affairs/platform-startup/exports';

import router from './router';
import reducer from './reducers';
import manifest from './manifest.json';

startAppFromRouterV6({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  router,
  fetchScheduledDowntimes: true,
});

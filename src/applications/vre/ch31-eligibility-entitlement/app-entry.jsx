import '@department-of-veterans-affairs/platform-polyfills';
import './sass/ch31-eligibility-entitlement.scss';

import startApp from 'platform/startup/router';
import { buildRoutes } from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  routes: buildRoutes(),
  reducer,
  entryName: manifest.entryName,
});

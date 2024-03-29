import '@department-of-veterans-affairs/platform-polyfills';
import { startAppFromRouter as startApp } from '@department-of-veterans-affairs/platform-startup/exports';

import './sass/claims-status.scss';

import manifest from './manifest.json';
import routes from './routes';
import reducer from './reducers';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

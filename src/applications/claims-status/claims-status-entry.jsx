import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup/index';

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

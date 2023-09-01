import '@department-of-veterans-affairs/platform-polyfills';
import './sass/associated-persons.scss';
// import { startAppFromIndex as startApp } from '@department-of-veterans-affairs/platform-startup/exports';
import { startAppFromRouter as startApp } from '@department-of-veterans-affairs/platform-startup/exports';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  reducer,
  routes,
  url: manifest.rootUrl,
});

import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup/router';

import './sass/rated-disabilities.scss';

import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';

startApp({
  entryName: manifest.entryName,
  reducer,
  routes,
  url: manifest.rootUrl,
});

import '@department-of-veterans-affairs/platform-polyfills';
import './sass/mhv-landing-page.scss';

import startApp from '@department-of-veterans-affairs/platform-startup/index';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

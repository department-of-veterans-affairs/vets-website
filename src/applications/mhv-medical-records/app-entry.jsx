import '@department-of-veterans-affairs/platform-polyfills';
import './sass/medical-records.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';

import startApp from '@department-of-veterans-affairs/platform-startup/router';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  entryName: manifest.entryName,
  reducer,
  routes,
});

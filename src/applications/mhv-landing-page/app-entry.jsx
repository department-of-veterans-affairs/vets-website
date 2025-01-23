import '@department-of-veterans-affairs/platform-polyfills';
import './sass/mhv-landing-page.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';
import startApp from '@department-of-veterans-affairs/platform-startup/router';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  reducer,
  routes,
  url: manifest.rootUrl,
});

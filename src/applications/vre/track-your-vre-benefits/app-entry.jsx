import '@department-of-veterans-affairs/platform-polyfills';
import './sass/track-your-vre-benefits.scss';

import startApp from '@department-of-veterans-affairs/platform-startup/router';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

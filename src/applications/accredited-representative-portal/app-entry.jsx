import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup/router';

import './sass/accredited-representative-portal.scss';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

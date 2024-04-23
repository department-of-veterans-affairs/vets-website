import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup/index';

import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';

import './sass/accredited-representative-portal.scss';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

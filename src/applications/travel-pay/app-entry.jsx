import 'platform/polyfills';
import './sass/travel-pay.scss';

import startApp from '@department-of-veterans-affairs/platform-startup/index';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

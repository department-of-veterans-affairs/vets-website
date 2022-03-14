import 'platform/polyfills';
import './sass/enrollment-verification.scss';

import startApp from 'platform/startup/router';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

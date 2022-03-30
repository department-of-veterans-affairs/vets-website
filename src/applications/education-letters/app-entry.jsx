import 'platform/polyfills';
import './sass/education-letters.scss';

import startApp from 'platform/startup/router';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

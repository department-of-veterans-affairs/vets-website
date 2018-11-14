import '../../../platform/polyfills';
import '../sass/vre.scss';

import startApp from '../../../platform/startup';

import routes from './routes';
import reducer from './reducer';
import manifest from './manifest';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

import '../../../platform/polyfills';
import '../../../sass/user-profile.scss';
import '../../../sass/dashboard.scss';

import startApp from '../../../platform/startup';

import ensureEnvIsNotProd from '../no-prod';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

// @todo Once Personalization goes to production, remove this.
ensureEnvIsNotProd();

startApp({
  url: manifest.rootUrl,
  reducer,
  routes
});

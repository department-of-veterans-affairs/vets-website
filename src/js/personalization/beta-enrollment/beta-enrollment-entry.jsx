import '../../../platform/polyfills';

import startApp from '../../../platform/startup';

import ensureEnvIsNotProd from '../no-prod';
import routes from './routes';
import manifest from './manifest.json';

// @todo Once Personalization goes to production, remove this.
ensureEnvIsNotProd();

startApp({
  url: manifest.rootUrl,
  routes
});

import 'platform/polyfills';

import startApp from 'platform/startup';

import routes from './routes';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  routes,
});

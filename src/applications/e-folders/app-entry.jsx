import 'platform/polyfills';
import './sass/e-folders.scss';
import routes from './routes';

import startApp from 'platform/startup';

import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  routes,
  entryName: manifest.entryName,
  analyticsEvents: [],
});

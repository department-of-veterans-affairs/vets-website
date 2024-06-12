import 'platform/polyfills';
import './sass/burial-poc-v6.scss';

import startApp from 'platform/startup/router';

import routes from './routes';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  routes,
});

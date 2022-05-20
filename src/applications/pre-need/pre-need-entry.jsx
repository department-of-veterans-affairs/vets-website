import 'platform/polyfills';
import './sass/pre-need.scss';

import startApp from 'platform/startup/router';

import routes from './routes';
import reducer from './reducer';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

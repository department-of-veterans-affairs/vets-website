import 'platform/polyfills';
// import 'platform/site-wide/sass/minimal.scss'; // Loads Formation
import './sass/ds-v3-playground.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

import './utils/defineWebComponents';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

import 'platform/polyfills';
import './sass/debt-letters.scss';
import Routes from './routes';

import startApp from 'platform/startup/router';

import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes: Routes(),
  entryName: manifest.entryName,
  analyticsEvents: [],
});

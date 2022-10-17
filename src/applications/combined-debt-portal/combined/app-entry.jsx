import 'platform/polyfills';
import './sass/combined-debt-portal.scss';

import startApp from 'platform/startup/router';
import Routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  entryName: manifest.entryName,
  routes: Routes(),
  reducer,
});

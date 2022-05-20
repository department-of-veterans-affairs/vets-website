import 'platform/polyfills';
import './sass/debt-letters.scss';
import startApp from 'platform/startup/router';
import DebtRoutes from './routes';

import reducer from '../combined/reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes: DebtRoutes(),
  entryName: manifest.entryName,
  analyticsEvents: [],
});

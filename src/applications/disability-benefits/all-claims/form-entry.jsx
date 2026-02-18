import 'platform/polyfills';
import './sass/disability-benefits.scss';

import startApp from 'platform/startup';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';
import analyticsEvents from './analytics-events';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  analyticsEvents,
  entryName: manifest.entryName,
});

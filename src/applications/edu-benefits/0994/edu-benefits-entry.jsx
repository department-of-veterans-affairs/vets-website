import 'platform/polyfills';
import '../sass/edu-benefits.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducer';
import manifest from './manifest.json';
import analyticsEvents from './analytics-events';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
  analyticsEvents,
});

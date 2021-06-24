import 'platform/polyfills';
import './sass/1990s.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';
import { analyticsEvents } from './analytics/analytics-events';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
  analyticsEvents,
});

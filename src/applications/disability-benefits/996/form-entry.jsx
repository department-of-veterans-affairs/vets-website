import 'platform/polyfills';
import './sass/0996-higher-level-review.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  analyticsEvents: [],
});

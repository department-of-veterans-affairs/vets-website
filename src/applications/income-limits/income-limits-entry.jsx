import 'platform/polyfills';
import './sass/income-limits.scss';

import startApp from 'platform/startup';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  entryName: manifest.entryName,
  reducer,
  routes,
});

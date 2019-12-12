import './sass/view-dependents.scss';
import 'platform/polyfills';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './redux/reducers/index';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

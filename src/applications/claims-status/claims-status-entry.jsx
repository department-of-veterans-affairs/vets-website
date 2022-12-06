import 'platform/polyfills';
import startApp from 'platform/startup';

import './sass/claims-status.scss';

import manifest from './manifest.json';
import routes from './routes';
import reducer from './reducers';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

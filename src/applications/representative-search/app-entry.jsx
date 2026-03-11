import 'platform/polyfills';
import startApp from 'platform/startup/router';

import './sass/find-a-representative.scss';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

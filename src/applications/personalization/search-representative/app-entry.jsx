import 'platform/polyfills';
import './sass/search-representative.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

export const store = startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

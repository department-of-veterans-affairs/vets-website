import 'platform/polyfills';
import './sass/ask-va.scss';

import startApp from 'platform/startup';

import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

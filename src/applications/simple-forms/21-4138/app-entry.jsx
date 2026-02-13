import '~/platform/polyfills';
import './sass/4138-ss.scss';

import startApp from '~/platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

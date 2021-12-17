import 'platform/polyfills';
import './sass/coe.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from '../shared/reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

import 'platform/polyfills';
import '../sass/check-in.scss';

import startApp from 'platform/startup';

import createRoutesWithStore from './routes';
import reducer from '../reducers';
import manifest from './manifest.json';

import '../utils/i18n/i18n';

startApp({
  url: manifest.rootUrl,
  reducer,
  createRoutesWithStore,
});

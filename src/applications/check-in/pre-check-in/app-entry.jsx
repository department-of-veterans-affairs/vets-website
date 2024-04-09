import 'platform/polyfills';
import 'platform/site-wide/sass/minimal.scss';
import '../sass/check-in.scss';

import startApp from 'platform/startup';

import createRoutesWithStore from './routes';
import reducer from '../reducers';
import manifest from './manifest.json';

import { setupI18n } from '../utils/i18n/i18n';
import '../utils/defineWebComponents';

setupI18n();

startApp({
  url: manifest.rootUrl,
  reducer,
  createRoutesWithStore,
});

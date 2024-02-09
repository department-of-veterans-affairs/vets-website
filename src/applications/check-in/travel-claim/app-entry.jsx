import '@department-of-veterans-affairs/platform-polyfills';
import '../sass/check-in.scss';

import { startAppFromRouter as startApp } from '@department-of-veterans-affairs/platform-startup/exports';

import createRoutesWithStore from './routes';
import reducer from '../reducers';
import manifest from './manifest.json';

import '../utils/i18n/i18n';

startApp({
  url: manifest.rootUrl,
  reducer,
  createRoutesWithStore,
});

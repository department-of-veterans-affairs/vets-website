// NODE_22_CI_TEST_TRIGGER: Temporary comment to trigger app test selection for Node 22 CI verification. Remove after verification.
import 'platform/polyfills';
import '../sass/check-in.scss';

import startApp from 'platform/startup';

import createRoutesWithStore from './routes';
import reducer from '../reducers';
import manifest from './manifest.json';

import { setupI18n } from '../utils/i18n/i18n';

setupI18n();

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  createRoutesWithStore,
});

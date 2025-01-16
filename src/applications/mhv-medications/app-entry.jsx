// TODO: unable to implement suggested fix without crashing app, once this issue is resolved, change the import
import 'platform/polyfills';
import './sass/medications.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';
// TODO: unable to implement suggested fix without crashing app, once this issue is resolved, change the import
import { startAppFromRouterV6 as startApp } from '@department-of-veterans-affairs/platform-startup/exports';
import router from './router';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  router,
  preloadScheduledDowntimes: true,
});

import 'platform/polyfills';
import '../profile360/sass/user-profile.scss';
import '../../claims-status/sass/claims-status.scss';
import './sass/dashboard.scss';
import './sass/dashboard-alert.scss';
import './sass/messaging/messaging.scss';
import '../preferences/sass/preferences.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

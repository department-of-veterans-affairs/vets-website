import 'platform/polyfills';
import 'applications/personalization/profile360/sass/user-profile.scss';
import 'applications/claims-status/sass/claims-status.scss';
import 'applications/personalization/dashboard/sass/dashboard.scss';
import 'applications/personalization/dashboard/sass/dashboard-alert.scss';
import 'applications/personalization/dashboard/sass/messaging/messaging.scss';
import 'applications/personalization/preferences/sass/preferences.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from 'applications/personalization/dashboard/reducers';
import manifest from './manifest';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

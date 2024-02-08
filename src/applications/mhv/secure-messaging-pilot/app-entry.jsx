import 'platform/polyfills';
import '../secure-messaging/sass/compose.scss';
import '../secure-messaging/sass/message-details.scss';
import '../secure-messaging/sass/message-list.scss';
import '../secure-messaging/sass/search.scss';
import '../secure-messaging/sass/secure-messaging.scss';
import '../secure-messaging/sass/message-thread.scss';
import '../secure-messaging/sass/dashboard.scss';

import startApp from 'platform/startup/router';
import routes from './routes';
import reducer from '../secure-messaging/reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

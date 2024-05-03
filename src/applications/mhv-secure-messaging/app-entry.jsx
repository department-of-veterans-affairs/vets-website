import 'platform/polyfills';
import './sass/compose.scss';
import './sass/message-details.scss';
import './sass/message-list.scss';
import './sass/search.scss';
import './sass/secure-messaging.scss';
import './sass/message-thread.scss';
import './sass/dashboard.scss';

import startApp from 'platform/startup/router';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  entryName: manifest.entryName,
  reducer,
  routes,
});

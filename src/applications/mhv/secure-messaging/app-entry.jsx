import 'platform/polyfills';
import './sass/compose.scss';
import './sass/message-details.scss';
import './sass/message-list.scss';
import './sass/search-messages.scss';
import './sass/secure-messaging.scss';

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

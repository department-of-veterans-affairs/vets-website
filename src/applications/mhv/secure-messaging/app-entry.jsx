import 'platform/polyfills';
import './sass/secure-messaging.scss';
import './sass/message-details.scss';
import './sass/compose.scss';
import './sass/search-messages.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

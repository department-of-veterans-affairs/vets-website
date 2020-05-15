import '../profile360/sass/profile-360.scss';
import 'platform/polyfills';
import '../profile360/sass/user-profile.scss';
import './sass/connected-acct.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

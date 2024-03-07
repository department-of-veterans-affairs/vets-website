import '@department-of-veterans-affairs/platform-polyfills';
import startApp from './platform/startup/router';

import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

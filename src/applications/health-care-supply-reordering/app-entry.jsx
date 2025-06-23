import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup/router';

import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';
// import formRoute from './form-route';

startApp({
  analyticsEvents: [],
  entryName: manifest.entryName,
  reducer,
  routes,
  // to return to the form-app functionality, use form-route instead of routes.
  // route: formRoute,
  url: manifest.rootUrl,
});

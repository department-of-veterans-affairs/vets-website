import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup/router';
import manifest from './manifest.json';
import routes from './routes';

startApp({
  url: manifest.rootUrl,
  routes,
  analyticsEvents: [],
});

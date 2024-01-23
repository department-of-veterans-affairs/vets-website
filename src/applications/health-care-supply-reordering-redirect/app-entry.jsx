import '@department-of-veterans-affairs/platform-polyfills';
import { startAppFromRouter as startApp } from '@department-of-veterans-affairs/platform-startup/exports';
import manifest from './manifest.json';
import routes from './routes';

startApp({
  entryName: manifest.entryName,
  routes,
  url: manifest.rootUrl,
});

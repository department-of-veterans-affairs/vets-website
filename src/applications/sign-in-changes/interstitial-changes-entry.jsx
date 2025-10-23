import 'platform/polyfills';

import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';

import routes from './routes';
import manifest from './manifest.json';

startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  routes,
});

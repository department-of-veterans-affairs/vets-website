import '@department-of-veterans-affairs/platform-polyfills';
// Updated stylesheet filename to generic xxxx form number placeholder
import './sass/40-xxxx-ToN.scss';

import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

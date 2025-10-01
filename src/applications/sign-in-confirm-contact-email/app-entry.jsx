import '@department-of-veterans-affairs/platform-polyfills';
import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';
import './sass/confirm-contact-email.scss';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  routes,
  reducer,
});

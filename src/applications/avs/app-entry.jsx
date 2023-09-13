import '@department-of-veterans-affairs/platform-polyfills';
import './sass/avs.scss';

import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startAppFromIndex({
  url: manifest.rootUrl,
  reducer,
  routes,
});

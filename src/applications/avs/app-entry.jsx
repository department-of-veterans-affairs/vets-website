import '@department-of-veterans-affairs/platform-polyfills';
import './sass/avs.scss';

import { startAppFromRouter } from '@department-of-veterans-affairs/platform-startup/exports';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startAppFromRouter({
  url: manifest.rootUrl,
  reducer,
  routes,
});

import '@department-of-veterans-affairs/platform-polyfills';
import './sass/vass.scss';

import startApp from '@department-of-veterans-affairs/platform-startup/router';

import routes from './routes';
import reducer from './redux/reducers';
import manifest from './manifest.json';
import { vassApi } from './redux/api/vassApi';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
  additionalMiddlewares: [vassApi.middleware],
});

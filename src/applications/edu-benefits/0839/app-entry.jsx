import '@department-of-veterans-affairs/platform-polyfills';
import './sass/0839-edu-benefits.scss';

import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';
import { isAuthMiddleware } from './utils/isAuthMiddleware';

startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
  additionalMiddlewares: [isAuthMiddleware],
});

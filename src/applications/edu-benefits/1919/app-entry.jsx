import 'platform/polyfills';
import './sass/1919-edu-benefits.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';
import { isAuthMiddleware } from './utils/isAuthMiddleware';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  additionalMiddlewares: [isAuthMiddleware],
});

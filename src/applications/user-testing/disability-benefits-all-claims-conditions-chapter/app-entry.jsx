import '@department-of-veterans-affairs/platform-polyfills';
import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';

import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';

import './sass/disability-benefits-all-claims-conditions-chapter.scss';

startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

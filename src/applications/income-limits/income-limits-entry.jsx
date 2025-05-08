import '@department-of-veterans-affairs/platform-polyfills';
import './sass/income-limits.scss';

import startApp from '@department-of-veterans-affairs/platform-startup';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  entryName: manifest.entryName,
  reducer,
  routes,
});

import '@department-of-veterans-affairs/platform-polyfills';
import './sass/medical-expense-report.scss';

// import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';
import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup/index';

import './sass/income-and-asset-statement.scss';

import routes from './routes';
import reducer from './reducer';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

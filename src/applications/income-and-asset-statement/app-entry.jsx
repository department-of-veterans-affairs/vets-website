import '@department-of-veterans-affairs/platform-polyfills';

import './sass/income-and-asset-statement.scss';

import startApp from '@department-of-veterans-affairs/platform-startup/index';

import routes from './routes';
import reducer from './reducer';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

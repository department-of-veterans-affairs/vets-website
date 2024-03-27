import '@department-of-veterans-affairs/platform-polyfills';
import './sass/vaos.scss';

import startApp from '@department-of-veterans-affairs/platform-startup/index';
import createRoutesWithStore from './routes';
import manifest from './manifest.json';
import reducer from './redux/reducer';

startApp({
  url: manifest.rootUrl,
  createRoutesWithStore,
  reducer,
  entryName: manifest.entryName,
});

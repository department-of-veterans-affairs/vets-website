import 'platform/polyfills';
import './sass/vaos.scss';

import startApp from 'platform/startup/router';
import createRoutesWithStore from './routes';
import manifest from './manifest.json';
import reducer from './redux/reducer';

// Trigger single app build
startApp({
  url: manifest.rootUrl,
  createRoutesWithStore,
  reducer,
  entryName: manifest.entryName,
});

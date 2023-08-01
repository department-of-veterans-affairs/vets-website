import 'platform/polyfills';
import './sass/vaos.scss';

import startApp from 'platform/startup/router';
import environment from 'platform/utilities/environment';
import createRoutesWithStore from './routes';
import manifest from './manifest.json';
import reducer from './redux/reducer';

startApp({
  url: environment.isProduction() ? manifest.rootUrl : manifest.newRootUrl,
  createRoutesWithStore,
  reducer,
  entryName: manifest.entryName,
});

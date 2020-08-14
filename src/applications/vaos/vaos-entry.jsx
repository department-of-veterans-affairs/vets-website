import 'platform/polyfills';
import './sass/vaos.scss';

import startApp from 'platform/startup';
import createRoutesWithStore from './routes';
import manifest from './manifest.json';
import reducer from './reducers';

const { worker } = require('./mockServer');

worker.start();

startApp({
  url: manifest.rootUrl,
  createRoutesWithStore,
  reducer,
  entryName: manifest.entryName,
});

import 'platform/polyfills';
import './sass/questionnaire.scss';

import startApp from 'platform/startup';

import createRoutesWithStore from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  createRoutesWithStore,
  entryName: manifest.entryName,
});

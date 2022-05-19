import 'platform/polyfills';
import './sass/medical-copays.scss';

import startApp from 'platform/startup/router';
import MedicalCopaysRoutes from './routes';
import reducer from '../combined/reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  entryName: manifest.entryName,
  routes: MedicalCopaysRoutes(),
  reducer,
});

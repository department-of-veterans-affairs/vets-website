import '@department-of-veterans-affairs/platform-polyfills';
import './sass/mock-form-prefill.scss';
import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

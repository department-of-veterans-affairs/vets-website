import 'platform/polyfills';
import './sass/caregivers.scss';
import { asyncStartApp } from './utils/startup';
import reducer from './reducers';
import routes from './routes';
import manifest from './manifest.json';

asyncStartApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

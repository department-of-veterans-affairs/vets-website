import 'platform/polyfills';
import './sass/caregivers.scss';
import { asyncStartApp } from './utils/startup';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

asyncStartApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

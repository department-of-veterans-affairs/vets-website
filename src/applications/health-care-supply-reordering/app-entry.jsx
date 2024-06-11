import 'platform/polyfills';
import startApp from 'platform/startup';
import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';
import './sass/health-care-supply-reordering.scss';

startApp({
  analyticsEvents: [],
  entryName: manifest.entryName,
  reducer,
  routes,
  url: manifest.rootUrl,
});

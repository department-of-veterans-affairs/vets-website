import 'platform/polyfills';
import startApp from 'platform/startup';
import manifest from './manifest.json';
import reducer from './reducers';
import routes from './routes';
import './sass/form-2346.scss';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
  analyticsEvents: [],
});

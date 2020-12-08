// Node modules.
import 'platform/polyfills';
import startApp from 'platform/startup';
// Relative imports.
import './style.scss';
import routes from './routes';
import manifest from './manifest.json';
import reducer from './reducers';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  routes,
  reducer,
});

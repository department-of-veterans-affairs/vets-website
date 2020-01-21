// Styling imports.
import 'platform/polyfills';
import './sass/yellow-ribbon.scss';
// Relative imports.
import startApp from 'platform/startup';
import routes from './routes';
import manifest from './manifest.json';
import reducer from './reducers';

startApp({
  url: manifest.rootUrl,
  routes,
  reducer,
  entryName: manifest.entryName,
});

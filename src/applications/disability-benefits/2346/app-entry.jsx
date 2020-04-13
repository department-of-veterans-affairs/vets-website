import 'platform/polyfills';
import startApp from 'platform/startup';
import manifest from './manifest.json';
import routes from './routes';
import './sass/form-2346.scss';

startApp({
  url: manifest.rootUrl,
  routes,
});

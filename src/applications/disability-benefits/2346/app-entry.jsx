import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup';
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

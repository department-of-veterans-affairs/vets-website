import 'platform/polyfills';
// import polyfills from '@department-of-veterans-affairs/platform-polyfills';
import './sass/education-letters.scss';
import startApp from 'platform/startup/router';
// import startApp from '@department-of-veterans-affairs/platform-startup/index';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

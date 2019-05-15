import '../../platform/polyfills';
import './sass/discharge-wizard.scss';
import '@department-of-veterans-affairs/formation/js/sidenav';

import startApp from '../../platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup';

import './sass/submitted-appeal.scss';

import manifest from './manifest.json';
import routes from './routes';
import reducer from './reducers';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

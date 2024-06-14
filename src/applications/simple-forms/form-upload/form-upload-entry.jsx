import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup/router';

import './sass/form-upload.scss';

import routes from './routes';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  routes,
});

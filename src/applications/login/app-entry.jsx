import 'platform/polyfills';
import './sass/medical-records.scss';
import './sass/mhv-landing-page.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';

import startApp from 'platform/startup';

import routes from './routes';
import manifest from './manifest.json';

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  routes,
});

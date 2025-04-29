import 'platform/polyfills';
import './sass/survivor-dependent-education-benefit-22-5490.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

import 'platform/polyfills';
import './sass/survivor-dependent-education-benefit-22-5490.scss';

import startApp from 'platform/startup';
import createCommonStore from 'platform/startup/store';

import createRoutes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

const store = createCommonStore(reducer);

const routes = createRoutes(store);

startApp({
  url: manifest.rootUrl,
  store,
  reducer,
  routes,
});

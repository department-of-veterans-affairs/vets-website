import '@department-of-veterans-affairs/platform-polyfills';
import './sass/facility-locator.scss';

import startApp from '@department-of-veterans-affairs/platform-startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

const store = startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

export default store;

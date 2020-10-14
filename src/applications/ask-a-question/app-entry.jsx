import 'platform/polyfills';
import './form/config/sass/ask-a-question.scss';

import startApp from 'platform/startup';

import routes from './form/config/routes';
import reducer from './form/config/reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

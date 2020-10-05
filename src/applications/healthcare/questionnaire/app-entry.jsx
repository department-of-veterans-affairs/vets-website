import 'platform/polyfills';
import './sass/questionnaire.scss';
import './sass/footer.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

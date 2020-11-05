import 'platform/polyfills';
import './sass/questionnaire.scss';
import './sass/footer.scss';
import './sass/review.scss';
import './sass/confirm.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

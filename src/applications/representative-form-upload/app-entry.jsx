import 'platform/polyfills';
import '../simple-forms/form-upload/sass/form-upload.scss';

import startApp from 'platform/startup';
import routes from '../simple-forms/form-upload/routes';
import reducer from '../simple-forms/form-upload/reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

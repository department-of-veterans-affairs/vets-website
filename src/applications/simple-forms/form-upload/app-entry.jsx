import 'platform/polyfills';
import './sass/form-upload.scss';

import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import { getFormNumber } from './helpers';

startApp({
  url: `/find-forms/about-form-${getFormNumber()}/form-upload`,
  reducer,
  routes,
});

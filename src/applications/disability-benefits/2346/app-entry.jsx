import '../../../platform/polyfills';
import './sass/form-2346.scss';

import startApp from '../../../platform/startup';

import routes from './routes';
import reducer from './reducers';

startApp({
  url: '/disability-benefits/2346',
  reducer,
  routes,
});

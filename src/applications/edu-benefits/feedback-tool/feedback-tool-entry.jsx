import 'platform/polyfills';
import '../sass/edu-benefits.scss';
import './sass/table.scss';
import startApp from 'platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

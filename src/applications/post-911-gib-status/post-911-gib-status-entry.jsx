import '../../platform/polyfills';
import './sass/post-911-gib-status.scss';
import '../static-pages/sidebar-navigation';

import startApp from '../../platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

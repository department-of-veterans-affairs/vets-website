import '../../platform/polyfills';
import './sass/post-911-gib-status.scss';

import brandConsolidation from '../../platform/brand-consolidation';

if (brandConsolidation.isEnabled()) {
  require('../static-pages/sidebar-navigation');
}

import startApp from '../../platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

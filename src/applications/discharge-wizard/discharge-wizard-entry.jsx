import '../../platform/polyfills';
import './sass/discharge-wizard.scss';

import brandConsolidation from '../../platform/brand-consolidation';

if (brandConsolidation.isEnabled()) {
  require('../static-pages/sidebar-navigation');
}

import startApp from '../../platform/startup';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

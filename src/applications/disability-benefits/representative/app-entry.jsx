import 'platform/polyfills';
import './sass/representative-526ez.scss';

// Import ARP styles for header/footer
import '~/applications/accredited-representative-portal/sass/accredited-representative-portal.scss';

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

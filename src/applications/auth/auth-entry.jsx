import 'platform/polyfills';
import './sass/auth.scss';

import startApp from 'platform/startup/router';
import routes from './routes';

startApp({ routes, entryName: 'auth' });

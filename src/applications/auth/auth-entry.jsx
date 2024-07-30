import 'platform/polyfills';

import startApp from 'platform/startup';
import routes from './routes';

startApp({ routes, entryName: 'auth' });

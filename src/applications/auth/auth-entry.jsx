import '@department-of-veterans-affairs/platform-polyfills';

import startApp from '@department-of-veterans-affairs/platform-startup';
import routes from './routes';

startApp({ routes, entryName: 'auth' });

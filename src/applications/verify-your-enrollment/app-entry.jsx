import '@department-of-veterans-affairs/platform-polyfills';
import './sass/verify-your-enrollment.scss';
import environment from '@department-of-veterans-affairs/platform-utilities/environment/index';
import startApp from '@department-of-veterans-affairs/platform-startup/router';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

// eslint-disable-next-line no-unused-expressions
!environment.isProduction() &&
  startApp({
    url: manifest.rootUrl,
    reducer,
    routes,
  });

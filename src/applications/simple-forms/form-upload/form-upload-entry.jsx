import '@department-of-veterans-affairs/platform-polyfills';
import startApp from '@department-of-veterans-affairs/platform-startup/router';

// TODO: Uncomment when we have an scss file.
// import './sass/form-upload.scss';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
});

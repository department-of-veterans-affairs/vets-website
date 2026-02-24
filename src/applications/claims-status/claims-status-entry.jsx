// perf: trigger for Cypress video A/B test
import '@department-of-veterans-affairs/platform-polyfills';
import {
  applyPolyfills,
  defineCustomElements,
} from '@department-of-veterans-affairs/component-library';
import startApp from '@department-of-veterans-affairs/platform-startup/router';

import './sass/claims-status.scss';

import manifest from './manifest.json';
import routes from './routes';
import reducer from './reducers';

applyPolyfills().then(() => {
  defineCustomElements();
});

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

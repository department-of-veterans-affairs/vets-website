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

import { canUseMocks } from './constants';

// Automatically set hasSession for local development to bypass login when using mock APIs.
if (canUseMocks()) {
  localStorage.setItem('hasSession', 'true');
}

applyPolyfills().then(() => {
  defineCustomElements();
});

startApp({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

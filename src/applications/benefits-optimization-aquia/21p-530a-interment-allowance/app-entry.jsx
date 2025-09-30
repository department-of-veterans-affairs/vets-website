/**
 * @module app-entry
 * @description Application entry point for VA Form 21P-530A
 */

import '@department-of-veterans-affairs/platform-polyfills';
import './sass/21p-530a-interment-allowance.scss';

import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';

import routes from '@bio-aquia/21p-530a-interment-allowance/routes';
import reducer from '@bio-aquia/21p-530a-interment-allowance/reducers';
import manifest from '@bio-aquia/21p-530a-interment-allowance/manifest.json';

startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

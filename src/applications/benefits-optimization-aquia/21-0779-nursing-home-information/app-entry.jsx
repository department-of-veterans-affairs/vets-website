import '@department-of-veterans-affairs/platform-polyfills';
import { startAppFromIndex } from '@department-of-veterans-affairs/platform-startup/exports';
import '@department-of-veterans-affairs/web-components';

import './sass/21-0779-nursing-home-information.scss';

import manifest from '@bio-aquia/21-0779-nursing-home-information/manifest.json';
import reducer from '@bio-aquia/21-0779-nursing-home-information/reducers';
import routes from '@bio-aquia/21-0779-nursing-home-information/routes';

startAppFromIndex({
  entryName: manifest.entryName,
  url: manifest.rootUrl,
  reducer,
  routes,
});

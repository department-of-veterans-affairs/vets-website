import '@department-of-veterans-affairs/platform-polyfills';
import './sass/mhv-landing-page.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';
import { startAppFromRouter as startApp } from '@department-of-veterans-affairs/platform-startup/exports';
import { initializeDatadogRum } from './utilities/datadogRum';

import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

initializeDatadogRum({
  applicationId: '1f81f762-c3fc-48c1-89d5-09d9236e340d',
  clientToken: 'pub3e48a5b97661792510e69581b3b272d1',
  site: 'ddog-gov.com',
  service: 'mhv-on-va.gov',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 10,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

startApp({
  entryName: manifest.entryName,
  reducer,
  routes,
  url: manifest.rootUrl,
});

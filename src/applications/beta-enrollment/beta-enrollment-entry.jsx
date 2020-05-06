import 'platform/polyfills';

import startApp from 'platform/startup';

import routes from './routes';
import manifest from './manifest.json';
import { REGISTER_SERVICE } from './actions';

const analyticsEvents = [
  {
    action: REGISTER_SERVICE,
    event: (store, action) => ({
      event: 'beta-enrollment',
      appName: action.service,
    }),
  },
];

startApp({
  url: manifest.rootUrl,
  routes,
  entryName: manifest.entryName,
  analyticsEvents,
});

import 'platform/polyfills';
import './sass/21p-530a-interment-allowance.scss';

import startApp from 'platform/startup';

import routes from '@bio-aquia/21p-530a-interment-allowance/routes';
import reducer from '@bio-aquia/21p-530a-interment-allowance/reducers';
import manifest from '@bio-aquia/21p-530a-interment-allowance/manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

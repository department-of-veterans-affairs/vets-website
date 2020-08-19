import 'platform/polyfills';
import './sass/vaos.scss';

import startApp from './startup';
import componentWithStore from './routes';
import manifest from './manifest.json';
import reducer from './reducers';

startApp({
  url: manifest.rootUrl,
  componentWithStore,
  reducer,
  entryName: manifest.entryName,
});

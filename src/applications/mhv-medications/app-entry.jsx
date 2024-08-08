// TODO: unable to implement suggested fix without crashing app, once this issue is resolved, change the import
import 'platform/polyfills';
import './sass/medications.scss';
import '~/platform/mhv/secondary-nav/sass/mhv-sec-nav.scss';
// TODO: unable to implement suggested fix without crashing app, once this issue is resolved, change the import
import startApp from 'platform/startup/router';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  reducer,
  routes,
  entryName: manifest.entryName,
});

import 'platform/polyfills';
import startApp from 'platform/startup';
// import App from './containers/App';
import './sass/new-686.scss';
import routes from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

startApp({
  url: manifest.rootUrl,
  routes,
  reducer,
  entryName: manifest.entryName,
});

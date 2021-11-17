import 'platform/polyfills';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import './sass/gi.scss';
import '../gi-sandbox/sass/gi.scss';
import startApp from 'platform/startup/router';
import { buildRoutes } from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

import { buildRoutes as redesignedRoutes } from '../gi-sandbox/routes';
import redesignedReducer from '../gi-sandbox/reducers';

const fakeFlag = true;

startApp(
  fakeFlag
    ? {
        url: manifest.rootUrl,
        routes: redesignedRoutes(),
        redesignedReducer,
        entryName: manifest.entryName,
      }
    : {
        url: manifest.rootUrl,
        routes: buildRoutes(),
        reducer,
        entryName: manifest.entryName,
      },
);

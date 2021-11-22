import 'platform/polyfills';
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import './sass/gi.scss';
import '../gi-sandbox/sass/gi.scss';
import startApp from 'platform/startup/router';
import { buildRoutes } from './routes';
import reducer from './reducers';
import manifest from './manifest.json';

import { buildRoutes as buildRedesignedRoutes } from '../gi-sandbox/routes';
import redesignedReducer from '../gi-sandbox/reducers';

const redesignFlag = toggleValues(0).gi_sandbox_comparision_tool_toggle;
const page = redesignFlag
  ? { reducer: redesignedReducer, routes: buildRedesignedRoutes() }
  : { reducer, routes: buildRoutes() };

startApp({
  url: manifest.rootUrl,
  entryName: manifest.entryName,
  reducer: page.reducer,
  routes: page.routes,
});

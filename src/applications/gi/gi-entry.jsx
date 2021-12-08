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
import createCommonStore from 'platform/startup/store';
import { connectFeatureToggle } from 'platform/utilities/feature-toggles';

const REDESIGN_FEATURE_FLAG = 'gi_sandbox_comparison_tool_toggle';

(async () => {
  const store = createCommonStore(reducer);
  await connectFeatureToggle(store.dispatch);

  const isRedesign = toggleValues(store.getState())[REDESIGN_FEATURE_FLAG];

  const page = isRedesign
    ? { reducer: redesignedReducer, routes: buildRedesignedRoutes() }
    : { reducer, routes: buildRoutes() };

  startApp({
    url: manifest.rootUrl,
    entryName: manifest.entryName,
    reducer: page.reducer,
    routes: page.routes,
  });
})();

import DashboardApp from './containers/DashboardApp';
import DashboardAppWrapper from './containers/DashboardAppWrapper';
import SetPreferences from '../preferences/containers/SetPreferences';
import environment from 'platform/utilities/environment';

const preferencesRoute = {
  path: 'preferences',
  component: SetPreferences,
  key: 'preferences',
  name: 'Find VA Benefits',
};

// do not allow route in production
if (environment.isProduction()) {
  preferencesRoute.onEnter = (nextState, replace) => replace('/');
}

const routes = {
  path: '/',
  component: DashboardAppWrapper,
  indexRoute: { component: DashboardApp },
  childRoutes: [preferencesRoute],
};

export default routes;

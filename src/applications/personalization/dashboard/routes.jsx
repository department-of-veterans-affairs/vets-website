import DashboardApp from './containers/DashboardApp';
import DashboardAppWrapper from './containers/DashboardAppWrapper';
import SetPreferences from '../preferences/SetPreferences';

const preferencesRoute = {
  path: 'preferences',
  component: SetPreferences,
  key: 'preferences',
  name: 'Find VA Benefits',
};

if (document.location.hostname !== 'staging.vets.gov') {
  preferencesRoute.onEnter = (nextState, replace) => replace('/');
}

const routes = {
  path: '/',
  component: DashboardAppWrapper,
  indexRoute: { component: DashboardApp },
  childRoutes: [
    preferencesRoute,
  ]
};

export default routes;

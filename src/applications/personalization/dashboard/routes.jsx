import DashboardApp from './containers/DashboardApp';
import DashboardAppWrapper from './containers/DashboardAppWrapper';
import SetPreferences from '../preferences/SetPreferences';

const routes = {
  path: '/',
  component: DashboardAppWrapper,
  indexRoute: { component: DashboardApp },
  childRoutes: [
    { path: 'preferences', component: SetPreferences, key: 'preferences', name: 'Find VA Benefits' },
  ]
};

export default routes;

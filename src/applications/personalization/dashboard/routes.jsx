import DashboardApp from './containers/DashboardApp';
import DashboardAppWrapper from './containers/DashboardAppWrapper';
import PreferencesWidget from '../preferences/PreferencesWidget';

const routes = {
  path: '/',
  component: DashboardAppWrapper,
  indexRoute: { component: DashboardApp },
  childRoutes: [
    { path: 'preferences', component: PreferencesWidget, key: 'preferences', name: 'Find VA Benefits' },
  ]
};

export default routes;

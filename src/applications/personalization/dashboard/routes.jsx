import DashboardApp from './containers/DashboardApp';
import DashboardAppWrapper from './containers/DashboardAppWrapper';
import SetPreferences from '../preferences/containers/SetPreferences';
import environment from 'platform/utilities/environment';

export const findBenefitsRoute = {
  path: 'find-benefits',
  component: SetPreferences,
  key: 'find-benefits',
  name: 'Find VA Benefits',
};

// do not allow route in production
if (environment.isProduction()) {
  findBenefitsRoute.onEnter = (nextState, replace) => replace('/');
}

const routes = {
  path: '/',
  component: DashboardAppWrapper,
  indexRoute: { component: DashboardApp },
  childRoutes: [findBenefitsRoute],
};

export default routes;

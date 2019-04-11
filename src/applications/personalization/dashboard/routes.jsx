import DashboardApp from './containers/DashboardApp';
import DashboardAppNew from './containers/DashboardAppNew';
import DashboardAppWrapper from './containers/DashboardAppWrapper';
import SetPreferences from '../preferences/containers/SetPreferences';

import environment from 'platform/utilities/environment';

const component = environment.isProduction() ? DashboardApp : DashboardAppNew;

export const findBenefitsRoute = {
  path: 'find-benefits',
  component: SetPreferences,
  key: 'find-benefits',
  name: 'Find VA Benefits',
};

const routes = {
  path: '/',
  component: DashboardAppWrapper,
  indexRoute: { component },
  childRoutes: [findBenefitsRoute],
};

export default routes;

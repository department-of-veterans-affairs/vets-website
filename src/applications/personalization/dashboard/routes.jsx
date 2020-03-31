import DashboardApp from './containers/DashboardApp';
import DashboardAppWrapper from './containers/DashboardAppWrapper';
import SetPreferences from '../preferences/containers/SetPreferences';
import JAWSSetPreferences from '../preferences/containers/JAWSSetPreferences';

import environment from 'platform/utilities/environment';

export const findBenefitsRoute = {
  path: 'find-benefits',
  component: SetPreferences,
  key: 'find-benefits',
  name: 'Find VA benefits',
};

export const JAWSFindBenefitsRoute = {
  path: 'jaws-find-benefits',
  component: JAWSSetPreferences,
  key: 'jaws-find-benefits',
  name: 'JAWS Find VA benefits',
};

const childRoutes = [findBenefitsRoute];

if (!environment.isProduction()) {
  childRoutes.push(JAWSFindBenefitsRoute);
}

const routes = {
  path: '/',
  component: DashboardAppWrapper,
  indexRoute: { component: DashboardApp },
  childRoutes,
};

export default routes;

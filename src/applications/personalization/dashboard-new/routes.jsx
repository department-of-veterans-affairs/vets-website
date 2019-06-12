import DashboardAppNew from 'applications/personalization/dashboard/containers/DashboardAppNew';
import DashboardAppWrapper from 'applications/personalization/dashboard/containers/DashboardAppWrapper';
import SetPreferences from 'applications/personalization/preferences/containers/SetPreferences';

export const findBenefitsRoute = {
  path: 'find-benefits',
  component: SetPreferences,
  key: 'find-benefits',
  name: 'Find VA benefits',
};

const routes = {
  path: '/',
  component: DashboardAppWrapper,
  indexRoute: { component: DashboardAppNew },
  childRoutes: [findBenefitsRoute],
};

export default routes;

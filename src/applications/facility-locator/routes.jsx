import FacilityLocatorApp from './containers/FacilityLocatorApp';
import FacilityDetail from './containers/FacilityDetail';
import FacilitiesMap from './containers/FacilitiesMap';

const childRoutes = [{ path: 'facility/:id', component: FacilityDetail }];

const routes = {
  path: '/',
  component: FacilityLocatorApp,
  childRoutes: [
    {
      indexRoute: { component: FacilitiesMap },
      childRoutes,
    },
  ],
};

export default routes;

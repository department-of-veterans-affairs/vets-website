import FacilityLocatorApp from './containers/FacilityLocatorApp';
import FacilityDetail from './containers/FacilityDetail';
import ProviderDetail from './containers/ProviderDetail';
import FacilitiesMap from './containers/FacilitiesMap';

const childRoutes = [
  { path: 'facility/:id', component: FacilityDetail },
  { path: 'provider/:id', component: ProviderDetail },
];

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

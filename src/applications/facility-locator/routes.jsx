import FacilityLocatorApp from './containers/FacilityLocatorApp';
import FacilityDetail from './containers/FacilityDetail';
import ProviderDetail from './containers/ProviderDetail';
import VAMap from './containers/VAMap';

const childRoutes = [
  { path: 'facility/:id', component: FacilityDetail },
  { path: 'provider/:id', component: ProviderDetail },
];

const routes = {
  path: '/',
  component: FacilityLocatorApp,
  childRoutes: [
    {
      indexRoute: { component: VAMap },
      childRoutes,
    },
  ],
};

export default routes;

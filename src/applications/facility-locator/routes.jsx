import FacilityLocatorApp from './containers/FacilityLocatorApp';
import FacilityDetail from './containers/FacilityDetail';
import ProviderDetail from './containers/ProviderDetail';
import VAMap from './containers/VAMap';
// import VAMboxMap from './containers/VAMboxMap';
import FacilitiesMap from './containers/FacilitesMap';
import environment from 'platform/utilities/environment';

const childRoutes = [
  { path: 'facility/:id', component: FacilityDetail },
  { path: 'provider/:id', component: ProviderDetail },
];

const Map = environment.isProduction() ? VAMap : FacilitiesMap;
// const Map = environment.isProduction() ? VAMap : VAMboxMap;
const routes = {
  path: '/',
  component: FacilityLocatorApp,
  childRoutes: [
    {
      indexRoute: { component: Map },
      childRoutes,
    },
  ],
};

export default routes;

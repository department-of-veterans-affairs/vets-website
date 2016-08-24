import { FacilityLocatorApp } from './containers/FacilityLocatorApp';
import VAFacility from './containers/VAFacility';
import Map from './containers/Map';

const routes = {
  path: '/facilities',
  component: FacilityLocatorApp,
  childRoutes: [
    {
      indexRoute: { component: Map }
    },
    { path: 'facility/:id', component: VAFacility }
  ]
};

export default routes;

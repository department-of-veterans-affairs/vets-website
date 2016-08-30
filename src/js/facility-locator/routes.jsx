import { FacilityLocatorApp } from './containers/FacilityLocatorApp';
import VAFacility from './containers/VAFacility';
import VAMap from './containers/Map';

const routes = {
  path: '/facilities',
  component: FacilityLocatorApp,
  childRoutes: [
    {
      indexRoute: { component: VAMap }
    },
    { path: 'facility/:id', component: VAFacility }
  ]
};

export default routes;

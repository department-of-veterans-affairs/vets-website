import FacilityLocatorApp from './containers/FacilityLocatorApp';
import FacilityDetail from './containers/FacilityDetail';
import ProviderDetail from './containers/ProviderDetail';
import VAMap from './containers/VAMap';
import FacilitiesMap from './containers/FacilitesMap';
import environment from 'platform/utilities/environment';

const childRoutes = [
  { path: 'facility/:id', component: FacilityDetail },
  { path: 'provider/:id', component: ProviderDetail },
];

const getMap = () => {
  if (environment.isProduction()) return VAMap; // Use legacy map on prod

  const isUnitTest = window.Mocha;
  const isReviewEnvironment = environment.API_URL.includes('review.vetsgov');
  const isLocal = environment.isLocalhost();
  const isStaging = environment.isStaging();
  const isDev = environment.isDev();
  const isCypress = window.Cypress;

  if (isUnitTest || isCypress) return VAMap;

  if (isReviewEnvironment || isLocal || isStaging || isDev) {
    return FacilitiesMap;
  }
  return VAMap;
};

const routes = {
  path: '/',
  component: FacilityLocatorApp,
  childRoutes: [
    {
      indexRoute: { component: getMap() },
      childRoutes,
    },
  ],
};

export default routes;

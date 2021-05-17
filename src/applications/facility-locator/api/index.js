import MockApi from './MockLocatorApi';
import LiveApi from './LocatorApi';
import environment from 'platform/utilities/environment';

const getAPI = () => {
  const isUnitTest = window.Mocha;
  const isReviewEnvironment = environment.API_URL.includes('review.vetsgov');
  const isLocal = environment.isLocalhost();
  const isCypress = window.Cypress;

  if (isLocal || isReviewEnvironment) return LiveApi;
  if (isUnitTest || isCypress) return MockApi;

  return LiveApi;
};

export default getAPI();

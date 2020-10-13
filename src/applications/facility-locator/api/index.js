import MockApi from './MockLocatorApi';
import LiveApi from './LocatorApi';
import environment from 'platform/utilities/environment';

// To use vets-api data locally, replace the following with this:
// export default LiveApi;

const getAPI = () => {
  const isUnitTest = window.Mocha;
  const isReviewEnvironment = environment.API_URL.includes('review.vetsgov');
  const isLocal = environment.isLocalhost();
  const isCypress = window.Cypress;

  if (isUnitTest || isReviewEnvironment) return LiveApi;
  if (isLocal || isCypress) return MockApi;

  return LiveApi;
};

export default getAPI();

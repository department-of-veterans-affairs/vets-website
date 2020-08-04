import MockApi from './MockLocatorApi';
import LiveApi from './LocatorApi';
import environment from 'platform/utilities/environment';

// To use vets-api data locally, replace the following with this:
// export default LiveApi;
export default (environment.isLocalhost() &&
!environment.API_URL.includes('review.vetsgov')
  ? MockApi
  : LiveApi);

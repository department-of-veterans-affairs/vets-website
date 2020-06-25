import MockApi from './MockLocatorApi';
import LiveApi from './LocatorApi';
import environment from 'platform/utilities/environment';

export default (environment.isLocalhost() &&
!environment.API_URL.includes('review.vetsgov')
  ? MockApi
  : LiveApi);

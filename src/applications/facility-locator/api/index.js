import LiveApi from './LocatorApi';
import environment from '../../../platform/utilities/environment';
// build
export default (environment.isLocalhost() ? LiveApi : LiveApi);

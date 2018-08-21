import MockApi from './MockLocatorApi';
import LiveApi from './LocatorApi';

/* global __BUILDTYPE__ */
export default (['development', 'devpreview'].includes(__BUILDTYPE__))
  ? MockApi
  : LiveApi;

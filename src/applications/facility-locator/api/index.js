/* eslint-disable prettier/prettier */
import MockApi from './MockLocatorApi';
import LiveApi from './LocatorApi';

/* global __BUILDTYPE__ */
export default (__BUILDTYPE__ === 'development') ? MockApi : LiveApi;

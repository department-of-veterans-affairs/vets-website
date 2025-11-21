import { getAppUrl } from 'platform/utilities/registry-helpers';

// declare global app URLs for use with content links
export const APP_URLS = {
  facilities: getAppUrl('facilities'),
  hca: getAppUrl('hca'),
  verify: getAppUrl('verify'),
};

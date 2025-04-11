import { getAppUrl } from 'platform/utilities/registry-helpers';

// declare global app URLs for use with content links
export const APP_URLS = {
  dischargeWizard: getAppUrl('discharge-upgrade-instructions'),
  ezr: getAppUrl('ezr'),
  facilities: getAppUrl('facilities'),
  hca: getAppUrl('hca'),
  profile: getAppUrl('profile'),
  verify: getAppUrl('verify'),
};

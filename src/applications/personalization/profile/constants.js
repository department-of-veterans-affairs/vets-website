// The values of these constants map to the possible values that come back from
// the GET profile/service_history API.
export const USA_MILITARY_BRANCHES = Object.freeze({
  army: 'Army',
  coastGuard: 'Coast Guard',
  airForce: 'Air Force',
  navy: 'Navy',
  marineCorps: 'Marine Corps',
});

export const SERVICE_BADGE_IMAGE_PATHS = new Map([
  [USA_MILITARY_BRANCHES.army, '/img/vic-army-symbol.png'],
  [USA_MILITARY_BRANCHES.coastGuard, '/img/vic-cg-emblem.png'],
  [USA_MILITARY_BRANCHES.airForce, '/img/vic-air-force-coat-of-arms.png'],
  [USA_MILITARY_BRANCHES.navy, '/img/vic-navy-emblem.png'],
  [USA_MILITARY_BRANCHES.marineCorps, '/img/vic-usmc-emblem.png'],
]);

export const PROFILE_PATHS = Object.freeze({
  PROFILE_ROOT: '/profile',
  DIRECT_DEPOSIT: '/profile/direct-deposit',
  PERSONAL_INFORMATION: '/profile/personal-information',
  CONTACT_INFORMATION: '/profile/contact-information',
  MILITARY_INFORMATION: '/profile/military-information',
  NOTIFICATION_SETTINGS: '/profile/notifications',
  CONNECTED_APPLICATIONS: '/profile/connected-applications',
  ACCOUNT_SECURITY: '/profile/account-security',
});

export const PROFILE_PATH_NAMES = Object.freeze({
  DIRECT_DEPOSIT: 'Direct deposit information',
  PERSONAL_INFORMATION: 'Personal information',
  CONTACT_INFORMATION: 'Contact information',
  MILITARY_INFORMATION: 'Military information',
  NOTIFICATION_SETTINGS: 'Notification settings',
  CONNECTED_APPLICATIONS: 'Connected apps',
  ACCOUNT_SECURITY: 'Account security',
});

export const ACCOUNT_TYPES_OPTIONS = {
  checking: 'Checking',
  savings: 'Savings',
};

export const RX_TRACKING_SUPPORTING_FACILITIES = new Set([
  '512', // VA Maryland Health Care System
  '517', // Beckley VA Medical Center (Beckley, WV)
  '520', // Biloxi VAMC
  '539', // Cincinnati
  '540', // Clarksburg - Louis A. Johnson VA Medical Center
  '546', // MIAMI VAMC
  '548', // West Palm Beach VAMC
  '550', // Illiana HCS
  '554', // VA Eastern Colorado Health Care System(ECHCS) (Denver, CO)
  '556', // Captn James Lovell Fed Hlt Ctr
  '561', // East Orange Campus of the VA New Jersey Health Care System
  '570', // Central California VA Health Care System
  '573', // N. Florida, S. Georgia HCS
  '578', // Hines IL VAMC
  '581', // Huntington VA Medical Center (Huntington, WV)
  '583', // Richard L. Roudebush VAMC
  '585', // Iron Mountain VAMC
  '590', // Hampton VAMC
  '598', // Central Arkansas Veterans Healthcare System John L. McClellan Memorial Veterans Hospital (Little Rock, AR)
  '603', // Roblex Rex VAMC
  '607', // William S. Middleton Memorial Veterans Hospital
  '610', // Marion VAMC
  '613', // Martinsburg VA Medical Center (Martinsburg, WV)
  '621', // James H. Quillen VAMC
  '636', // VA NWIHS, OMAHA DIVISION
  '637', // Asheville VA Medical Center (Asheville, NC)
  '650', // Providence VAMC
  '656', // St. Cloud VA HCS
  '658', // Salem VA Medical Center (Salem, VA)
  '659', // Salisbury - W.G. (Bill) Hefner VA Medical Center (Salisbury, NC)
  '663', // VA Puget Sound Health Care System - Seattle Division (Seattle, WA)
  '673', // TAMPA FL VAMC
  '675', // Orlando VAMC
  '676', // Tomah VAMC
  '688', // Washington DC VA Medical Center (Washington, DC)
  '695', // MILWAUKEE VAMC
  '756', // El Paso VA HS
  '983', // test-only facility ID, used by user 36 among others
]);

export const NOT_SET_TEXT = 'This information is not available right now.';

export const BANK_INFO_UPDATED_ALERT_SETTINGS = {
  FADE_SPEED: window.Cypress ? 1 : 500,
  TIMEOUT: window.Cypress ? 500 : 6000,
};

export const NOTIFICATION_GROUPS = Object.freeze({
  APPLICATIONS: 'group1',
  YOUR_HEALTH_CARE: 'group3',
  PAYMENTS: 'group4',
});

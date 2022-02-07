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
  MILITARY_INFORMATION: '/profile/military-information',
  NOTIFICATION_SETTINGS: '/profile/notifications',
  CONNECTED_APPLICATIONS: '/profile/connected-applications',
  ACCOUNT_SECURITY: '/profile/account-security',
});

export const PROFILE_PATH_NAMES = Object.freeze({
  DIRECT_DEPOSIT: 'Direct deposit information',
  PERSONAL_INFORMATION: 'Personal and contact information',
  MILITARY_INFORMATION: 'Military information',
  NOTIFICATION_SETTINGS: 'Notification settings',
  CONNECTED_APPLICATIONS: 'Connected apps',
  ACCOUNT_SECURITY: 'Account security',
});

export const PROFILE_PATHS_LGBTQ_ENHANCEMENT = Object.freeze({
  PERSONAL_INFORMATION: '/profile/personal-information',
  CONTACT_INFORMATION: '/profile/contact-information',
});

export const PROFILE_PATH_NAMES_LGBTQ_ENHANCEMENT = Object.freeze({
  PERSONAL_INFORMATION: 'Personal information',
  CONTACT_INFORMATION: 'Contact information',
});

export const ACCOUNT_TYPES_OPTIONS = {
  checking: 'Checking',
  savings: 'Savings',
};

// 554: Denver
// 637: Asheville
// 983: test-only facility ID, used by user 36 among others
export const RX_TRACKING_SUPPORTING_FACILITIES = new Set(['554', '637', '983']);

export const NOT_SET_TEXT = 'This information is not available right now.';

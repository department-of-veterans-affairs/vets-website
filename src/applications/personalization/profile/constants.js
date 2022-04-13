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

// 517	Beckley VA Medical Center (Beckley, WV)
// 554	VA Eastern Colorado Health Care System(ECHCS) (Denver, CO)
// 581	Huntington VA Medical Center (Huntington, WV)
// 598	Central Arkansas Veterans Healthcare System John L. McClellan Memorial Veterans Hospital (Little Rock, AR)
// 608	Manchester VA Medical Center (Manchester, NH)
// 613	Martinsburg VA Medical Center (Martinsburg, WV)
// 637	Asheville VA Medical Center (Asheville, NC)
// 658	Salem VA Medical Center (Salem, VA)
// 659	Salisbury - W.G. (Bill) Hefner VA Medical Center (Salisbury, NC)
// 663	VA Puget Sound Health Care System - Seattle Division (Seattle, WA)
// 688	Washington DC VA Medical Center (Washington, DC)
// 983: test-only facility ID, used by user 36 among others
export const RX_TRACKING_SUPPORTING_FACILITIES = new Set([
  '517',
  '554',
  '581',
  '598',
  '608',
  '613',
  '637',
  '658',
  '659',
  '663',
  '688',
  '983',
]);

export const NOT_SET_TEXT = 'This information is not available right now.';

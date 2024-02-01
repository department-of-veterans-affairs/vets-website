// all the active feature toggles for the profile app with a default value of false
export const PROFILE_TOGGLES = {
  profileContacts: false,
  profileShowPronounsAndSexualOrientation: false,
  profileHideDirectDepositCompAndPen: false,
  profileShowPaymentsNotificationSetting: false,
  profileUseHubPage: false,
  profileShowMhvNotificationSettings: false,
  profileLighthouseDirectDeposit: false,
  profileUseExperimental: false,
  profileShowQuickSubmitNotificationSetting: false,
  profileShowEmailNotificationSettings: false,
  profileShowProofOfVeteranStatus: false,
};

// The values of these constants map to the possible values that come back from
// the GET profile/service_history API.
export const USA_MILITARY_BRANCHES = Object.freeze({
  army: 'Army',
  coastGuard: 'Coast Guard',
  airForce: 'Air Force',
  navy: 'Navy',
  marineCorps: 'Marine Corps',
  spaceForce: 'Space Force',
});

export const SERVICE_BADGE_IMAGE_PATHS = new Map([
  [USA_MILITARY_BRANCHES.army, '/img/vic-army-symbol.png'],
  [USA_MILITARY_BRANCHES.coastGuard, '/img/vic-cg-emblem.png'],
  [USA_MILITARY_BRANCHES.airForce, '/img/vic-air-force-coat-of-arms.png'],
  [USA_MILITARY_BRANCHES.navy, '/img/vic-navy-emblem.png'],
  [USA_MILITARY_BRANCHES.marineCorps, '/img/vic-usmc-emblem.png'],
  [USA_MILITARY_BRANCHES.spaceForce, '/img/vic-space-force-logo.png'],
]);

// These breadcrumbs are the base breadcrumbs for the profile app
// They are used when the user is on the profile root page
export const PROFILE_BREADCRUMB_BASE = [
  { href: '/', label: 'Home' },
  { href: '/profile', label: 'Profile' },
];

export const PROFILE_PATHS = Object.freeze({
  PROFILE_ROOT: '/profile',
  DIRECT_DEPOSIT: '/profile/direct-deposit',
  PERSONAL_INFORMATION: '/profile/personal-information',
  CONTACT_INFORMATION: '/profile/contact-information',
  MILITARY_INFORMATION: '/profile/military-information',
  NOTIFICATION_SETTINGS: '/profile/notifications',
  CONNECTED_APPLICATIONS: '/profile/connected-applications',
  ACCOUNT_SECURITY: '/profile/account-security',
  CONTACTS: '/profile/contacts',
  EDIT: '/profile/edit',
});

export const PROFILE_PATH_NAMES = Object.freeze({
  PROFILE_ROOT: 'Profile',
  DIRECT_DEPOSIT: 'Direct deposit information',
  PERSONAL_INFORMATION: 'Personal information',
  CONTACT_INFORMATION: 'Contact information',
  MILITARY_INFORMATION: 'Military information',
  NOTIFICATION_SETTINGS: 'Notification settings',
  CONNECTED_APPLICATIONS: 'Connected apps',
  ACCOUNT_SECURITY: 'Account security',
  CONTACTS: 'Personal health care contacts',
  EDIT: 'Edit your information',
});

export const PROFILE_PATHS_WITH_NAMES = Object.entries(PROFILE_PATHS).map(
  ([key, path]) => {
    return { path, name: PROFILE_PATH_NAMES[key] };
  },
);

export const ACCOUNT_TYPES_OPTIONS = {
  checking: 'Checking',
  savings: 'Savings',
};

export const RX_TRACKING_SUPPORTING_FACILITIES = new Set([
  '402', // VA Maine Healthcare System - Togus
  '459', // VA Pacific Islands Health Care System
  '504', // Amarillo VA Health Care System
  '512', // Baltimore VA Medical Center - VA Maryland Health Care System
  '517', // Beckley VA Medical Center
  '520', // Gulf Coast Veterans Health Care System
  '534', // Ralph H. Johnson VA Medical Center
  '539', // Cincinnati VA Medical Center
  '540', // Clarksburg - Louis A. Johnson VA Medical Center
  '546', // Miami VA Healthcare System
  '548', // West Palm Beach VAMC
  '550', // VA Illiana
  '554', // VA Eastern Colorado Health Care System (ECHCS)
  '556', // Captain James A. Lovell Federal Health Care Center
  '558', // Durham VA Health Care System
  '561', // East Orange Campus of the VA New Jersey Health Care System
  '570', // Central California VA Health Care System
  '573', // North Florida/South Georgia VA VHS
  '578', // Edward J. Hines Jr. VA Hospital
  '581', // Hershel "Woody" Williams VA Medical Center
  '583', // Richard L. Roudebush VA Medical Center (Indianapolis VA Medical Center)
  '585', // Oscar G. Johnson VA Medical Center
  '589A6', // VA Eastern Kansas Health Care System - Dwight D. Eisenhower VA Medical Center
  '590', // Hampton VA Medical Center
  '596', // Lexington VA Medical Center
  '598', // Central Arkansas Veterans Healthcare System John L. McClellan Memorial Veterans Hospital
  '603', // Robley Rex VA Medical Center
  '605', // VA Loma Linda Healthcare System
  '607', // William S. Middleton Memorial Veterans Hospital
  '608', // Manchester VA Medical Center
  '610', // VA Northern Indiana Health Care System - Marion Campus
  '613', // Martinsburg VA Medical Center
  '614', // VA Memphis Healthcare System
  '621', // Mountain Home VAMC/Johnson City
  '636', // Omaha VA Medical Center--VA Nebraska-Western Iowa HCS
  '637', // Charles George VAMC
  '650', // Providence VA Medical Center
  '656', // St. Cloud VA Health Care System
  '658', // Salem VA Health Care System
  '659', // Salisbury - W.G. (Bill) Hefner VA Medical Center
  '660', // VA Salt Lake City Health Care System
  '662', // San Francisco VA Health Care System
  '663', // VA Puget Sound Health Care System
  '673', // James A. Haley Veterans' Hospital
  '675', // Orlando VA Medical Center
  '676', // Tomah VA Medical Center
  '688', // Washington DC VA Medical Center
  '695', // Clement J. Zablocki Veterans Affairs Medical Center
  '756', // El Paso VA Health Care System
  '983', // test-only facility ID, used by user 36 among others
]);

export const NOT_SET_TEXT = 'This information is not available right now.';

export const BANK_INFO_UPDATED_ALERT_SETTINGS = {
  FADE_SPEED: window.Cypress ? 1 : 500,
  TIMEOUT: window.Cypress ? 500 : 6000,
};

export const NOTIFICATION_GROUPS = Object.freeze({
  APPLICATIONS: 'group1',
  GENERAL: 'group2',
  YOUR_HEALTH_CARE: 'group3',
  PAYMENTS: 'group4',
  QUICK_SUBMIT: 'group5',
});

export const NOTIFICATION_CHANNEL_IDS = Object.freeze({
  TEXT: '1',
  EMAIL: '2',
});

export const NOTIFICATION_CHANNEL_LABELS = Object.freeze({
  [NOTIFICATION_CHANNEL_IDS.TEXT]: 'text',
  [NOTIFICATION_CHANNEL_IDS.EMAIL]: 'email',
});

/**
 * These notification item IDs are not currently supported by the VA Profile
 * they are blocked via feature toggle 'profile_show_mhv_notification_settings'
 *
 * 7 - RX refill shipment notification
 * 8 - VA Appointment reminders
 * 9 - Securing messaging alert
 * 10 - Medical images and reports available
 * 11 - Biweekly MHV newsletter
 *
 * These are all email based notifications
 *
 */
export const BLOCKED_MHV_NOTIFICATION_IDS = [
  'item7',
  'item8',
  'item9',
  'item10',
  'item11',
];

// used for api status GA events
export const API_STATUS = Object.freeze({
  STARTED: 'started',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
});

// all the active feature toggles for the profile app with a default value of false
export const PROFILE_TOGGLES = {
  profileShowPronounsAndSexualOrientation: false,
  representativeStatusEnableV2Features: false,
  profileHideDirectDeposit: false,
  profileShowMhvNotificationSettings: false,
  profileLighthouseDirectDeposit: false,
  profileUseExperimental: false,
  profileShowQuickSubmitNotificationSetting: false,
  profileShowEmailNotificationSettings: false,
  profileShowPaperlessDelivery: false,
  profile2Enabled: false,
  profileHealthCareSettingsPage: false,
  profileHideHealthCareContacts: false,
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

export const VA_SEAL_IMAGE_PATH = '/img/design/seal/seal.png';

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
  { href: '/', label: 'VA.gov home' },
  { href: '/profile', label: 'Profile', isRouterLink: true },
];

const SCHEDULING_PREF_BASE_PATH =
  '/profile/health-care-settings/scheduling-preferences';

export const PROFILE_PATHS = Object.freeze({
  PROFILE_ROOT: '/profile',
  PERSONAL_INFORMATION: '/profile/personal-information',
  CONTACT_INFORMATION: '/profile/contact-information',
  MILITARY_INFORMATION: '/profile/military-information',
  SERVICE_HISTORY_INFORMATION: '/profile/military-information',
  FINANCIAL_INFORMATION: '/profile/financial-information',
  DIRECT_DEPOSIT: '/profile/direct-deposit',
  HEALTH_CARE_SETTINGS: '/profile/health-care-settings',
  SCHEDULING_PREFERENCES:
    '/profile/health-care-settings/scheduling-preferences',
  SCHEDULING_PREF_CONTACT_METHOD: `${SCHEDULING_PREF_BASE_PATH}/contact-method`,
  SCHEDULING_PREF_CONTACT_TIMES: `${SCHEDULING_PREF_BASE_PATH}/contact-times`,
  SCHEDULING_PREF_APPOINTMENT_TIMES: `${SCHEDULING_PREF_BASE_PATH}/appointment-times`,
  HEALTH_CARE_CONTACTS: '/profile/contacts',
  MESSAGES_SIGNATURE: '/profile/message-signature',
  DEPENDENTS_AND_CONTACTS: '/profile/dependents-and-contacts',
  CONTACTS: '/profile/contacts',
  ACCREDITED_REPRESENTATIVE: '/profile/accredited-representative',
  LETTERS_AND_DOCUMENTS: '/profile/letters-and-documents',
  VETERAN_STATUS_CARD: '/profile/veteran-status-card',
  NOTIFICATION_SETTINGS: '/profile/notifications',
  EMAIL_AND_TEXT_NOTIFICATIONS: '/profile/notifications',
  ACCOUNT_SECURITY: '/profile/account-security',
  CONNECTED_APPLICATIONS: '/profile/connected-applications',
  SIGNIN_INFORMATION: '/profile/account-security/sign-in-information',
  EDIT: '/profile/edit',
  PAPERLESS_DELIVERY: '/profile/paperless-delivery',
});

export const PROFILE_PATH_NAMES = Object.freeze({
  PROFILE_ROOT: 'Profile',
  PERSONAL_INFORMATION: 'Personal information',
  CONTACT_INFORMATION: 'Contact information',
  MILITARY_INFORMATION: 'Military information',
  SERVICE_HISTORY_INFORMATION: 'Service history information',
  FINANCIAL_INFORMATION: 'Financial information',
  DIRECT_DEPOSIT: 'Direct deposit information',
  HEALTH_CARE_SETTINGS: 'Health care settings',
  SCHEDULING_PREFERENCES: 'Scheduling preferences',
  SCHEDULING_PREF_CONTACT_METHOD: 'Contact method',
  SCHEDULING_PREF_CONTACT_TIMES: 'Contact times',
  SCHEDULING_PREF_APPOINTMENT_TIMES: 'Appointment times',
  HEALTH_CARE_CONTACTS: 'Health care contacts',
  MESSAGES_SIGNATURE: 'Messages signature',
  DEPENDENTS_AND_CONTACTS: 'Dependents and contacts',
  CONTACTS: 'Personal health care contacts',
  ACCREDITED_REPRESENTATIVE: 'Accredited representative or VSO',
  LETTERS_AND_DOCUMENTS: 'Letters and documents',
  VETERAN_STATUS_CARD: 'Veteran Status Card',
  NOTIFICATION_SETTINGS: 'Notification settings',
  EMAIL_AND_TEXT_NOTIFICATIONS: 'Email and text notifications',
  PAPERLESS_DELIVERY: 'Paperless delivery',
  ACCOUNT_SECURITY: 'Account security',
  CONNECTED_APPLICATIONS: 'Connected apps',
  SIGNIN_INFORMATION: 'Sign-in information',
  EDIT: 'Edit your information',
});

export const PROFILE_PATHS_WITH_NAMES = Object.entries(PROFILE_PATHS).map(
  ([key, path]) => {
    return { path, name: PROFILE_PATH_NAMES[key] };
  },
);

export const RX_TRACKING_SUPPORTING_FACILITIES = new Set([
  '402', // VA Maine Healthcare System - Togus
  '438', // Royal C. Johnson Veterans Memorial Medical Center
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
  '593', // VA Southern Nevada Healthcare System
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
  '636A8', // Iowa City HCS
  '637', // Charles George VAMC
  '650', // Providence VA Medical Center
  '656', // St. Cloud VA Health Care System
  '657', // VA St. Louis Health Care System
  '658', // Salem VA Health Care System
  '659', // Salisbury - W.G. (Bill) Hefner VA Medical Center
  '660', // VA Salt Lake City Health Care System
  '662', // San Francisco VA Health Care System
  '663', // VA Puget Sound Health Care System
  '673', // James A. Haley Veterans' Hospital
  '675', // Orlando VA Medical Center
  '676', // Tomah VA Medical Center
  '678', // Southern Arizona VA Health Care System
  '688', // Washington DC VA Medical Center
  '693', // Wilkes-Barre VA Medical Center
  '695', // Clement J. Zablocki Veterans Affairs Medical Center
  '756', // El Paso VA Health Care System
  '983', // test-only facility ID, used by user 36 among others
]);

export const NOT_SET_TEXT = 'This information is not available right now.';

export const NOTIFICATION_GROUPS = Object.freeze({
  APPLICATIONS: 'group1',
  GENERAL: 'group2',
  YOUR_HEALTH_CARE: 'group3',
  PAYMENTS: 'group4',
  QUICK_SUBMIT: 'group5',
  PAPERLESS_DELIVERY: 'group6',
});

const RAW_IDS = Object.freeze({
  APPEAL_HEARING_REMINDERS: 1,
  HEALTH_APPOINTMENT_REMINDERS: 3,
  PRESCRIPTION_SHIPMENT: 4,
  DISABILITY_PENSION_DEPOSIT: 5,
  APPEAL_STATUS_UPDATES: 6,
  RX_REFILL: 7,
  VA_APPOINTMENT_REMINDERS: 8,
  SECURE_MESSAGING: 9,
  MEDICAL_IMAGES: 10,
  BIWEEKLY_MHV_NEWSLETTER: 11,
  QUICK_SUBMIT: 12,
  BENEFIT_OVERPAYMENT_DEBT: 13,
  HEALTH_CARE_COPAY_BILL: 14,
});

export const NOTIFICATION_ITEM_IDS = Object.freeze({
  APPEAL_HEARING_REMINDERS: `item${RAW_IDS.APPEAL_HEARING_REMINDERS}`,
  HEALTH_APPOINTMENT_REMINDERS: `item${RAW_IDS.HEALTH_APPOINTMENT_REMINDERS}`,
  PRESCRIPTION_SHIPMENT: `item${RAW_IDS.PRESCRIPTION_SHIPMENT}`,
  DISABILITY_PENSION_DEPOSIT: `item${RAW_IDS.DISABILITY_PENSION_DEPOSIT}`,
  APPEAL_STATUS_UPDATES: `item${RAW_IDS.APPEAL_STATUS_UPDATES}`,
  RX_REFILL: `item${RAW_IDS.RX_REFILL}`,
  VA_APPOINTMENT_REMINDERS: `item${RAW_IDS.VA_APPOINTMENT_REMINDERS}`,
  SECURE_MESSAGING: `item${RAW_IDS.SECURE_MESSAGING}`,
  MEDICAL_IMAGES: `item${RAW_IDS.MEDICAL_IMAGES}`,
  BIWEEKLY_MHV_NEWSLETTER: `item${RAW_IDS.BIWEEKLY_MHV_NEWSLETTER}`,
  QUICK_SUBMIT: `item${RAW_IDS.QUICK_SUBMIT}`,
  BENEFIT_OVERPAYMENT_DEBT: `item${RAW_IDS.BENEFIT_OVERPAYMENT_DEBT}`,
  HEALTH_CARE_COPAY_BILL: `item${RAW_IDS.HEALTH_CARE_COPAY_BILL}`,
});

export const NOTIFICATION_CHANNEL_IDS = Object.freeze({
  TEXT: '1',
  EMAIL: '2',
});

export const NOTIFICATION_CHANNEL_LABELS = Object.freeze({
  [NOTIFICATION_CHANNEL_IDS.TEXT]: 'text',
  [NOTIFICATION_CHANNEL_IDS.EMAIL]: 'email',
});

export const NOTIFICATION_CHANNEL_FIELD_DESCRIPTIONS = Object.freeze({
  [`channel${RAW_IDS.HEALTH_APPOINTMENT_REMINDERS}-${
    NOTIFICATION_CHANNEL_IDS.TEXT
  }`]: "Text reminders can include facility and clinic details. We'll send you a text to opt in or out of including these details in your appointment reminders.",
  [`channel${RAW_IDS.HEALTH_APPOINTMENT_REMINDERS}-${
    NOTIFICATION_CHANNEL_IDS.EMAIL
  }`]: 'Email reminders include facility and clinic details.',
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
 * 12 - QuickSubmit
 *
 * These are all email based notifications
 *
 */
export const BLOCKED_MHV_NOTIFICATION_IDS = [
  NOTIFICATION_ITEM_IDS.RX_REFILL,
  NOTIFICATION_ITEM_IDS.VA_APPOINTMENT_REMINDERS,
  NOTIFICATION_ITEM_IDS.BIWEEKLY_MHV_NEWSLETTER,
  NOTIFICATION_ITEM_IDS.QUICK_SUBMIT,
];

// used for api status GA events
export const API_STATUS = Object.freeze({
  STARTED: 'started',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
});

// Direct deposit constants
export const ACCOUNT_TYPES_OPTIONS = {
  checking: 'Checking',
  savings: 'Savings',
};

export const DIRECT_DEPOSIT_ALERT_SETTINGS = {
  FADE_SPEED: window.Cypress ? 1 : 500,
  TIMEOUT: window.Cypress ? 500 : 6000,
};

// end dates for each credential type
export const CREDENTIAL_DEADLINES = {
  'My HealtheVet': 'January 31, 2025',
  'DS Logon': 'September 30, 2025',
};

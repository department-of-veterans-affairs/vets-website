import { getAppUrl } from '~/platform/utilities/registry-helpers';

// declare global app URLs for use with content links
export const APP_URLS = {
  dischargeWizard: getAppUrl('discharge-upgrade-instructions'),
  ezr: getAppUrl('ezr'),
  facilities: getAppUrl('facilities'),
  hca: getAppUrl('hca'),
  profile: getAppUrl('profile'),
  verify: getAppUrl('verify'),
};

// declare view fields for use in household section
export const DEPENDENT_VIEW_FIELDS = {
  report: 'view:reportDependents',
  skip: 'view:skipDependentInfo',
};

// declare prefix for use in GA events related to disability rating
export const DISABILITY_PREFIX = 'disability-ratings';

// declare action statuses for fetching disability rating
export const DISABILITY_RATING_ACTIONS = {
  FETCH_DISABILITY_RATING_STARTED: 'FETCH_DISABILITY_RATING_STARTED',
  FETCH_DISABILITY_RATING_FAILED: 'FETCH_DISABILITY_RATING_FAILED',
  FETCH_DISABILITY_RATING_SUCCEEDED: 'FETCH_DISABILITY_RATING_SUCCEEDED',
};

// declare initial state for disability rating reducer
export const DISABILITY_RATING_INIT_STATE = {
  totalRating: null,
  loading: true,
  error: null,
};

// declare labels for discharge type select box
export const DISCHARGE_TYPE_LABELS = {
  honorable: 'Honorable',
  general: 'General',
  other: 'Other Than Honorable',
  'bad-conduct': 'Bad Conduct',
  dishonorable: 'Dishonorable',
  undesirable: 'Undesirable',
};

// declare action statuses for fetching enrollment status
export const ENROLLMENT_STATUS_ACTIONS = {
  FETCH_DISMISSED_HCA_NOTIFICATION_STARTED:
    'FETCH_DISMISSED_HCA_NOTIFICATION_STARTED',
  FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED:
    'FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED',
  FETCH_DISMISSED_HCA_NOTIFICATION_FAILED:
    'FETCH_DISMISSED_HCA_NOTIFICATION_FAILED',
  FETCH_ENROLLMENT_STATUS_STARTED: 'FETCH_ENROLLMENT_STATUS_STARTED',
  FETCH_ENROLLMENT_STATUS_SUCCEEDED: 'FETCH_ENROLLMENT_STATUS_SUCCEEDED',
  FETCH_ENROLLMENT_STATUS_FAILED: 'FETCH_ENROLLMENT_STATUS_FAILED',
  RESET_ENROLLMENT_STATUS: 'RESET_ENROLLMENT_STATUS',
  SET_DISMISSED_HCA_NOTIFICATION: 'SET_DISMISSED_HCA_NOTIFICATION',
};

// declare initial state fetching enrollment status
export const ENROLLMENT_STATUS_INIT_STATE = {
  applicationDate: null,
  enrollmentDate: null,
  preferredFacility: null,
  enrollmentStatus: null,
  enrollmentStatusEffectiveDate: null,
  dismissedNotificationDate: null,
  hasServerError: false,
  isLoadingApplicationStatus: false,
  isLoadingDismissedNotification: false,
  isUserInMVI: false,
  loginRequired: false,
  noESRRecordFound: false,
};

// declare enrollment status strings
export const HCA_ENROLLMENT_STATUSES = Object.freeze({
  activeDuty: 'activeduty',
  canceledDeclined: 'canceled_declined',
  closed: 'closed',
  deceased: 'deceased',
  enrolled: 'enrolled',
  ineligCHAMPVA: 'inelig_champva',
  ineligCharacterOfDischarge: 'inelig_character_of_discharge',
  ineligCitizens: 'inelig_citizens',
  ineligFilipinoScouts: 'inelig_filipinoscouts',
  ineligFugitiveFelon: 'inelig_fugitivefelon',
  ineligGuardReserve: 'inelig_guard_reserve',
  ineligMedicare: 'inelig_medicare',
  ineligNotEnoughTime: 'inelig_not_enough_time',
  ineligNotVerified: 'inelig_not_verified',
  ineligOther: 'inelig_other',
  ineligOver65: 'inelig_over65',
  ineligRefusedCopay: 'inelig_refusedcopay',
  ineligTrainingOnly: 'inelig_training_only',
  nonMilitary: 'non_military',
  noneOfTheAbove: 'none_of_the_above',
  pendingMt: 'pending_mt',
  pendingOther: 'pending_other',
  pendingPurpleHeart: 'pending_purpleheart',
  pendingUnverified: 'pending_unverified',
  rejectedIncWrongEntry: 'rejected_inc_wrongentry',
  rejectedScWrongEntry: 'rejected_sc_wrongentry',
  rejectedRightEntry: 'rejected_rightentry',
});

// declare enrollment status codes that permit apply/reapply action
export const HCA_APPLY_ALLOWED_STATUSES = new Set([
  null,
  HCA_ENROLLMENT_STATUSES.noneOfTheAbove,
  HCA_ENROLLMENT_STATUSES.rejectedIncWrongEntry,
  HCA_ENROLLMENT_STATUSES.rejectedRightEntry,
  HCA_ENROLLMENT_STATUSES.rejectedScWrongEntry,
  HCA_ENROLLMENT_STATUSES.canceledDeclined,
  HCA_ENROLLMENT_STATUSES.closed,
]);

// declare the minimum percentage value to be considered high disability
export const HIGH_DISABILITY_MINIMUM = 50;

// declare labels for last service branch select box
export const SERVICE_BRANCH_LABELS = {
  'air force': 'Air Force',
  army: 'Army',
  'coast guard': 'Coast Guard',
  'marine corps': 'Marine Corps',
  'merchant seaman': 'Merchant Seaman',
  navy: 'Navy',
  noaa: 'Noaa',
  'space force': 'Space Force',
  usphs: 'USPHS',
  'f.commonwealth': 'Filipino Commonwealth Army',
  'f.guerilla': 'Filipino Guerilla Forces',
  'f.scouts new': 'Filipino New Scout',
  'f.scouts old': 'Filipino Old Scout',
  other: 'Other',
};

// declare name to use for window session storage item
export const SESSION_ITEM_NAME = 'hcaDependentIndex';

/**
 * declare routes that are shared between custom form pages
 */
export const SHARED_PATHS = {
  dependents: {
    summary: 'household-information/dependents',
    info: 'household-information/dependent-information',
  },
};

// declare states without medical care serivces
export const STATES_WITHOUT_MEDICAL = ['AA', 'AE', 'AP', 'FM', 'MH', 'PW'];

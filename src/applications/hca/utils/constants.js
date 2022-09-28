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

// declare alert types for enrollment status helpers
export const DASHBOARD_ALERT_TYPES = Object.freeze({
  closed: 'closed', // Black, exclamation mark
  decision: 'decision', // Red, exclamation mark
  enrolled: 'enrolled', // Green, checkmark
  inProgress: 'in-progress', // Blue, pause (TBD)
  update: 'update', // Gold, exclamation
});

export const IS_LOGGED_IN = 'isVeteranLoggedIn';
export const USER_DOB = 'veteranDOB';
export const IS_GTE_HIGH_DISABILITY =
  'isVetetanDisabilityRatingGreaterThanOrEqualToHighDisability';
export const IS_COMPENSATION_TYPE_HIGH =
  'isCompensationTypeHighDisabilitySelected';
export const IS_VETERAN_IN_MVI = 'isVeteranDataInMPI';
export const IS_SHORT_FORM_ENABLED = 'isShortFormFeatureToggleEnabled';

// declare states without medical care serivces
export const statesWithoutService = ['AA', 'AE', 'AP', 'FM', 'MH', 'PW'];

// declare labels for discharge type select box
export const dischargeTypeLabels = {
  honorable: 'Honorable',
  general: 'General',
  other: 'Other Than Honorable',
  'bad-conduct': 'Bad Conduct',
  dishonorable: 'Dishonorable',
  undesirable: 'Undesirable',
};

// declare labels for last service branch select box
export const lastServiceBranchLabels = {
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

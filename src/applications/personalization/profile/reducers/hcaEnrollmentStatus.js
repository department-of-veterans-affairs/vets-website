// copied from the HCA application at ~/applications/hca/reducers/enrollment-status.js so that
// we can isolate the application for CI/CD purposes

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
  SHOW_HCA_REAPPLY_CONTENT: 'SHOW_HCA_REAPPLY_CONTENT',
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

const initialState = {
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
  showReapplyContent: false,
};

function hcaEnrollmentStatus(state = initialState, action) {
  const { data = {}, response = {}, type } = action;
  const {
    FETCH_ENROLLMENT_STATUS_STARTED,
    FETCH_ENROLLMENT_STATUS_SUCCEEDED,
    FETCH_ENROLLMENT_STATUS_FAILED,
    RESET_ENROLLMENT_STATUS,
    FETCH_DISMISSED_HCA_NOTIFICATION_STARTED,
    FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED,
    FETCH_DISMISSED_HCA_NOTIFICATION_FAILED,
    SET_DISMISSED_HCA_NOTIFICATION,
    SHOW_HCA_REAPPLY_CONTENT,
  } = ENROLLMENT_STATUS_ACTIONS;

  const actionMap = {
    [FETCH_ENROLLMENT_STATUS_STARTED]: () => ({
      ...state,
      isLoadingApplicationStatus: true,
    }),
    [FETCH_ENROLLMENT_STATUS_SUCCEEDED]: () => {
      const {
        parsedStatus,
        applicationDate,
        effectiveDate: enrollmentStatusEffectiveDate,
        enrollmentDate,
        preferredFacility,
      } = data;
      const enrollmentStatus = parsedStatus;
      const isInESR =
        enrollmentStatus !== HCA_ENROLLMENT_STATUSES.noneOfTheAbove;
      return {
        ...state,
        hasServerError: false,
        enrollmentStatus,
        enrollmentStatusEffectiveDate,
        applicationDate,
        enrollmentDate,
        preferredFacility,
        loginRequired: isInESR,
        noESRRecordFound: !isInESR,
        isLoadingApplicationStatus: false,
        isUserInMVI: true,
      };
    },
    [FETCH_ENROLLMENT_STATUS_FAILED]: () => {
      const { errors } = action;
      const noESRRecordFound =
        errors && errors.some(error => error.code === '404');
      const hasRateLimitError =
        errors && errors.some(error => error.code === '429');
      // if the error is not given special handling, treat it like a server error
      const hasServerError = !noESRRecordFound && !hasRateLimitError;
      return {
        ...state,
        hasServerError,
        isLoadingApplicationStatus: false,
        loginRequired: Boolean(hasRateLimitError),
        noESRRecordFound: Boolean(noESRRecordFound),
      };
    },
    [RESET_ENROLLMENT_STATUS]: () => ({ ...initialState }),
    [FETCH_DISMISSED_HCA_NOTIFICATION_STARTED]: () => ({
      ...state,
      isLoadingDismissedNotification: true,
    }),
    [FETCH_DISMISSED_HCA_NOTIFICATION_SUCCEEDED]: () => {
      const {
        statusEffectiveAt: dismissedNotificationDate,
      } = response.data.attributes;
      return {
        ...state,
        dismissedNotificationDate,
        isLoadingDismissedNotification: false,
      };
    },
    [FETCH_DISMISSED_HCA_NOTIFICATION_FAILED]: () => ({
      ...state,
      isLoadingDismissedNotification: false,
    }),
    [SET_DISMISSED_HCA_NOTIFICATION]: () => ({
      ...state,
      dismissedNotificationDate: data,
    }),
    [SHOW_HCA_REAPPLY_CONTENT]: () => ({ ...state, showReapplyContent: true }),
  };

  return actionMap[type] ? actionMap[type]() : state;
}

export default hcaEnrollmentStatus;

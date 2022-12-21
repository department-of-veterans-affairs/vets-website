import {
  EDIT_MONTH_VERIFICATION,
  FETCH_POST_911_GI_BILL_ELIGIBILITY_SUCCESS,
  FETCH_POST_911_GI_BILL_ELIGIBILITY_FAILURE,
  UPDATE_VERIFICATION_STATUS_MONTHS,
  UPDATE_VERIFICATION_STATUS,
  UPDATE_VERIFICATION_STATUS_SUCCESS,
  UPDATE_VERIFICATION_STATUS_FAILURE,
  VERIFICATION_STATUS_CORRECT,
  VERIFICATION_STATUS_INCORRECT,
} from '../actions';

const initialState = {
  enrollmentVerification: null,
  editMonthVerification: null,
  enrollmentVerificationSubmitted: false,
  enrollmentVerificationSubmissionResult: null,
};

export default {
  data: (state = initialState, action) => {
    switch (action.type) {
      case FETCH_POST_911_GI_BILL_ELIGIBILITY_SUCCESS:
        return {
          ...state,
          enrollmentVerificationFetchComplete: true,
          enrollmentVerificationFetchFailure: false,
          enrollmentVerification: {
            ...action?.response?.data?.attributes,
            enrollmentVerifications: action?.response?.data?.attributes?.enrollmentVerifications?.filter(
              ev =>
                ev.certifiedEndDate < new Date().toISOString().split('T')[0],
            ),
          },
        };
      case FETCH_POST_911_GI_BILL_ELIGIBILITY_FAILURE:
        return {
          ...state,
          enrollmentVerificationFetchComplete: true,
          enrollmentVerificationFetchFailure: true,
        };
      case UPDATE_VERIFICATION_STATUS_MONTHS:
        return {
          ...state,
          enrollmentVerification: {
            ...state.enrollmentVerification,
            enrollmentVerifications: action?.payload,
          },
        };
      case EDIT_MONTH_VERIFICATION:
        return {
          ...state,
          editMonthVerification: action,
        };
      case UPDATE_VERIFICATION_STATUS:
        return {
          ...state,
          enrollmentVerificationSubmitted: true,
        };
      case UPDATE_VERIFICATION_STATUS_SUCCESS:
        return {
          ...state,
          enrollmentVerificationSubmissionResult: UPDATE_VERIFICATION_STATUS_SUCCESS,
          enrollmentVerification: {
            ...state.enrollmentVerification,
            enrollmentVerifications: state.enrollmentVerification?.enrollmentVerifications?.map(
              ev => {
                let newVerificationResponse;
                if (ev.verificationStatus) {
                  newVerificationResponse =
                    ev.verificationStatus === VERIFICATION_STATUS_CORRECT
                      ? 'Y'
                      : 'N';
                }

                return {
                  ...ev,
                  verificationResponse:
                    newVerificationResponse || ev.verificationResponse,
                  verificationStatus: null,
                };
              },
            ),
            lastCertifiedThroughDate:
              state.enrollmentVerification?.enrollmentVerifications?.find(
                ev => ev.verificationStatus === VERIFICATION_STATUS_CORRECT,
              )?.certifiedEndDate ||
              state.enrollmentVerification?.lastCertifiedThroughDate,
            paymentOnHold:
              state.enrollmentVerification?.paymentOnHold ||
              state.enrollmentVerification?.enrollmentVerifications?.some(
                ev => ev.verificationStatus === VERIFICATION_STATUS_INCORRECT,
              ),
            verificationStatus: null,
          },
        };
      case UPDATE_VERIFICATION_STATUS_FAILURE:
        return {
          ...state,
          enrollmentVerificationSubmissionResult: UPDATE_VERIFICATION_STATUS_FAILURE,
        };
      default:
        return state;
    }
  },
};

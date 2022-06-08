import {
  EDIT_MONTH_VERIFICATION,
  FETCH_POST_911_GI_BILL_ELIGIBILITY_SUCCESS,
  FETCH_POST_911_GI_BILL_ELIGIBILITY_FAILURE,
  UPDATE_VERIFICATION_STATUS_MONTHS,
} from '../actions';

const initialState = {};

export default {
  data: (state = initialState, action) => {
    switch (action.type) {
      case FETCH_POST_911_GI_BILL_ELIGIBILITY_SUCCESS:
      case FETCH_POST_911_GI_BILL_ELIGIBILITY_FAILURE:
        return {
          ...state,
          enrollmentVerification: {
            ...action?.response?.data?.attributes,
            enrollmentVerifications: action?.response?.data?.attributes?.enrollmentVerifications?.filter(
              ev =>
                ev.certifiedEndDate < new Date().toISOString().split('T')[0],
            ),
          },
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
      default:
        return state;
    }
  },
};

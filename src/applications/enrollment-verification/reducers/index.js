/* eslint-disable prettier/prettier */
import {
	FETCH_VERIFICATION_STATUS_FAILURE,
  FETCH_VERIFICATION_STATUS_SUCCESS,
  PAYMENT_STATUS,
} from '../actions';

const initialState = {
};

export default {
  data: (state = initialState, action) => {
    switch (action.type) {
      case FETCH_VERIFICATION_STATUS_FAILURE:
      case FETCH_VERIFICATION_STATUS_SUCCESS:
        return {
          ...state,
          verificationStatus: action?.response || {
            paymentStatus: PAYMENT_STATUS.ONGOING,
            months: [
              {
                month: '2021-10',
                verified: true,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 10,
                    startData: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 4,
                    startData: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                ]
              }
            ]
          }
        };
      default: 
        return state;
    }
  }
};

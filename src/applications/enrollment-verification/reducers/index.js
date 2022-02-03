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
            nextVerificationDate: '2022-02-01',
            months: [
              {
                month: '2022-01',
                verified: false,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 9,
                    startDate: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 6,
                    startDate: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                ]
              },
              {
                month: '2021-12',
                verified: false,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 12,
                    startDate: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 2,
                    startDate: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                ]
              },
              {
                month: '2021-11',
                verified: false,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 10,
                    startDate: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 4,
                    startDate: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                ]
              },
              {
                month: '2021-10',
                verified: true,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 10,
                    startDate: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 4,
                    startDate: '2021-10-01',
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

import {
  EDIT_MONTH_VERIFICATION,
  FETCH_POST_911_GI_BILL_ELIGIBILITY_SUCCESS,
  FETCH_POST_911_GI_BILL_ELIGIBILITY_FAILURE,
  FETCH_VERIFICATION_STATUS_FAILURE,
  FETCH_VERIFICATION_STATUS_SUCCESS,
  PAYMENT_STATUS,
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
          post911GiBillEligibility: action?.response || true,
        };
      case FETCH_VERIFICATION_STATUS_FAILURE:
      case FETCH_VERIFICATION_STATUS_SUCCESS:
        return {
          ...state,
          verificationStatus: action?.response || {
            paymentStatus: PAYMENT_STATUS.ONGOING,
            nextVerificationDate: '2022-03-01',
            months: [
              {
                month: '2022-02',
                verified: false,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 15,
                    startDate: '2022-01-01',
                    endDate: '2022-01-31',
                  },
                ],
              },
              {
                month: '2022-01',
                verified: false,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 15,
                    startDate: '2022-01-01',
                    endDate: '2022-01-31',
                  },
                ],
              },
              {
                month: '2021-12',
                verified: false,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 10,
                    startDate: '2021-12-01',
                    endDate: '2021-12-31',
                  },
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 4,
                    startDate: '2021-12-01',
                    endDate: '2021-12-31',
                  },
                ],
              },
              {
                month: '2021-11',
                verified: true,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 10,
                    startDate: '2021-11-01',
                    endDate: '2021-11-30',
                  },
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 4,
                    startDate: '2021-11-01',
                    endDate: '2021-11-30',
                  },
                ],
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
                ],
              },
              {
                month: '2021-09',
                verified: true,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 10,
                    startDate: '2021-09-01',
                    endDate: '2021-9-30',
                  },
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 4,
                    startDate: '2021-10-01',
                    endDate: '2021-10-31',
                  },
                ],
              },
              {
                month: '2021-08',
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
                    startDate: '2021-8-01',
                    endDate: '2021-8-31',
                  },
                ],
              },
              {
                month: '2021-07',
                verified: true,
                enrollments: [
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 4,
                    startDate: '2021-07-01',
                    endDate: '2021-07-31',
                  },
                ],
              },
              {
                month: '2021-06',
                verified: true,
                enrollments: [
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 4,
                    startDate: '2021-06-01',
                    endDate: '2021-06-30',
                  },
                ],
              },
              {
                month: '2021-05',
                verified: true,
                enrollments: [
                  {
                    institution: 'Adirondack Community College',
                    creditHours: 4,
                    startDate: '2021-05-01',
                    endDate: '2021-05-31',
                  },
                ],
              },
              {
                month: '2021-04',
                verified: true,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 15,
                    startDate: '2021-04-01',
                    endDate: '2021-04-30',
                  },
                ],
              },
              {
                month: '2021-03',
                verified: true,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 15,
                    startDate: '2021-03-01',
                    endDate: '2021-03-31',
                  },
                ],
              },
              {
                month: '2021-02',
                verified: true,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 15,
                    startDate: '2021-02-01',
                    endDate: '2021-02-28',
                  },
                ],
              },
              {
                month: '2021-01',
                verified: true,
                enrollments: [
                  {
                    institution: 'Wake Forest University School of Business',
                    creditHours: 15,
                    startDate: '2021-01-01',
                    endDate: '2021-01-31',
                  },
                ],
              },
            ],
          },
        };
      case UPDATE_VERIFICATION_STATUS_MONTHS:
        return {
          ...state,
          verificationStatus: {
            ...state.verificationStatus,
            months: action?.payload,
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

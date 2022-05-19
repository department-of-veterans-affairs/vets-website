import {
  EDIT_MONTH_VERIFICATION,
  FETCH_POST_911_GI_BILL_ELIGIBILITY_SUCCESS,
  FETCH_POST_911_GI_BILL_ELIGIBILITY_FAILURE,
  UPDATE_VERIFICATION_STATUS_MONTHS,
} from '../actions';

const initialState = {};

// const testEv = {
//   claimantId: 600000000,
//   lastCertifiedThroughDate: '2021-10-01',
//   paymentOnHold: false,
//   enrollmentVerifications: [
//     {
//       verificationMonth: 'May 2022',
//       certifiedBeginDate: '2022-05-01',
//       certifiedEndDate: '2022-05-19',
//       certifiedThroughDate: null,
//       certificationMethod: null,
//       enrollments: [
//         {
//           facilityName: 'UNIVERSITY OF HAWAII AT HILO',
//           beginDate: '2022-05-01',
//           endDate: '2022-05-31',
//           totalCreditHours: 22.0,
//         },
//       ],
//       verificationResponse: 'NR',
//       createdDate: null,
//     },
//     {
//       verificationMonth: 'October 2021',
//       certifiedBeginDate: '2021-10-01',
//       certifiedEndDate: '2021-10-31',
//       certifiedThroughDate: null,
//       certificationMethod: null,
//       enrollments: [
//         {
//           facilityName: 'UNIVERSITY OF HAWAII AT HILO',
//           beginDate: '2021-08-01',
//           endDate: '2021-10-01',
//           totalCreditHours: 22.0,
//         },
//       ],
//       verificationResponse: 'NR',
//       createdDate: null,
//     },
//     {
//       verificationMonth: 'September 2021',
//       certifiedBeginDate: '2021-09-01',
//       certifiedEndDate: '2021-09-30',
//       certifiedThroughDate: null,
//       certificationMethod: null,
//       enrollments: [
//         {
//           facilityName: 'UNIVERSITY OF HAWAII AT HILO',
//           beginDate: '2021-08-01',
//           endDate: '2021-10-01',
//           totalCreditHours: 22.0,
//         },
//       ],
//       verificationResponse: 'NR',
//       createdDate: null,
//     },
//     {
//       verificationMonth: 'August 2021',
//       certifiedBeginDate: '2021-08-01',
//       certifiedEndDate: '2021-08-31',
//       certifiedThroughDate: null,
//       certificationMethod: null,
//       enrollments: [
//         {
//           facilityName: 'UNIVERSITY OF HAWAII AT HILO',
//           beginDate: '2021-08-01',
//           endDate: '2021-10-01',
//           totalCreditHours: 22.0,
//         },
//       ],
//       verificationResponse: 'NR',
//       createdDate: null,
//     },
//   ],
// };

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

          // Test data:
          // enrollmentVerification: action?.response?.data?.attributes
          //   ? {
          //       ...action?.response?.data?.attributes,
          //       enrollmentVerifications: action?.response?.data?.attributes?.enrollmentVerifications?.filter(
          //         ev =>
          //           ev.certifiedEndDate <
          //           new Date().toISOString().split('T')[0],
          //       ),
          //     }
          //   : {
          //       ...testEv,
          //       enrollmentVerifications: testEv?.enrollmentVerifications?.filter(
          //         ev =>
          //           ev.certifiedEndDate <
          //           new Date().toISOString().split('T')[0],
          //       ),
          //     },
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

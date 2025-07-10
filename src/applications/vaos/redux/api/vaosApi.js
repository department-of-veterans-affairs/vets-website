import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { createApi } from '@reduxjs/toolkit/query/react';
import { apiRequestWithUrl } from 'applications/vaos/services/utils';
import { captureError } from '../../utils/error';
import { fetchPendingAppointments } from '../actions';

export const vaosApi = createApi({
  reducerPath: 'appointmentApi',
  // When not using the built in fetch functionality, you have to return an
  // object with a data key as null to the baseQuery. Here we are using a util
  // function (apiRequestWithUrl) to make API call.
  baseQuery: () => ({ data: null }),
  // Cache is normally 60 seconds by default, but it causes each test
  // to take an additional 60 seconds to run, so we set it to 0.
  keepUnusedDataFor: environment.isUnitTest() ? 0 : 60,
  endpoints: builder => ({
    getReferralById: builder.query({
      async queryFn(referralId) {
        try {
          return await apiRequestWithUrl(`/vaos/v2/referrals/${referralId}`);
        } catch (error) {
          captureError(error, false, 'fetch single referral');
          return {
            error: { status: error.status || 500, message: error.message },
          };
        }
      },
    }),
    getPatientReferrals: builder.query({
      async queryFn() {
        try {
          return await apiRequestWithUrl(`/vaos/v2/referrals`);
        } catch (error) {
          captureError(error, false, 'fetch all referrals');
          return {
            error: { status: error.status || 500, message: error.message },
          };
        }
      },
      // Needs an argumant to be passed in to trigger the query.
      async onQueryStarted(id, { dispatch }) {
        dispatch(fetchPendingAppointments());
      },
    }),
    postDraftReferralAppointment: builder.mutation({
      async queryFn(referralNumber) {
        try {
          return await apiRequestWithUrl(`/vaos/v2/appointments/draft`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // eslint-disable-next-line camelcase
            body: JSON.stringify({ referral_id: referralNumber }),
          });
        } catch (error) {
          captureError(error, false, 'post draft referral appointment');
          return {
            error: { status: error.status || 500, message: error.message },
          };
        }
      },
      // async onQueryStarted(id, { dispatch }) {
      //   dispatch(fetchFutureAppointments({ includeRequests: false }));
      // },
    }),
  }),
});

export const {
  useGetReferralByIdQuery,
  useGetPatientReferralsQuery,
  usePostDraftReferralAppointmentMutation,
} = vaosApi;

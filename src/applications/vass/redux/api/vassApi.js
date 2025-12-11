import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { createApi } from '@reduxjs/toolkit/query/react';

const api = async (url, options, ...rest) => {
  return apiRequest(`${environment.API_URL}${url}`, options, ...rest);
};

export const vassApi = createApi({
  reducerPath: 'vassApi',
  baseQuery: () => ({ data: null }),
  keepUnusedDataFor: environment.isUnitTest() ? 0 : 60,
  endpoints: builder => ({
    postAuthentication: builder.mutation({
      async queryFn({ uuid, lastname, dob }) {
        try {
          return await api('/vass/v0/authenticate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uuid,
              lastname,
              dob,
            }),
          });
        } catch (error) {
          // captureError(error, false, 'post referral appointment');
          // TODO: do something with error
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
    postOTCVerification: builder.mutation({
      async queryFn({ otc, uuid, lastname, dob }) {
        try {
          return await api('/vass/v0/authenticate-otc', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              otc,
              uuid,
              lastname,
              dob,
            }),
          });
        } catch (error) {
          // captureError(error, false, 'post referral appointment');
          // TODO: do something with error
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
    postAppointment: builder.mutation({
      async queryFn({ topics, dtStartUtc, dtEndUtc }) {
        try {
          return await api('/vass/v0/appointment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // TODO: confirm token storage location, maybe redux?
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              topics,
              dtStartUtc,
              dtEndUtc,
            }),
          });
        } catch (error) {
          // captureError(error, false, 'post appointment');
          // TODO: do something with error
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
    getAppointment: builder.query({
      async queryFn({ appointmentId }) {
        try {
          return await api(`/vass/v0/appointment/${appointmentId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // TODO: confirm token storage location, maybe redux?
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        } catch (error) {
          // captureError(error, false, 'get appointment');
          // TODO: do something with error
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
  }),
});

export const {
  usePostAuthenticationMutation,
  usePostOTCVerificationMutation,
  usePostAppointmentMutation,
  useGetAppointmentQuery,
} = vassApi;

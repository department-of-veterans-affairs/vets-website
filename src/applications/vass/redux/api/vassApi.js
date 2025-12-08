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
      async queryFn({ otc, otcCode }) {
        try {
          return await api('/vass/v0/TODO_GET_OTC_ENDPOINT', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              otc,
              otcCode,
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
  }),
});

export const {
  usePostAuthenticationMutation,
  usePostOTCVerificationMutation,
} = vassApi;

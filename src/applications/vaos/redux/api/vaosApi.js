import { createApi } from '@reduxjs/toolkit/query/react';
import { apiRequestWithUrl } from 'applications/vaos/services/utils';
import { captureError } from '../../utils/error';

export const vaosApi = createApi({
  reducerPath: 'appointmentApi',
  // When not using the built in fetch functionality, you have to return an
  // object with a data key as null to the baseQuery. Here we are using a util
  // function (apiRequestWithUrl) to make API call.
  baseQuery: () => ({ data: null }),
  endpoints: builder => ({
    getReferralById: builder.query({
      async queryFn(referralId) {
        try {
          return await apiRequestWithUrl(
            `/vaos/v2/epsApi/referrals/${referralId}`,
          );
        } catch (error) {
          captureError(error);
          return {
            error: { status: error.status || 500, message: error.message },
          };
        }
      },
    }),
  }),
});

export const { useGetReferralByIdQuery } = vaosApi;

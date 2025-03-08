import { createApi } from '@reduxjs/toolkit/query/react';
import { apiRequestWithUrl } from 'applications/vaos/services/utils';

export const vaosApi = createApi({
  reducerPath: 'appointmentApi',
  baseQuery: () => ({ data: null }),
  endpoints: builder => ({
    getReferralById: builder.query({
      async queryFn(referralId) {
        try {
          return await apiRequestWithUrl(
            `/vaos/v2/epsApi/referrals/${referralId}`,
            {
              method: 'GET',
            },
          );
        } catch (error) {
          return {
            error: { status: error.status || 500, message: error.message },
          };
        }
      },
    }),
  }),
});

export const { useGetReferralByIdQuery } = vaosApi;

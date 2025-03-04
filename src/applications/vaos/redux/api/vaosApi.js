import { createApi } from '@reduxjs/toolkit/query/react';
import { apiRequestWithUrl } from 'applications/vaos/services/utils';

export const vaosApi = createApi({
  reducerPath: 'api',
  baseQuery: () => ({ data: null }),
  endpoints: builder => ({
    getReferralById: builder.query({
      async queryFn(referralId) {
        try {
          const response = await apiRequestWithUrl(
            `/vaos/v2/epsApi/referrals/${referralId}`,
            {
              method: 'GET',
            },
          );

          return JSON.parse(response.body);
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

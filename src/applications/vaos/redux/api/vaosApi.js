import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';

export const vaosApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${environment.API_URL}` }),
  endpoints: builder => ({
    getReferralById: builder.query({
      query: referralId => `/vaos/v2/epsApi/referrals/${referralId}`,
    }),
  }),
});

export const { useGetReferralByIdQuery } = vaosApi;

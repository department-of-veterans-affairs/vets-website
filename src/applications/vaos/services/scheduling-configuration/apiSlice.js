import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { apiRequestWithUrl } from '../utils';

// NOTE: Don't forget to add middleware to 'router', 'vaos-entry.jsx' and 'setup.js'
export const slice = createApi({
  reducerPath: 'schedulingRTK',
  // Cache is normally 60 seconds by default, but it causes each test
  // to take an additional 60 seconds to run, so we set it to 0.
  keepUnusedDataFor: environment.isUnitTest() ? 0 : 60,
  // tagTypes: ['Appointments'],
  // The base query used by each endpoint if no queryFn option is specified.
  baseQuery: async (url, _api, _extraOptions) => {
    try {
      // NOTE: Return object must have this shape! {data, meta}
      // It is expected to return an object with either a data or error property,
      // or a promise that resolves to return such an object.
      // console.log(url)
      // if (process.env.LOG_LEVEL === 'debug')
      //   console.log(
      //     `API Call: ${
      //       environment.API_URL
      //     }/vaos/v2/scheduling/configurations${url}`,
      //   );
      const response = await apiRequestWithUrl(
        `/vaos/v2/scheduling/configurations${url}`,
      );

      return { data: response.data, meta: response.meta };
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.LOG_LEVEL === 'debug') console.log('Error:', error);
      // NOTE: Return object must have this shape! {error, meta}
      return { error };
    }
  },
  endpoints: builder => ({
    getSchedulingConfigurations: builder.query({
      query: ({ facilityIds=[], isCCEnabled = false } = {}) => {
        return `?${facilityIds
          .map(id => `facility_ids[]=${id}`)
          .join('&')}&cc_enabled=${isCCEnabled}`;
      },
      transformResponse: (response, _meta, _arg) => {
        return response;
      },
    }),
  }),
});

export const { useGetSchedulingConfigurationsQuery } = slice;
export default slice;

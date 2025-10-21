import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import appendQuery from 'append-query';
import { apiRequestWithUrl } from '../utils';

// NOTE: Don't forget to add middleware to 'router', 'vaos-entry.jsx' and 'setup.js'
export const slice = createApi({
  reducerPath: 'locationsRTK',
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
      //     `API Call: ${environment.API_URL}/vaos/v2/appointments${url}`,
      //   );
      const response = await apiRequestWithUrl(`/vaos/v2/locations${url}`);

      return { data: response.data, meta: response.meta };
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.LOG_LEVEL === 'debug') console.log('Error:', error);
      // NOTE: Return object must have this shape! {error, meta}
      return { error };
    }
  },
  endpoints: builder => ({
    getSlots: builder.query({
      query: ({
        clinicId,
        end,
        facilityId,
        provider,
        start,
        typeOfCare,
      } = {}) => {
        const queryParams = [];
        if (typeOfCare) queryParams.push(`clinical_service=${typeOfCare}`);
        if (provider) queryParams.push(`provider=${provider}`);

        let baseUrl = `/${facilityId}`;
        if (clinicId) baseUrl = `${baseUrl}/clinics/${clinicId.split('_')[1]}`;

        baseUrl = `${baseUrl}/slots?start=${encodeURIComponent(
          start,
        )}&end=${encodeURIComponent(end)}${queryParams.join('&')}`;

        return baseUrl;
      },
      transformResponse: (response, _meta, _arg) => {
        return response;
      },
    }),
    getHealthcareServices: builder.query({
      query: ({ id, locationId = null, typeOfCare = null } = {}) => {
        let url = `/${locationId}/clinics`;
        url = appendQuery(
          url,
          {
            // eslint-disable-next-line camelcase
            clinic_ids: id ? [id] : null,
            // eslint-disable-next-line camelcase
            clinical_service: typeOfCare,
          },
          { removeNull: true },
        );
        console.log('Query string:', url);
        return url;
      },
      transformResponse: (response, _meta, _arg) => {
        // return transformClinicsV2(results)[0];

        return response;
      },
    }),
  }),
});

export const { useGetHealthcareServicesQuery } = slice;
export default slice;

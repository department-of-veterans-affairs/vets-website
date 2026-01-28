/* eslint-disable no-console */
// NOTE: Using the react specific version for hooks functionality
import { createApi } from '@reduxjs/toolkit/query/react';
// NOTE: This is the core RTK functionality which is framework agnostic
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
// NOTE: This map utiltiy allows for plucking out attributes.
// import appendQuery from 'append-query';
import { getTestFacilityId } from '../../utils/appointment';
import { apiRequestWithUrl } from '../utils';
import { transformFacility, transformLocationSettings } from './transformersV2';

export const FUTURE_APPOINTMENTS_HIDDEN_SET = new Set(['NO-SHOW', 'DELETED']);
const acheronHeader = {
  headers: { ACHERON_REQUESTS: 'true' },
};

// NOTE: Don't forget to add middleware to 'router', 'vaos-entry.jsx' and 'setup.js'
const slice = createApi({
  reducerPath: 'healthcareRTK',
  // Cache is normally 60 seconds by default, but it causes each test
  // to take an additional 60 seconds to run, so we set it to 0.
  keepUnusedDataFor: environment.isUnitTest() ? 0 : 60,
  tagTypes: ['Healthcare'],
  // The base query used by each endpoint if no queryFn option is specified.
  baseQuery: async (
    url,
    _api,
    extraOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...acheronHeader.headers,
      },
    },
  ) => {
    try {
      // NOTE: Return object must have this shape! {data, meta}. You will get an
      // error and it ignore unknown attributes. It is expected to return an
      // object with either a data or error property, or a promise that resolves
      // to return such an object.
      // console.log(url)
      // if (process.env.LOG_LEVEL === 'debug')
      //   console.log(
      //     `API Call: ${environment.API_URL}/vaos/v2/appointments${url}`,
      //   );
      const response = await apiRequestWithUrl(`/vaos/v2${url}`, {
        method: extraOptions.method,
        headers: {
          'Content-Type': 'application/json',
          ...acheronHeader.headers,
        },
        body: JSON.stringify(extraOptions?.body),
      });

      return {
        data: response.data,
        meta: response.meta,
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.LOG_LEVEL === 'debug') console.log('Error:', error);
      // NOTE: Return object must have this shape! {error, meta}
      return { error };
    }
  },
  endpoints: builder => ({
    getClinics: builder.query({
      query: ({ locationId = '983', _clinicIds, _typeOfCareId } = {}) => {
        return `/locations/${locationId}/clinics`;
        // return appendQuery(
        //   url,
        // eslint-disable-next-line camelcase
        // { clinic_ids: clinicIds, clinical_service: typeOfCareId },
        //   { removeNull: true },
        // );
      },
    }),

    getFacilities: builder.query({
      // async queryFn(args, queryApi, _extraOptions, fetchWithBQ) {
      //   const { children = false } = args || {};
      //   console.log(args, queryApi, _extraOptions, 'fetchWithBQ', fetchWithBQ);
      //   const state = queryApi.getState();
      //   console.log('state', state);
      //   const ids = selectSystemIds(state);

      //   const baseUrl = `?children=${children}&${ids
      //     .map(id => `ids[]=${getTestFacilityId(id)}`)
      //     .join('&')}`;
      //   console.log(baseUrl);
      //   return baseUrl;
      // },
      query: ({
        ids,
        children = false,
        sortByRecentLocations = false,
      } = {}) => {
        const queryParams = `/facilities?children=${children}&${ids
          .map(id => `ids[]=${getTestFacilityId(id)}`)
          .join('&')}`;

        return sortByRecentLocations
          ? `${queryParams}&sort_by=recentLocationss`
          : queryParams;
      },
      // async onQueryStarted(body, { _dispatch, getState, queryFulfilled }) {
      //   console.log('query started', queryFulfilled);
      //   const { data: foo } = await queryFulfilled;
      //   const state = getState();
      //   const featureRecentLocationsFilter = selectFeatureRecentLocationsFilter(
      //     state,
      //   );
      //   if (featureRecentLocationsFilter) {
      //     // console.log()
      //   } else {
      //     // console.log()
      //   }
      // },
      transformResponse: transformFacility,
    }),

    getLocationSettings: builder.query({
      query: ({ ids, ccEnabledParam }) => {
        return `/scheduling/configurations?${ids
          .map(id => `facility_ids[]=${id}`)
          .join('&')}${ccEnabledParam}`;
      },
      transformResponse: transformLocationSettings,
    }),
  }),
});

export const {
  useGetClinicsQuery,
  useGetFacilitiesQuery,
  useGetLocationSettingsQuery,
} = slice;

export default slice;

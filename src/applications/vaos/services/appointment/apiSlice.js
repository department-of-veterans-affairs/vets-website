/* eslint-disable no-console */
// NOTE: Using the react specific version for hooks functionality
import { createApi } from '@reduxjs/toolkit/query/react';
// NOTE: This is the core RTK functionality which is framework agnostic
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { addDays, format, isAfter, isBefore, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
// NOTE: This map utiltiy allows for plucking out attributes.
import { apiRequestWithUrl } from '../utils';
import { transformVAOSAppointment } from './transformers';
import transformResponses from './transformResponse';

export const FUTURE_APPOINTMENTS_HIDDEN_SET = new Set(['NO-SHOW', 'DELETED']);
const acheronHeader = {
  headers: { ACHERON_REQUESTS: 'true' },
};

// NOTE: Don't forget to add middleware to 'router', 'vaos-entry.jsx' and 'setup.js'
const slice = createApi({
  reducerPath: 'appointmentsRTK',
  // Cache is normally 60 seconds by default, but it causes each test
  // to take an additional 60 seconds to run, so we set it to 0.
  keepUnusedDataFor: environment.isUnitTest() ? 0 : 60,
  tagTypes: ['Appointment'],
  // The base query used by each endpoint if no queryFn option is specified.
  baseQuery: async (
    args,
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
      // console.log(args)
      // if (process.env.LOG_LEVEL === 'debug')
      //   console.log(
      //     `API Call: ${environment.API_URL}/vaos/v2/appointments${args}`,
      //   );
      const url = typeof args === 'string' ? args : args?.url;
      const response = await apiRequestWithUrl(`/vaos/v2/appointments${url}`, {
        method: extraOptions.method,
        headers: {
          'X-BaseQuery': true,
          'Content-Type': 'application/json',
          ...acheronHeader.headers,
        },
        body: JSON.stringify(args?.body),
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
    cancelAppointment: builder.mutation({
      query: id => `/${id}`,
      extraOptions: {
        method: 'PUT',
        body: { status: 'cancelled' },
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Appointment', id },
      ],
    }),
    createAppointment: builder.mutation({
      query(body) {
        return {
          url: '',
          method: 'POST',
          body,
        };
      },
      extraOptions: {
        method: 'POST',
      },
      invalidatesTags: (_result, _error) => [
        { type: 'Appointment', id: 'LIST' },
      ],
      onCacheEntryAdded(args) {
        console.log('args', args);
      },
    }),
    getAppointment: builder.query({
      // NOTE: You must specify either a query field (which will use the API's
      // baseQuery to make a request), or a queryFn function with your own async logic.
      query: ({ id, includes = ['facilities', 'clinics'] } = {}) =>
        `/${id}?_include=${includes}`,
      // providesTags: ['Appointment'],
      providesTags: (_result, _error, id) => [{ type: 'Appointment', id }],
      transformResponse: (response, _meta, _arg) => {
        console.log('transform response', response);
        return transformVAOSAppointment(response.attributes);
      },
    }),
    getAppointments: builder.query({
      query: ({
        startDate = subDays(new Date(), 30),
        endDate = addDays(new Date(), 395),
        statuses = ['booked', 'arrived', 'fulfilled', 'cancelled'],
        avs = false,
        fetchClaimStatus = false,
        includeEPS = false,
      } = {}) => {
        const includeParams = ['facilities', 'clinics'];
        if (avs) {
          includeParams.push('avs');
        }
        if (fetchClaimStatus) {
          includeParams.push('travel_pay_claims');
        }
        if (includeEPS) {
          includeParams.push('eps');
        }
        return `?_include=${includeParams.map(String).join(',')}&start=${format(
          startDate,
          'yyyy-MM-dd',
        )}&end=${format(endDate, 'yyy-MM-dd')}&${statuses
          .map(status => `statuses[]=${status}`)
          .join('&')}`;
      },
      providesTags: result =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: 'Appointment', id })),
              // The `LIST` id is a made up "virtual id" used to invalidate
              // this query specifically if a new `Appointment` element is added.
              { type: 'Appointment', id: 'LIST' },
            ]
          : // An error occurred, but we still want to refetch this query when `{ type: 'Appointment', id: 'LIST' }` is invalidated
            [{ type: 'Appointment', id: 'LIST' }],
      transformResponse: transformResponses,
      async onQueryStarted(body, { _dispatch, queryFulfilled }) {
        console.log('query started', queryFulfilled);
        //   const { data } = await queryFulfilled;
        //   console.log('data', data);
        //   const locations = map(data, 'attributes.location')
        //     .filter(Boolean)
        //     .filter(value => value !== 'Error fetching facility details')
        //     // Remove duplicates
        //     .filter((obj, index, self) => {
        //       return index === self.findIndex(o => o.id === obj.id);
        //     });
        //   console.log('locations', locations);

        //   const results = dispatch(
        //     locationSlice?.util.upsertQueryData(
        //       'getFacilities',
        //       undefined,
        //       locations.map(location => ({
        //         id: location.id,
        //         type: 'location',
        //         attributes: { ...location.attributes },
        //       })),
        //     ),
        //   );
        //   try {
        //     await queryFulfilled;
        //     console.log('results', await results);
        //   } catch (e) {
        //     console.log('Error:', e);
        //   }
      },
    }),
    getAppointmentRequest: builder.query({
      // NOTE: You must specify either a query field (which will use the API's
      // baseQuery to make a request), or a queryFn function with your own async logic.
      query: id => `/${id}?_include=facilities,clinics`,
      transformResponse: (response, _meta, _arg) => {
        return response;
      },
      // NOTE: This is a normalize version.
      // transformResponse: (response, meta, arg) => {
      //   console.log('response', response.data);
      //   const normalizedData = normalize({
      //     data: [
      //       {
      //         id: response.data.id,
      //         type: 'appointment',
      //         attributes: { ...response.data },
      //       },
      //     ],
      //   });
      //   console.log('normalized response', normalizedData);
      //   return adapter.upsertMany(
      //     adapter.getInitialState(),
      //     normalizedData.appointment,
      //   );
      // },
    }),
    getAppointmentRequests: builder.query({
      query: ({
        startDate = subDays(new Date(), 120),
        endDate = addDays(new Date(), 2),
        statuses = ['proposed', 'cancelled'],
        avs = false,
        fetchClaimStatus = false,
        includeEPS = false,
      } = {}) => {
        const includeParams = ['facilities', 'clinics'];
        if (avs) {
          includeParams.push('avs');
        }
        if (fetchClaimStatus) {
          includeParams.push('travel_pay_claims');
        }
        if (includeEPS) {
          includeParams.push('eps');
        }

        return `?_include=${includeParams.map(String).join(',')}&start=${format(
          startDate,
          'yyyy-MM-dd',
        )}&end=${format(endDate, 'yyy-MM-dd')}&${statuses
          .map(status => `statuses[]=${status}`)
          .join('&')}`;
      },
      transformResponse: transformResponses,
    }),
  }),
});

// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters. To generate a selector
// for a specific query argument, call `select(theQueryArg)`.
// export const selectAppointment = (state, id) => {
//   // A function that accepts a cache key argument, and generates a new memoized
//   // selector for reading cached data for this endpoint using the given cache
//   // key. The generated selector is memoized using Reselect's createSelector.
//   const f = slice.endpoints.getAppointment.select({ id });
//   const appointment = f(state, JSON.stringify({ id }));

//   if (appointment.data)
//     return transformVAOSAppointment(appointment.data.attributes);
//   return null;
// };

// export const selectAppointments = createSelector(
//   state => {
//     const f = slice.endpoints.getAppointments.select();
//     return f(state);
//   },
//   appointments => {
//     if (appointments.data) {
//       // Pluck the 'attributes' data
//       const a = map(appointments.data.flat(), 'attributes').filter(
//         appointment => {
//           // NOTE: Shouldn't need this check since it's implied that upcoming
//           // appointment are of type VA or CC.
//           if (
//             appointment.future &&
//             (appointment.type === 'COMMUNITY_CARE_APPOINTMENT' ||
//               appointment.type === 'VA')
//           ) {
//             return !FUTURE_APPOINTMENTS_HIDDEN_SET.has(appointment.description);
//           }
//           return false;
//         },
//       );
//       return transformVAOSAppointments(a);
//     }
//     return [];
//   },
// );

// export const selectAppointmentRequest = (state, id) => {
//   // A function that accepts a cache key argument, and generates a new memoized
//   // selector for reading cached data for this endpoint using the given cache
//   // key. The generated selector is memoized using Reselect's createSelector.
//   const f = slice.endpoints.getAppointmentRequest.select(id);
//   const appointment = f(state, id);

//   if (appointment.data)
//     return transformVAOSAppointment(appointment.data.attributes);
//   return null;
// };

export function groupAppointmentsByMonth(appointments) {
  if (!appointments || appointments.length === 0) {
    return {};
  }

  return appointments.reduce((previous, current) => {
    const key = formatInTimeZone(current.start, current.timezone, 'yyyy-MM');
    // eslint-disable-next-line no-param-reassign
    previous[key] = previous[key] || [];
    previous[key].push(current);
    return previous;
  }, {});
}

export function sortByDateAscending(a, b) {
  return isBefore(a?.start, b?.start) ? -1 : 1;
}

/**
 * Sort method for past appointments
 * @param {Appointment} a A FHIR appointment resource
 * @param {Appointment} b A FHIR appointment resource
 */
export function sortByDateDescending(a, b) {
  return isAfter(a.start, b.start) ? -1 : 1;
}

export const {
  useCancelAppointmentMutation,
  useCreateAppointmentMutation,
  useGetAppointmentQuery,
  useGetAppointmentRequestQuery,
  useGetAppointmentRequestsQuery,
  useGetAppointmentsQuery,
} = slice;

export default slice;

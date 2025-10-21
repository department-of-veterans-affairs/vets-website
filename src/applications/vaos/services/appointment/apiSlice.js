/* eslint-disable no-console */
import { createSelector } from '@reduxjs/toolkit';
// NOTE: Using the react specific version for hooks functionality
import { createApi } from '@reduxjs/toolkit/query/react';
// NOTE: This is the core RTK functionality which is framework agnostic
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { addDays, format, isBefore, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
// NOTE: This map utiltiy allows for plucking out attributes.
import { map } from 'lodash';
import { selectCernerFacilityIds } from 'platform/site-wide/drupal-static-data/source-files/vamc-ehr/selectors';
import { getVAAppointmentLocationId } from '.';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import locationSlice from '../location/apiSlice';
import { apiRequestWithUrl } from '../utils';
import {
  transformVAOSAppointment,
  transformVAOSAppointments,
} from './transformers';

export const FUTURE_APPOINTMENTS_HIDDEN_SET = new Set(['NO-SHOW', 'DELETED']);

// NOTE: Don't forget to add middleware to 'router', 'vaos-entry.jsx' and 'setup.js'
const slice = createApi({
  reducerPath: 'appointmentsRTK',
  // Cache is normally 60 seconds by default, but it causes each test
  // to take an additional 60 seconds to run, so we set it to 0.
  keepUnusedDataFor: environment.isUnitTest() ? 0 : 60,
  // tagTypes: ['Appointments'],
  // The base query used by each endpoint if no queryFn option is specified.
  baseQuery: async (url, _api, _extraOptions) => {
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
      const response = await apiRequestWithUrl(`/vaos/v2/appointments${url}`);
      console.log('response', response);

      return {
        data: response.data,
        // included: response.included,
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
    getAppointment: builder.query({
      // NOTE: You must specify either a query field (which will use the API's
      // baseQuery to make a request), or a queryFn function with your own async logic.
      query: ({ id, includes = ['facilities', 'clinics'] } = {}) =>
        `/${id}?_include=${includes}`,
      // providesTags: ['Appointments'],
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
      // transformResponse,
      transformResponse: (response, _meta, _arg) => {
        if (response) {
          // Pluck the 'attributes' data
          const a = map(response, 'attributes').filter(appointment => {
            // NOTE: Shouldn't need this check since it's implied that upcoming
            // appointment are of type VA or CC.
            if (
              appointment.future &&
              (appointment.type === 'COMMUNITY_CARE_APPOINTMENT' ||
                appointment.type === 'VA')
            ) {
              return !FUTURE_APPOINTMENTS_HIDDEN_SET.has(
                appointment.description,
              );
            }
            return false;
          });
          return transformVAOSAppointments(a);
        }

        return [];
      },
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        console.log('query started', queryFulfilled);
        const { data } = await queryFulfilled;
        console.log('data', data);
        const locations = map(data, 'attributes.location')
          .filter(Boolean)
          .filter(value => value !== 'Error fetching facility details')
          // Remove duplicates
          .filter((obj, index, self) => {
            return index === self.findIndex(o => o.id === obj.id);
          });
        console.log('locations', locations);

        const results = dispatch(
          locationSlice?.util.upsertQueryData(
            'getFacilities',
            undefined,
            locations.map(location => ({
              id: location.id,
              type: 'location',
              attributes: { ...location.attributes },
            })),
          ),
        );
        try {
          await queryFulfilled;
          console.log('results', await results);
        } catch (e) {
          console.log('Error:', e);
        }
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
      transformResponse: (response, _meta, _arg) => {
        return response;
      },
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

export const selectAppointmentRequest = (state, id) => {
  // A function that accepts a cache key argument, and generates a new memoized
  // selector for reading cached data for this endpoint using the given cache
  // key. The generated selector is memoized using Reselect's createSelector.
  const f = slice.endpoints.getAppointmentRequest.select(id);
  const appointment = f(state, id);

  if (appointment.data)
    return transformVAOSAppointment(appointment.data.attributes);
  return null;
};

export const selectAppointmentRequests = createSelector(
  state => {
    const f = slice.endpoints.getAppointmentRequests.select();
    return f(state);
  },
  appointments => {
    if (appointments.data) {
      const a = map(appointments.data.flat(), 'attributes');
      return transformVAOSAppointments(a);
    }
    return [];
  },
);

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

export const selectAppointmentsGroupByMonth = createSelector(
  // state => selectAppointments(state),
  state => {
    const f = slice.endpoints.getAppointments.select();
    return f(state);
  },
  appointments => {
    if (appointments?.data) {
      return [...appointments.data] // NOTE: Needed since appointments.data array is immutable. Will get error
        .sort(sortByDateAscending)
        .reduce((previous, current) => {
          const key = formatInTimeZone(
            current.start,
            current.timezone,
            'yyyy-MM',
          );
          // eslint-disable-next-line no-param-reassign
          previous[key] = previous[key] || [];
          previous[key].push(current);
          return previous;
        }, {});
    }
    return [];
  },
);

export const selectCancelInfo = createSelector(
  state => state.appointments,
  state => selectCernerFacilityIds(state),
  (appointments, cernerFacilityIds) => {
    const {
      appointmentToCancel,
      cancelAppointmentStatus,
      cancelAppointmentStatusVaos400,
      facilityData,
      showCancelModal,
    } = appointments;

    let facility = null;
    if (appointmentToCancel?.status === APPOINTMENT_STATUS.booked) {
      // Confirmed in person VA and video appts
      const locationId = getVAAppointmentLocationId(appointmentToCancel);
      facility = facilityData[locationId];
    } else if (appointmentToCancel?.facility) {
      // Requests
      facility = facilityData[appointmentToCancel.facility.facilityCode];
    }
    let isCerner = null;
    if (appointmentToCancel) {
      isCerner = cernerFacilityIds?.some(
        cernerSite =>
          appointmentToCancel.location.vistaId?.startsWith(cernerSite.vhaId),
        // appointmentToCancel.location.vistaId?.startsWith(cernerSite.facilityId),
      );
    }
    return {
      facility,
      appointmentToCancel,
      showCancelModal,
      cancelAppointmentStatus,
      cancelAppointmentStatusVaos400,
      isCerner,
    };
  },
);

export const {
  useGetAppointmentQuery,
  useGetAppointmentsQuery,
  useGetAppointmentRequestQuery,
  useGetAppointmentRequestsQuery,
} = slice;

export default slice;

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { map } from 'lodash';
import { getTestFacilityId } from '../../utils/appointment';
import { apiRequestWithUrl } from '../utils';
import { transformFacilitiesV2, transformFacilityV2 } from './transformers';

export const adapter = createEntityAdapter({});
// const initialState = adapter.getInitialState();

// NOTE: Don't forget to add middleware to 'router', 'vaos-entry.jsx' and 'setup.js'
const slice = createApi({
  reducerPath: 'facilitiesRTK',
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
      const response = await apiRequestWithUrl(`/vaos/v2/facilities${url}`);
      // console.log(response);

      return { data: response.data, meta: response.meta };
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.LOG_LEVEL === 'debug') console.log('Error:', error);
      // NOTE: Return object must have this shape! {error, meta}
      return { error };
    }
  },
  endpoints: builder => ({
    getFacility: builder.query({
      // NOTE: You must specify either a query field (which will use the API's
      // baseQuery to make a request), or a queryFn function with your own async logic.
      query: ({ id, includes = ['facilities', 'clinics'] } = {}) =>
        `/${id}?_include=${includes}`,
      // providesTags: ['Appointments'],
      transformResponse: (response, _meta, _arg) => {
        return transformFacilityV2(response.attributes);
      },
    }),
    getFacilities: builder.query({
      // NOTE: You must specify either a query field (which will use the API's
      // baseQuery to make a request), or a queryFn function with your own async logic.
      query: ({
        ids,
        children = false,
        sortByRecentLocations = false,
      } = {}) => {
        const baseUrl = `?children=${children}&${ids
          .map(id => `ids[]=${getTestFacilityId(id)}`)
          .join('&')}`;

        return sortByRecentLocations
          ? `${baseUrl}&sort_by=recentLocations`
          : baseUrl;
      },
      // providesTags: ['Appointments'],
      transformResponse: (response, _meta, _arg) => {
        const data = map(response, 'attributes');
        return transformFacilitiesV2(data);

        // return response;
      },
    }),
    async onQueryStarted({ postId, reaction }, lifecycleApi) {
      console.log('onQueryStarted');
    },
  }),
});

// startAppListening({
//   matcher: isMatch,
//   // actionCreator: addNewPost.fulfilled,
//   effect: async (action, listenerApi) => {
//     console.log('yea!!!!!!');
//     console.log(action);
//     console.log(listenerApi);
//     // console.log(listenerApi.getState());
//     // console.log('slice', slice);
//     const { location } = action.payload;
//     // const normalizedData = normalize(location);
//     console.log(
//       '!!!!!',
//       adapter.upsertMany(adapter.getInitialState(), location),
//     );
//     console.log(listenerApi.getState().facilitiesRTK);

//     // const { toast } = await import('react-tiny-toast')

//     // const toastId = toast.show('New post added!', {
//     //   variant: 'success',
//     //   position: 'bottom-right',
//     //   pause: true
//     // })

//     // await listenerApi.delay(5000)
//     // toast.remove(toastId)
//   },
// });

export const selectFacility = createSelector(
  (state, id) => {
    // console.log(state.facilitiesRTK);
    const f = slice.endpoints.getFacilities.select();
    return f(state);
  },
  facilities => {
    // console.log('facilities', facilities);
    const data = map(facilities.data.flat(), 'attributes');
    const f = data.filter(d => d.id === id);
    console.log('fac', f);
    // return transformFacilitiesV2(data);
    return f;
  },
);

export const selectFacilities = createSelector(
  state => {
    // console.log(state.facilitiesRTK);
    const f = slice.endpoints.getFacilities.select();
    return f(state);
  },
  facilities => {
    // console.log('facilities', facilities);
    const data = map(facilities.data.flat(), 'attributes');
    console.log(transformFacilitiesV2(data));
    return transformFacilitiesV2(data);
    // return facilities;
  },
);

export const { useGetFacilityQuery, useGetFacilitiesQuery } = slice;
export default slice;

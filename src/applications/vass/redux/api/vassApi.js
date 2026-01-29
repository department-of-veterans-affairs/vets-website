import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { createApi } from '@reduxjs/toolkit/query/react';
import { setObfuscatedEmail, setLowAuthFormData } from '../slices/formSlice';
import { setVassToken, getVassToken } from '../../utils/auth';

const api = async (url, options, ...rest) => {
  return apiRequest(`${environment.API_URL}${url}`, options, ...rest);
};

// TODO if token is not found reject the requets
export const vassApi = createApi({
  reducerPath: 'vassApi',
  baseQuery: () => ({ data: null }),
  keepUnusedDataFor: environment.isUnitTest() ? 0 : 60,
  endpoints: builder => ({
    postAuthentication: builder.mutation({
      async queryFn({ uuid, lastname, dob }, { dispatch }) {
        try {
          const response = await api('/vass/v0/authenticate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uuid,
              lastname,
              dob,
            }),
          });
          if (response.data?.email) {
            dispatch(setLowAuthFormData({ uuid, lastname, dob }));
            dispatch(setObfuscatedEmail(response.data.email));
          }
          return response;
        } catch (error) {
          // captureError(error, false, 'post referral appointment');
          // TODO: do something with error
          return {
            error: error.errors[0],
          };
        }
      },
    }),
    postOTCVerification: builder.mutation({
      async queryFn({ otc }, { getState }) {
        const { uuid, lastname, dob } = getState().vassForm;
        try {
          return await api('/vass/v0/authenticate-otc', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              otc,
              uuid,
              lastname,
              dob,
            }),
          });
        } catch (error) {
          // captureError(error, false, 'post referral appointment');
          // TODO: do something with error
          return {
            error: error.errors[0],
          };
        }
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.token) {
            setVassToken(data.token);
          }
        } catch {
          // Error is handled by the queryFn
        }
      },
    }),
    postAppointment: builder.mutation({
      async queryFn({ topics, dtStartUtc, dtEndUtc }) {
        try {
          const token = getVassToken();
          return await api('/vass/v0/appointment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              topics,
              dtStartUtc,
              dtEndUtc,
            }),
          });
        } catch (error) {
          // captureError(error, false, 'post appointment');
          // TODO: do something with error
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
    getAppointment: builder.query({
      async queryFn({ appointmentId }) {
        try {
          const token = getVassToken();
          return await api(`/vass/v0/appointment/${appointmentId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          // captureError(error, false, 'get appointment');
          // TODO: do something with error
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
    getTopics: builder.query({
      async queryFn() {
        try {
          const token = getVassToken();
          return await api('/vass/v0/topics', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          // captureError(error, false, 'get topics');
          // TODO: do something with error
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
    getAppointmentAvailability: builder.query({
      async queryFn() {
        try {
          const token = getVassToken();
          return await api('/vass/v0/appointment-availablity', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          // captureError(error, false, 'get appointment availability');
          // TODO: do something with error
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
    getUserAppointment: builder.query({
      async queryFn() {
        try {
          const token = getVassToken();
          return await api('/vass/v0/user/appointment', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          // captureError(error, false, 'get user appointment');
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
    cancelAppointment: builder.mutation({
      async queryFn({ appointmentId }) {
        try {
          const token = getVassToken();
          return await api(`/vass/v0/appointment/${appointmentId}/cancel`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          // captureError(error, false, 'cancel appointment');
          // TODO: do something with error
          return {
            error: { status: error.status || 500, message: error?.message },
          };
        }
      },
    }),
  }),
});

export const {
  usePostAuthenticationMutation,
  usePostOTCVerificationMutation,
  usePostAppointmentMutation,
  useGetAppointmentQuery,
  useGetTopicsQuery,
  useGetAppointmentAvailabilityQuery,
  useGetUserAppointmentQuery,
  useLazyGetUserAppointmentQuery,
  useCancelAppointmentMutation,
} = vassApi;

import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { createApi } from '@reduxjs/toolkit/query/react';
import { setObfuscatedEmail, setLowAuthFormData } from '../slices/formSlice';
import { setVassToken, getVassToken } from '../../utils/auth';
import { createInvalidTokenError } from '../../services/mocks/utils/errors';

const api = async (url, options, ...rest) => {
  return apiRequest(`${environment.API_URL}${url}`, options, ...rest);
};

/**
 * Gets the VASS token from the cookie and returns it if it exists.
 * @returns {Object} An object with the token and error if it exists.
 */
const getTokenOrError = () => {
  const token = getVassToken();
  if (!token) {
    return {
      token: null,
      error: createInvalidTokenError().errors[0],
    };
  }
  return { token, error: null };
};

export const vassApi = createApi({
  reducerPath: 'vassApi',
  baseQuery: () => ({ data: null }),
  keepUnusedDataFor: environment.isUnitTest() ? 0 : 60,
  endpoints: builder => ({
    postAuthentication: builder.mutation({
      async queryFn({ uuid, lastName, dob }, { dispatch }) {
        try {
          const response = await api('/vass/v0/request-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uuid,
              lastName,
              dob,
            }),
          });
          dispatch(setLowAuthFormData({ uuid, lastName, dob }));
          dispatch(setObfuscatedEmail(response.data.email));
          return response;
        } catch ({ errors }) {
          return {
            error: {
              code: errors?.[0]?.code,
              detail: errors?.[0]?.detail,
            },
          };
        }
      },
    }),
    postOTPVerification: builder.mutation({
      async queryFn({ otp }, { getState }) {
        const { uuid, lastName, dob } = getState().vassForm;
        try {
          return await api('/vass/v0/authenticate-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              otp,
              uuid,
              lastName,
              dob,
            }),
          });
        } catch ({ errors }) {
          return {
            error: errors?.[0],
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
        const { token, error: tokenError } = getTokenOrError();
        if (tokenError) {
          return { error: tokenError };
        }
        try {
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
        } catch ({ errors }) {
          return {
            error: {
              code: errors?.[0]?.code,
              detail: errors?.[0]?.detail,
            },
          };
        }
      },
    }),
    getAppointment: builder.query({
      async queryFn({ appointmentId }) {
        const { token, error: tokenError } = getTokenOrError();
        if (tokenError) {
          return { error: tokenError };
        }
        try {
          return await api(`/vass/v0/appointment/${appointmentId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch ({ errors }) {
          return {
            error: {
              code: errors?.[0]?.code,
              detail: errors?.[0]?.detail,
            },
          };
        }
      },
    }),
    getTopics: builder.query({
      async queryFn() {
        const { token, error: tokenError } = getTokenOrError();
        if (tokenError) {
          return { error: tokenError };
        }
        try {
          return await api('/vass/v0/topics', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch ({ errors }) {
          return {
            error: {
              code: errors?.[0]?.code,
              detail: errors?.[0]?.detail,
            },
          };
        }
      },
    }),
    getAppointmentAvailability: builder.query({
      async queryFn() {
        const { token, error: tokenError } = getTokenOrError();
        if (tokenError) {
          return { error: tokenError };
        }
        try {
          return await api('/vass/v0/appointment-availability', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch ({ errors }) {
          return {
            error: {
              code: errors?.[0]?.code,
              detail: errors?.[0]?.detail,
              appointment: errors?.[0]?.appointment,
            },
          };
        }
      },
    }),
    cancelAppointment: builder.mutation({
      async queryFn({ appointmentId }) {
        const { token, error: tokenError } = getTokenOrError();
        if (tokenError) {
          return { error: tokenError };
        }
        try {
          return await api(`/vass/v0/appointment/${appointmentId}/cancel`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch ({ errors }) {
          return {
            error: {
              code: errors?.[0]?.code,
              detail: errors?.[0]?.detail,
            },
          };
        }
      },
    }),
  }),
});

export const {
  usePostAuthenticationMutation,
  usePostOTPVerificationMutation,
  usePostAppointmentMutation,
  useGetAppointmentQuery,
  useGetTopicsQuery,
  useGetAppointmentAvailabilityQuery,
  useLazyGetAppointmentAvailabilityQuery,
  useCancelAppointmentMutation,
} = vassApi;

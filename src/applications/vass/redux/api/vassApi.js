import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from 'platform/utilities/api';
import { createApi } from '@reduxjs/toolkit/query/react';
import { setVassToken, getVassToken } from '../../utils/auth';
import { setLowAuthFormData, setObfuscatedEmail } from '../slices/formSlice';

const api = async (url, options, ...rest) => {
  return apiRequest(`${environment.API_URL}${url}`, options, ...rest);
};

export async function postAuthenticationQueryFn({ uuid, lastname, dob }) {
  try {
    return await api('/vass/v0/authenticate', {
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
  } catch (error) {
    // captureError(error, false, 'post referral appointment');
    // TODO: do something with error
    return {
      error: { status: error.status || 500, message: error?.message },
    };
  }
}

export async function postOTCVerificationQueryFn({ otc, uuid, lastname, dob }) {
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
}

export async function postAppointmentQueryFn({ topics, dtStartUtc, dtEndUtc }) {
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
}

export async function getAppointmentQueryFn({ appointmentId }) {
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
}

export async function getTopicsQueryFn() {
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
}

export async function getAppointmentAvailabilityQueryFn() {
  try {
    const token = getVassToken();
    return await api('/vass/v0/appointment-availability', {
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
}

export async function cancelAppointmentQueryFn({ appointmentId }) {
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
}

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
          return {
            error: error.errors?.[0] || {
              status: error.status || 500,
              message: error?.message,
            },
          };
        }
      },
    }),
    postOTCVerification: builder.mutation({
      queryFn: postOTCVerificationQueryFn,
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
      queryFn: postAppointmentQueryFn,
    }),
    getAppointment: builder.query({
      queryFn: getAppointmentQueryFn,
    }),
    getTopics: builder.query({
      queryFn: getTopicsQueryFn,
    }),
    getAppointmentAvailability: builder.query({
      queryFn: getAppointmentAvailabilityQueryFn,
    }),
    cancelAppointment: builder.mutation({
      queryFn: cancelAppointmentQueryFn,
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
  useCancelAppointmentMutation,
} = vassApi;

import post911GIBStatus from '../../reducers';

import {
  SET_SERVICE_AVAILABILITY,
  SERVICE_AVAILABILITY_STATES,
  SET_SERVICE_UPTIME_REMAINING,
} from '../../utils/constants';

const initialState = {
  enrollmentData: null,
  availability: 'awaitingResponse',
};

describe('post911GIBStatus reducer', () => {
  test('should handle a successful request for enrollment information', () => {
    const state = post911GIBStatus.post911GIBStatus(initialState, {
      type: 'GET_ENROLLMENT_DATA_SUCCESS',
      data: {
        firstName: 'Jane',
        lastName: 'Austen',
        dateOfBirth: '9/1/1980',
        vaFileNumber: '111223333',
      },
    });

    expect(state.enrollmentData.firstName).toBe('Jane');
    expect(state.availability).toBe('available');
  });

  test('should handle backend service error', () => {
    const state = post911GIBStatus.post911GIBStatus(initialState, {
      type: 'BACKEND_SERVICE_ERROR',
    });

    expect(state.enrollmentData).toBeNull();
    expect(state.availability).toBe('backendServiceError');
  });

  test('should handle backend authentication error', () => {
    const state = post911GIBStatus.post911GIBStatus(initialState, {
      type: 'BACKEND_AUTHENTICATION_ERROR',
    });

    expect(state.enrollmentData).toBeNull();
    expect(state.availability).toBe('backendAuthenticationError');
  });

  test('should handle no Chapter 33 record error', () => {
    const state = post911GIBStatus.post911GIBStatus(initialState, {
      type: 'NO_CHAPTER33_RECORD_AVAILABLE',
    });

    expect(state.enrollmentData).toBeNull();
    expect(state.availability).toBe('noChapter33Record');
  });

  test('should handle failure to fetch enrollment information', () => {
    const state = post911GIBStatus.post911GIBStatus(initialState, {
      type: 'GET_ENROLLMENT_DATA_FAILURE',
    });

    expect(state.enrollmentData).toBeNull();
    expect(state.availability).toBe('getEnrollmentDataFailure');
  });

  test('should handle setting the service availability', () => {
    const state = post911GIBStatus.post911GIBStatus(initialState, {
      type: SET_SERVICE_AVAILABILITY,
      serviceAvailability: SERVICE_AVAILABILITY_STATES.up,
    });

    expect(state.serviceAvailability).toBe(SERVICE_AVAILABILITY_STATES.up);
  });

  test('should handle setting the uptime remaining', () => {
    const state = post911GIBStatus.post911GIBStatus(initialState, {
      type: SET_SERVICE_UPTIME_REMAINING,
      uptimeRemaining: 300,
    });

    expect(state.uptimeRemaining).toBe(300);
  });
});

import {
  FETCH_BACKEND_STATUSES_FAILURE,
  FETCH_BACKEND_STATUSES_SUCCESS,
  LOADING_BACKEND_STATUSES,
} from '../actions';

import reducer from '../reducer';

describe('External service statuses reducer', () => {
  test('should have a default state', () => {
    const state = reducer(undefined, {});
    expect(state.loading).toBe(false);
    expect(state.statuses).toBeNull();
  });

  test('should handle in progress requests for backend statuses', () => {
    const state = reducer(undefined, { type: LOADING_BACKEND_STATUSES });
    expect(state.loading).toBe(true);
  });

  test('should handle failed requests for backend statuses', () => {
    const state = reducer(undefined, { type: FETCH_BACKEND_STATUSES_FAILURE });
    expect(state.loading).toBe(false);
  });

  test('should handle successful requests for backend statuses', () => {
    const statuses = [
      {
        service: 'Master Veterans Index (MVI)',
        serviceId: 'mvi',
        status: 'active',
        lastIncidentTimestamp: '2019-07-09T07:00:40.000-04:00',
      },
      {
        service: 'My Healthe Vet (MHV)',
        serviceId: 'mhv',
        status: 'active',
        lastIncidentTimestamp: '2019-07-10T22:06:56.000-04:00',
      },
      {
        service: 'search.gov',
        serviceId: 'search',
        status: 'active',
        lastIncidentTimestamp: '2019-07-10T14:44:54.000-04:00',
      },
    ];

    const state = reducer(undefined, {
      type: FETCH_BACKEND_STATUSES_SUCCESS,
      data: { attributes: { statuses } },
    });

    expect(state.loading).toBe(false);
    expect(state.statuses).toEqual(statuses);
  });
});

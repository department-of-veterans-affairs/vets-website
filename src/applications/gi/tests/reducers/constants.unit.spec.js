import constantsReducer from '../../reducers/constants';

const initialState = {
  inProgress: false,
  version: {},
};

describe('constants reducer', () => {
  test('should handle fetch starting', () => {
    const state = constantsReducer(initialState, {
      type: 'FETCH_CONSTANTS_STARTED',
    });

    expect(state.inProgress).toBe(true);
  });

  test('should handle fetch failed', () => {
    const state = constantsReducer(
      { inProgress: true },
      {
        type: 'FETCH_CONSTANTS_FAILED',
        payload: 'Service Unavailable',
      },
    );

    expect(state.inProgress).toBe(false);
    expect(state.error).toBe('Service Unavailable');
  });

  test('should handle fetch succeeded', () => {
    const state = constantsReducer(
      { inProgress: true },
      {
        type: 'FETCH_CONSTANTS_SUCCEEDED',
        payload: {
          data: [
            {
              attributes: {
                name: 'constantName',
                value: 'constantValue',
              },
            },
          ],
          meta: {
            version: 1,
          },
        },
      },
    );

    expect(state.inProgress).toBe(false);
    expect(state.version).toBe(1);
    expect(state.constants).toEqual({ constantName: 'constantValue' });
  });
});

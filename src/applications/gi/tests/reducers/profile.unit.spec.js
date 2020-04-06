import profileReducer from '../../reducers/profile';

const initialState = {
  attributes: {},
  version: {},
  inProgress: false,
};

describe('profile reducer', () => {
  it('should handle profile fetch started', () => {
    const state = profileReducer(initialState, {
      type: 'FETCH_PROFILE_STARTED',
    });

    expect(state.inProgress).toBe(true);
  });

  it('should handle profile fetch failure', () => {
    const state = profileReducer(
      { inProgress: true },
      {
        type: 'FETCH_PROFILE_FAILED',
        payload: 'Service Unavailable',
      },
    );

    expect(state.error).toBe('Service Unavailable');
    expect(state.inProgress).toBe(false);
  });

  it('should handle profile fetch success', () => {
    const state = profileReducer(
      { inProgress: true },
      {
        type: 'FETCH_PROFILE_SUCCEEDED',
        payload: {
          data: {
            attributes: {
              name: 'name',
            },
            links: {},
          },
          meta: {
            version: 1,
          },
        },
      },
    );

    expect(state.inProgress).toBe(false);
    expect(state.attributes.name).toBe('NAME');
    expect(state.version).toBe(1);
  });
});

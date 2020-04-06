import ratedDisabilities from '../../reducers';

const initialState = {
  ratedDisabilities: null,
};

describe('ratedDisabilities reducer', () => {
  it('should return the initial state', () => {
    const state = ratedDisabilities.ratedDisabilities(initialState, {});
    expect(state.ratedDisabilities).toBeNull();
  });

  it('should handle a succesful call for rated disabilities', () => {
    const state = ratedDisabilities.ratedDisabilities(initialState, {
      type: 'FETCH_RATED_DISABILITIES_SUCCESS',
      response: [
        {
          name: 'PTSD',
          effectiveDate: '01/01/1990',
          related: true,
        },
      ],
    });
    expect(state.ratedDisabilities.length).toBe(1);
    expect(state.ratedDisabilities[0].name).toBe('PTSD');
  });

  it('should handle an error response from the backend', () => {
    const state = ratedDisabilities.ratedDisabilities(initialState, {
      type: 'FETCH_RATED_DISABILITIES_FAILED',
      response: [
        {
          code: '500',
          status: 'Failed',
        },
      ],
    });
    expect(state.ratedDisabilities[0].code).toBe('500');
  });
});

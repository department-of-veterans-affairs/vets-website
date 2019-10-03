import { expect } from 'chai';

import totalRating from '../../reducers';

const initialState = {
    loading: true, // app starts in loading state
    error: false,
    totalDisabilityRating: null,
}
  
  describe('totalRating reducer', () => {
    it('should return the initial state', () => {
      const state = totalRating.totalRating(initialState, {});
      expect(state.loading).to.equal(true);
    });

  /*
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
      expect(state.ratedDisabilities.length).to.equal(1);
      expect(state.ratedDisabilities[0].name).to.equal('PTSD');
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
      expect(state.ratedDisabilities[0].code).to.equal('500');
    });
    */
  });
  
import { expect } from 'chai';

import representative from '../../reducers';
import { currentRepresentative } from '../helpers';

const initialState = {
  loading: true,
  error: null,
  representative: null,
};

describe('View Representative reducer', () => {
  it('should return initial state', () => {
    const state = representative.representative(initialState, {});
    expect(state.loading).to.be.true;
    expect(state.representative).to.equal(null);
  });

  it('should handle a successful call for fetching payments', () => {
    const state = representative.representative(initialState, {
      type: 'FETCH_REPRESENTATIVE_SUCCESS',
      response: currentRepresentative,
    });
    expect(state.loading).to.be.false;
    expect(state.representative.length).to.be.greaterThan(0);
  });

  // TODO: this needs to be updated once the frontend is wired up to the backend.
  it('should handle an error response from the server', () => {
    const state = representative.representative(initialState, {
      type: 'FETCH_REPRESENTATIVE_FAILED',
      response: [
        {
          code: '500',
          status: 'failed',
        },
      ],
    });
    expect(state.loading).to.be.false;
    expect(state.representative).to.equal(null);
    expect(state.error).to.not.equal(null);
  });
});

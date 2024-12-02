import { expect } from 'chai';

import paymentReducer from '../../reducers';
import { payments } from '../helpers';

const { allPayments } = paymentReducer;

const initialState = {
  isLoading: true,
  payments: null,
  error: null,
};

describe('allPayments reducer', () => {
  it('should return initial state', () => {
    const state = allPayments(initialState, {});
    expect(state.isLoading).to.be.true;
    expect(state.payments).to.equal(null);
  });

  it('should handle a successful call for fetching payments', () => {
    const state = allPayments(initialState, {
      type: 'PAYMENTS_RECEIVED_SUCCEEDED',
      response: payments,
    });
    expect(state.isLoading).to.be.false;
    expect(state.payments.payments.length).to.be.greaterThan(0);
  });

  // TODO: this needs to be updated once the frontend is wired up to the backend.
  it('should handle an error response from the server', () => {
    const state = allPayments(initialState, {
      type: 'PAYMENTS_RECEIVED_FAILED',
      response: [
        {
          code: '500',
          status: 'failed',
        },
      ],
    });
    expect(state.isLoading).to.be.false;
    expect(state.payments).to.equal(null);
    expect(state.error).to.not.equal(null);
  });
});

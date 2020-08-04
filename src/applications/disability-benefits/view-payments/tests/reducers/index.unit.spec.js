import { expect } from 'chai';
import {
  PAYMENTS_RECEIVED_SUCCEEDED,
  PAYMENTS_RECEIVED_FAILED,
} from '../../actions';

import paymentReducer from '../../reducers';
import { mockData } from '../helpers';

const { allPayments } = paymentReducer;

const initialState = {
  isLoading: true,
  hasPaymentsReceived: null,
  hasPaymentsReturned: null,
};

describe('allPayments reducer', () => {
  it('should return initial state', () => {
    const state = allPayments(initialState, {});
    expect(state.isLoading).to.be.true;
    expect(state.hasPaymentsReceived).to.equal(null);
    expect(state.hasPaymentsReturned).to.equal(null);
  });

  it('should handle a successful call for fetching payments', () => {
    const state = allPayments(initialState, {
      type: 'PAYMENTS_RECEIVED_SUCCEEDED',
      mockData,
    });
    expect(state.isLoading).to.be.false;
    expect(state.hasPaymentsReceived.length).to.be.greaterThan(0);
    expect(state.hasPaymentsReturned.length).to.be.greaterThan(0);
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
    expect(state.hasPaymentsReceived).to.equal(null);
    expect(state.hasPaymentsReturned).to.equal(null);
  });
});

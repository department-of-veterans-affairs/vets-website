import { expect } from 'chai';
import paymentsReducer from '../../reducers/payments';
import {
  PAYMENTS_RECEIVED_STARTED,
  PAYMENTS_RECEIVED_SUCCEEDED,
  PAYMENTS_RECEIVED_FAILED,
} from '../../actions/payments';

describe('payments reducer', () => {
  const initialState = {
    isLoading: true,
    payments: null,
    error: null,
  };

  describe('PAYMENTS_RECEIVED_STARTED', () => {
    it('should set isLoading to true', () => {
      const existingState = {
        ...initialState,
        isLoading: false,
        payments: [{ id: 1 }],
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_STARTED,
      });

      expect(state.isLoading).to.be.true;
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        payments: [{ id: 1 }],
        error: null,
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_STARTED,
      });

      expect(state.payments).to.eql([{ id: 1 }]);
      expect(state.error).to.be.null;
    });

    it('should overwrite existing error when setting loading', () => {
      const existingState = {
        ...initialState,
        isLoading: false,
        error: { message: 'Previous error' },
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_STARTED,
      });

      expect(state.isLoading).to.be.true;
      expect(state.error).to.eql({ message: 'Previous error' });
    });
  });

  describe('PAYMENTS_RECEIVED_SUCCEEDED', () => {
    it('should set isLoading to false and payments to action.payments', () => {
      const mockPayments = [
        { id: 1, amount: 100, date: '2024-01-01' },
        { id: 2, amount: 200, date: '2024-02-01' },
      ];

      const existingState = {
        ...initialState,
        isLoading: true,
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_SUCCEEDED,
        payments: mockPayments,
      });

      expect(state.isLoading).to.be.false;
      expect(state.payments).to.eql(mockPayments);
    });

    it('should handle empty payments array', () => {
      const existingState = {
        ...initialState,
        isLoading: true,
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_SUCCEEDED,
        payments: [],
      });

      expect(state.isLoading).to.be.false;
      expect(state.payments).to.eql([]);
    });

    it('should handle null payments', () => {
      const existingState = {
        ...initialState,
        isLoading: true,
        payments: [{ id: 1 }],
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_SUCCEEDED,
        payments: null,
      });

      expect(state.isLoading).to.be.false;
      expect(state.payments).to.be.null;
    });

    it('should preserve error state', () => {
      const existingState = {
        ...initialState,
        isLoading: true,
        error: { message: 'Previous error' },
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_SUCCEEDED,
        payments: [{ id: 1 }],
      });

      expect(state.error).to.eql({ message: 'Previous error' });
    });

    it('should clear previous payments when new payments are received', () => {
      const existingState = {
        ...initialState,
        payments: [{ id: 1, amount: 50 }],
      };

      const newPayments = [{ id: 2, amount: 100 }];

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_SUCCEEDED,
        payments: newPayments,
      });

      expect(state.payments).to.eql(newPayments);
      expect(state.payments).to.not.eql(existingState.payments);
    });
  });

  describe('PAYMENTS_RECEIVED_FAILED', () => {
    it('should set isLoading to false and error to action.error', () => {
      const mockError = {
        message: 'Failed to fetch payments',
        status: 500,
      };

      const existingState = {
        ...initialState,
        isLoading: true,
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_FAILED,
        error: mockError,
      });

      expect(state.isLoading).to.be.false;
      expect(state.error).to.eql(mockError);
    });

    it('should handle error object with various properties', () => {
      const mockError = {
        message: 'Network error',
        status: 503,
        code: 'NETWORK_ERROR',
        details: { retry: true },
      };

      const state = paymentsReducer(initialState, {
        type: PAYMENTS_RECEIVED_FAILED,
        error: mockError,
      });

      expect(state.error).to.eql(mockError);
      expect(state.error.details).to.eql({ retry: true });
    });

    it('should handle null error', () => {
      const existingState = {
        ...initialState,
        isLoading: true,
        error: { message: 'Previous error' },
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_FAILED,
        error: null,
      });

      expect(state.isLoading).to.be.false;
      expect(state.error).to.be.null;
    });

    it('should preserve payments state', () => {
      const existingState = {
        ...initialState,
        isLoading: true,
        payments: [{ id: 1 }],
      };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_FAILED,
        error: { message: 'Error' },
      });

      expect(state.payments).to.eql([{ id: 1 }]);
    });

    it('should overwrite previous error', () => {
      const existingState = {
        ...initialState,
        error: { message: 'Previous error' },
      };

      const newError = { message: 'New error', status: 404 };

      const state = paymentsReducer(existingState, {
        type: PAYMENTS_RECEIVED_FAILED,
        error: newError,
      });

      expect(state.error).to.eql(newError);
      expect(state.error).to.not.eql(existingState.error);
    });
  });

  describe('default case', () => {
    it('should return state unchanged for unknown action types', () => {
      const existingState = {
        ...initialState,
        payments: [{ id: 1 }],
        error: null,
        isLoading: false,
      };

      const state = paymentsReducer(existingState, {
        type: 'UNKNOWN_ACTION_TYPE',
      });

      expect(state).to.eql(existingState);
      expect(state).to.equal(existingState);
    });

    it('should return initial state when state is undefined', () => {
      const state = paymentsReducer(undefined, {
        type: 'UNKNOWN_ACTION_TYPE',
      });

      expect(state).to.eql(initialState);
    });

    it('should preserve state when action type is empty string', () => {
      const existingState = {
        ...initialState,
        payments: [{ id: 1 }],
      };

      const state = paymentsReducer(existingState, {
        type: '',
      });

      expect(state).to.eql(existingState);
    });
  });
});

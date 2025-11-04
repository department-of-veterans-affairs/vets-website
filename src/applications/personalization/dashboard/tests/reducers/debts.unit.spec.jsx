import { expect } from 'chai';
import debtsReducer from '../../reducers/debts';
import {
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  COPAYS_FETCH_SUCCESS,
  COPAYS_FETCH_FAILURE,
} from '../../actions/debts';

describe('debts reducer', () => {
  const initialState = {
    isLoading: false,
    isError: false,
    copays: [],
    copaysErrors: [],
    debts: [],
    debtsErrors: [],
    hasDependentDebts: false,
    debtsCount: 0,
  };

  describe('DEBTS_FETCH_INITIATED', () => {
    it('should set isLoading to true and isError to false', () => {
      const state = debtsReducer(initialState, {
        type: DEBTS_FETCH_INITIATED,
      });

      expect(state.isLoading).to.be.true;
      expect(state.isError).to.be.false;
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        debts: [{ id: 1 }],
        copays: [{ id: 2 }],
        debtsCount: 5,
        hasDependentDebts: true,
      };

      const state = debtsReducer(existingState, {
        type: DEBTS_FETCH_INITIATED,
      });

      expect(state.debts).to.eql([{ id: 1 }]);
      expect(state.copays).to.eql([{ id: 2 }]);
      expect(state.debtsCount).to.equal(5);
      expect(state.hasDependentDebts).to.be.true;
    });
  });

  describe('DEBTS_FETCH_SUCCESS', () => {
    it('should set debts and update loading/error states', () => {
      const mockDebts = [
        { id: 1, description: 'Debt 1' },
        { id: 2, description: 'Debt 2' },
      ];

      const state = debtsReducer(initialState, {
        type: DEBTS_FETCH_SUCCESS,
        debts: mockDebts,
      });

      expect(state.debts).to.eql(mockDebts);
      expect(state.isLoading).to.be.false;
      expect(state.isError).to.be.false;
    });

    it('should set debtsCount when present in action', () => {
      const mockDebts = [{ id: 1 }];

      const state = debtsReducer(initialState, {
        type: DEBTS_FETCH_SUCCESS,
        debts: mockDebts,
        debtsCount: 10,
      });

      expect(state.debtsCount).to.equal(10);
      expect(state.debts).to.eql(mockDebts);
    });

    it('should default debtsCount to 0 when absent in action', () => {
      const mockDebts = [{ id: 1 }];

      const state = debtsReducer(initialState, {
        type: DEBTS_FETCH_SUCCESS,
        debts: mockDebts,
      });

      expect(state.debtsCount).to.equal(0);
      expect(state.debts).to.eql(mockDebts);
    });

    it('should set hasDependentDebts when present in action', () => {
      const mockDebts = [{ id: 1 }];

      const state = debtsReducer(initialState, {
        type: DEBTS_FETCH_SUCCESS,
        debts: mockDebts,
        hasDependentDebts: true,
      });

      expect(state.hasDependentDebts).to.be.true;
      expect(state.debts).to.eql(mockDebts);
    });

    it('should set hasDependentDebts to undefined when absent in action', () => {
      const mockDebts = [{ id: 1 }];

      const state = debtsReducer(initialState, {
        type: DEBTS_FETCH_SUCCESS,
        debts: mockDebts,
      });

      expect(state.hasDependentDebts).to.be.undefined;
      expect(state.debts).to.eql(mockDebts);
    });

    it('should handle empty debts array', () => {
      const state = debtsReducer(initialState, {
        type: DEBTS_FETCH_SUCCESS,
        debts: [],
        debtsCount: 0,
      });

      expect(state.debts).to.eql([]);
      expect(state.debtsCount).to.equal(0);
      expect(state.isLoading).to.be.false;
      expect(state.isError).to.be.false;
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        copays: [{ id: 1 }],
        copaysErrors: ['error'],
      };

      const state = debtsReducer(existingState, {
        type: DEBTS_FETCH_SUCCESS,
        debts: [{ id: 2 }],
        debtsCount: 5,
      });

      expect(state.copays).to.eql([{ id: 1 }]);
      expect(state.copaysErrors).to.eql(['error']);
    });
  });

  describe('DEBTS_FETCH_FAILURE', () => {
    it('should set isError to true and isLoading to false', () => {
      const existingState = {
        ...initialState,
        isLoading: true,
      };

      const state = debtsReducer(existingState, {
        type: DEBTS_FETCH_FAILURE,
        errors: ['Error message'],
      });

      expect(state.isError).to.be.true;
      expect(state.isLoading).to.be.false;
    });

    it('should set debtsErrors to action errors', () => {
      const mockErrors = ['Error 1', 'Error 2'];

      const state = debtsReducer(initialState, {
        type: DEBTS_FETCH_FAILURE,
        errors: mockErrors,
      });

      expect(state.debtsErrors).to.eql(mockErrors);
    });

    it('should handle empty errors array', () => {
      const state = debtsReducer(initialState, {
        type: DEBTS_FETCH_FAILURE,
        errors: [],
      });

      expect(state.debtsErrors).to.eql([]);
      expect(state.isError).to.be.true;
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        debts: [{ id: 1 }],
        copays: [{ id: 2 }],
        debtsCount: 5,
      };

      const state = debtsReducer(existingState, {
        type: DEBTS_FETCH_FAILURE,
        errors: ['error'],
      });

      expect(state.debts).to.eql([{ id: 1 }]);
      expect(state.copays).to.eql([{ id: 2 }]);
      expect(state.debtsCount).to.equal(5);
    });
  });

  describe('COPAYS_FETCH_SUCCESS', () => {
    it('should set copays and update loading/error states', () => {
      const mockCopays = [
        { id: 1, facility: 'Facility 1' },
        { id: 2, facility: 'Facility 2' },
      ];

      const state = debtsReducer(initialState, {
        type: COPAYS_FETCH_SUCCESS,
        copays: mockCopays,
      });

      expect(state.copays).to.eql(mockCopays);
      expect(state.isLoading).to.be.false;
      expect(state.isError).to.be.false;
    });

    it('should set hasDependentDebts when present in action', () => {
      const mockCopays = [{ id: 1 }];

      const state = debtsReducer(initialState, {
        type: COPAYS_FETCH_SUCCESS,
        copays: mockCopays,
        hasDependentDebts: true,
      });

      expect(state.hasDependentDebts).to.be.true;
      expect(state.copays).to.eql(mockCopays);
    });

    it('should set hasDependentDebts to undefined when absent in action', () => {
      const mockCopays = [{ id: 1 }];

      const state = debtsReducer(initialState, {
        type: COPAYS_FETCH_SUCCESS,
        copays: mockCopays,
      });

      expect(state.hasDependentDebts).to.be.undefined;
      expect(state.copays).to.eql(mockCopays);
    });

    it('should handle empty copays array', () => {
      const state = debtsReducer(initialState, {
        type: COPAYS_FETCH_SUCCESS,
        copays: [],
      });

      expect(state.copays).to.eql([]);
      expect(state.isLoading).to.be.false;
      expect(state.isError).to.be.false;
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        debts: [{ id: 1 }],
        debtsErrors: ['error'],
        debtsCount: 5,
      };

      const state = debtsReducer(existingState, {
        type: COPAYS_FETCH_SUCCESS,
        copays: [{ id: 2 }],
      });

      expect(state.debts).to.eql([{ id: 1 }]);
      expect(state.debtsErrors).to.eql(['error']);
      expect(state.debtsCount).to.equal(5);
    });
  });

  describe('COPAYS_FETCH_FAILURE', () => {
    it('should set isError to true and isLoading to false', () => {
      const existingState = {
        ...initialState,
        isLoading: true,
      };

      const state = debtsReducer(existingState, {
        type: COPAYS_FETCH_FAILURE,
        errors: ['Error message'],
      });

      expect(state.isError).to.be.true;
      expect(state.isLoading).to.be.false;
    });

    it('should set copaysErrors to action errors', () => {
      const mockErrors = ['Error 1', 'Error 2'];

      const state = debtsReducer(initialState, {
        type: COPAYS_FETCH_FAILURE,
        errors: mockErrors,
      });

      expect(state.copaysErrors).to.eql(mockErrors);
    });

    it('should handle empty errors array', () => {
      const state = debtsReducer(initialState, {
        type: COPAYS_FETCH_FAILURE,
        errors: [],
      });

      expect(state.copaysErrors).to.eql([]);
      expect(state.isError).to.be.true;
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        debts: [{ id: 1 }],
        copays: [{ id: 2 }],
        debtsCount: 5,
      };

      const state = debtsReducer(existingState, {
        type: COPAYS_FETCH_FAILURE,
        errors: ['error'],
      });

      expect(state.debts).to.eql([{ id: 1 }]);
      expect(state.copays).to.eql([{ id: 2 }]);
      expect(state.debtsCount).to.equal(5);
    });
  });

  describe('default case', () => {
    it('should return state unchanged for unknown action types', () => {
      const existingState = {
        ...initialState,
        debts: [{ id: 1 }],
        copays: [{ id: 2 }],
        debtsCount: 5,
        hasDependentDebts: true,
      };

      const state = debtsReducer(existingState, {
        type: 'UNKNOWN_ACTION_TYPE',
      });

      expect(state).to.eql(existingState);
      expect(state).to.equal(existingState);
    });

    it('should return initial state when state is undefined', () => {
      const state = debtsReducer(undefined, {
        type: 'UNKNOWN_ACTION_TYPE',
      });

      expect(state).to.eql(initialState);
    });
  });
});

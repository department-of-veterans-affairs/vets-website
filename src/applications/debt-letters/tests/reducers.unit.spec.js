import { debtsReducer as reducer } from '../reducers';
import { expect } from 'chai';
import {
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
} from '../actions';

describe('Debt Letters Reducer', () => {
  let state;
  let reducedState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('DEBTS_FETCH_INITIATED', () => {
    it('sets the correct state for initialized state', () => {
      action = {
        type: DEBTS_FETCH_INITIATED,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isPending).to.be.true;
      expect(reducedState.isError).to.be.false;
    });
  });

  describe('DEBTS_FETCH_SUCCESS', () => {
    it('sets correct state for fetch success', () => {
      action = {
        type: DEBTS_FETCH_SUCCESS,
        debts: [{ foo: 'bar' }],
      };
      reducedState = reducer(state, action);
      expect(reducedState.isPending).to.be.false;
      expect(reducedState.debts).to.deep.equal([{ foo: 'bar' }]);
      expect(reducedState.isError).to.be.false;
    });
  });

  describe('DEBTS_FETCH_FAILURE', () => {
    it('sets correct state for failed state', () => {
      action = {
        type: DEBTS_FETCH_FAILURE,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isPending).to.be.false;
      expect(reducedState.isError).to.be.true;
    });
  });
});

import { expect } from 'chai';
import { debtsReducer as reducer } from '../../combined/reducers';
import {
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  DEBT_LETTERS_FETCH_SUCCESS,
  DEBT_LETTERS_FETCH_FAILURE,
  DEBTS_SET_ACTIVE_DEBT,
} from '../../combined/actions/debts';

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

  describe('DEBT_LETTERS_FETCH_SUCCESS', () => {
    it('sets correct state for vbms success state', () => {
      action = {
        type: DEBT_LETTERS_FETCH_SUCCESS,
        debtLinks: [{ foo: 'bar' }],
      };
      reducedState = reducer(state, action);
      expect(reducedState.debtLinks).to.deep.equal([{ foo: 'bar' }]);
      expect(reducedState.isPending).to.be.false;
      expect(reducedState.isVBMSError).to.be.false;
    });
  });

  describe('DEBT_LETTERS_FETCH_FAILURE', () => {
    it('sets correct state for vbms failed state', () => {
      action = {
        type: DEBT_LETTERS_FETCH_FAILURE,
        debtLinks: [{ foo: 'bar' }],
      };
      reducedState = reducer(state, action);
      expect(reducedState.isPending).to.be.false;
      expect(reducedState.isVBMSError).to.be.true;
    });
  });

  describe('DEBTS_SET_ACTIVE_DEBT', () => {
    it('sets active debt correctly', () => {
      action = {
        type: DEBTS_SET_ACTIVE_DEBT,
        debt: 1234,
      };
      reducedState = reducer(state, action);
      expect(reducedState.isPending).to.be.false;
      expect(reducedState.selectedDebt).to.equal(1234);
    });
  });
});

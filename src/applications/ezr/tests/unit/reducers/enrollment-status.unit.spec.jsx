import { expect } from 'chai';
import { ENROLLMENT_STATUS_ACTIONS } from '../../../utils/constants';
import reducer from '../../../reducers/enrollment-status';

describe('ezr enrollment status reducer', () => {
  let state;
  let reducedState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  describe('default behavior', () => {
    it('should return the initial state', () => {
      action = {};
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.false;
      expect(reducedState.parsedStatus).to.be.null;
      expect(reducedState.hasServerError).to.be.false;
    });
  });

  describe('when the action type is not a match', () => {
    it('should return the inital state', () => {
      action = { type: '@@INIT' };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.false;
      expect(reducedState.parsedStatus).to.be.null;
      expect(reducedState.hasServerError).to.be.false;
    });
  });

  describe('when `FETCH_ENROLLMENT_STATUS_STARTED` executes', () => {
    const { FETCH_ENROLLMENT_STATUS_STARTED } = ENROLLMENT_STATUS_ACTIONS;
    it('should return the inital state', () => {
      action = { type: FETCH_ENROLLMENT_STATUS_STARTED };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.true;
      expect(reducedState.parsedStatus).to.be.null;
      expect(reducedState.hasServerError).to.be.false;
    });
  });

  describe('when `FETCH_ENROLLMENT_STATUS_FAILED` executes', () => {
    const { FETCH_ENROLLMENT_STATUS_FAILED } = ENROLLMENT_STATUS_ACTIONS;
    it('should properly handle the response', () => {
      const error = { code: 500, detail: 'failed to load' };
      action = { type: FETCH_ENROLLMENT_STATUS_FAILED, error };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.false;
      expect(reducedState.parsedStatus).to.be.null;
      expect(reducedState.hasServerError).to.be.true;
    });
  });

  describe('when `FETCH_ENROLLMENT_STATUS_SUCCEEDED` executes', () => {
    const { FETCH_ENROLLMENT_STATUS_SUCCEEDED } = ENROLLMENT_STATUS_ACTIONS;
    it('should properly handle the response', () => {
      const response = { parsedStatus: 'enrolled' };
      action = { type: FETCH_ENROLLMENT_STATUS_SUCCEEDED, response };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.false;
      expect(reducedState.hasServerError).to.be.false;
      expect(reducedState.parsedStatus).to.equal(response.parsedStatus);
    });
  });
});

import { expect } from 'chai';
import { DISABILITY_RATING_ACTIONS } from '../../../utils/constants';
import reducer from '../../../reducers/total-disabilities';

describe('hca TotalDisabilities reducer', () => {
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
      expect(reducedState.loading).to.be.true;
      expect(reducedState.error).to.be.null;
      expect(reducedState.totalDisabilityRating).to.be.null;
      expect(reducedState.disabilityDecisionTypeName).to.be.null;
    });
  });

  describe('when the action type is not a match', () => {
    it('should return the inital state', () => {
      action = { type: '@@INIT' };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.true;
      expect(reducedState.error).to.be.null;
      expect(reducedState.totalDisabilityRating).to.be.null;
      expect(reducedState.disabilityDecisionTypeName).to.be.null;
    });
  });

  describe('when `FETCH_TOTAL_RATING_STARTED` executes', () => {
    const { FETCH_TOTAL_RATING_STARTED } = DISABILITY_RATING_ACTIONS;
    it('should return the inital state', () => {
      action = { type: FETCH_TOTAL_RATING_STARTED };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.true;
      expect(reducedState.error).to.be.null;
      expect(reducedState.totalDisabilityRating).to.be.null;
      expect(reducedState.disabilityDecisionTypeName).to.be.null;
    });
  });

  describe('when `FETCH_TOTAL_RATING_FAILED` executes', () => {
    const { FETCH_TOTAL_RATING_FAILED } = DISABILITY_RATING_ACTIONS;
    it('should properly handle the error', () => {
      const error = { code: 500, detail: 'failed to load' };
      action = { type: FETCH_TOTAL_RATING_FAILED, error };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.false;
      expect(reducedState.error.code).to.equal(error.code);
      expect(reducedState.error.detail).to.equal(error.detail);
      expect(reducedState.totalDisabilityRating).to.be.null;
    });
  });

  describe('when `FETCH_TOTAL_RATING_SUCCEEDED` executes', () => {
    const { FETCH_TOTAL_RATING_SUCCEEDED } = DISABILITY_RATING_ACTIONS;
    it('should properly handle the response', () => {
      const response = {
        disabilityDecisionTypeName: 'Service Connected',
        userPercentOfDisability: 80,
      };
      action = { type: FETCH_TOTAL_RATING_SUCCEEDED, response };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.false;
      expect(reducedState.error).to.be.null;
      expect(reducedState.totalDisabilityRating).to.equal(
        response.userPercentOfDisability,
      );
      expect(reducedState.disabilityDecisionTypeName).to.equal(
        response.disabilityDecisionTypeName,
      );
    });
  });
});

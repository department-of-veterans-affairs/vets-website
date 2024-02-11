import { expect } from 'chai';
import {
  DISABILITY_RATING_ACTIONS,
  DISABILITY_RATING_INIT_STATE,
} from '../../../utils/constants';
import reducer from '../../../reducers/disability-rating';

describe('hca DisabilityRating reducer', () => {
  let state;
  let reducedState;
  let action;

  beforeEach(() => {
    state = undefined;
  });

  context('default behavior', () => {
    it('should return the initial state', () => {
      action = {};
      reducedState = reducer(state, action);
      expect(JSON.stringify(reducedState)).to.eq(
        JSON.stringify(DISABILITY_RATING_INIT_STATE),
      );
    });
  });

  context('when the action type is not a match', () => {
    it('should return the inital state', () => {
      action = { type: '@@INIT' };
      reducedState = reducer(state, action);
      expect(JSON.stringify(reducedState)).to.eq(
        JSON.stringify(DISABILITY_RATING_INIT_STATE),
      );
    });
  });

  context('when `FETCH_DISABILITY_RATING_STARTED` executes', () => {
    const { FETCH_DISABILITY_RATING_STARTED } = DISABILITY_RATING_ACTIONS;
    it('should set `loading` to `true`', () => {
      action = { type: FETCH_DISABILITY_RATING_STARTED };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.true;
    });
  });

  context('when `FETCH_DISABILITY_RATING_FAILED` executes', () => {
    const { FETCH_DISABILITY_RATING_FAILED } = DISABILITY_RATING_ACTIONS;
    it('should properly handle the error', () => {
      const error = { code: 500, detail: 'failed to load' };
      action = { type: FETCH_DISABILITY_RATING_FAILED, error };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.false;
      expect(reducedState.error.code).to.equal(error.code);
      expect(reducedState.error.detail).to.equal(error.detail);
      expect(reducedState.totalDisabilityRating).to.be.null;
    });
  });

  context('when `FETCH_DISABILITY_RATING_SUCCEEDED` executes', () => {
    const { FETCH_DISABILITY_RATING_SUCCEEDED } = DISABILITY_RATING_ACTIONS;
    it('should properly handle the response', () => {
      const response = { userPercentOfDisability: 80 };
      action = { type: FETCH_DISABILITY_RATING_SUCCEEDED, response };
      reducedState = reducer(state, action);
      expect(reducedState.loading).to.be.false;
      expect(reducedState.error).to.be.null;
      expect(reducedState.totalDisabilityRating).to.equal(
        response.userPercentOfDisability,
      );
    });
  });
});

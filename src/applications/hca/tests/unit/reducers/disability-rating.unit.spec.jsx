import { expect } from 'chai';
import { DISABILITY_RATING_ACTIONS } from '../../../utils/constants';
import reducer from '../../../reducers/disability-rating';

describe('hca disability rating reducer', () => {
  let state;

  beforeEach(() => {
    state = undefined;
  });

  it('should return the initial state by default', () => {
    const action = {};
    const { loading, error, totalRating } = reducer(state, action);
    expect(loading).to.be.true;
    expect(error).to.be.null;
    expect(totalRating).to.be.null;
  });

  it('should return the inital state when the action type is not a match', () => {
    const action = { type: '@@INIT' };
    const { loading, error, totalRating } = reducer(state, action);
    expect(loading).to.be.true;
    expect(error).to.be.null;
    expect(totalRating).to.be.null;
  });

  it('should return the inital state when `FETCH_DISABILITY_RATING_STARTED` executes', () => {
    const { FETCH_DISABILITY_RATING_STARTED } = DISABILITY_RATING_ACTIONS;
    const action = { type: FETCH_DISABILITY_RATING_STARTED };
    const { loading, error, totalRating } = reducer(state, action);
    expect(loading).to.be.true;
    expect(error).to.be.null;
    expect(totalRating).to.be.null;
  });

  it('should properly handle the error when `FETCH_DISABILITY_RATING_FAILED` executes', () => {
    const { FETCH_DISABILITY_RATING_FAILED } = DISABILITY_RATING_ACTIONS;
    const response = { code: 500, detail: 'failed to load' };
    const action = { type: FETCH_DISABILITY_RATING_FAILED, error: response };
    const { loading, error, totalRating } = reducer(state, action);
    expect(loading).to.be.false;
    expect(error.code).to.eq(response.code);
    expect(error.detail).to.eq(response.detail);
    expect(totalRating).to.be.null;
  });

  it('should properly handle the response when `FETCH_DISABILITY_RATING_SUCCEEDED` executes', () => {
    const { FETCH_DISABILITY_RATING_SUCCEEDED } = DISABILITY_RATING_ACTIONS;
    const response = {
      userPercentOfDisability: 80,
    };
    const action = { type: FETCH_DISABILITY_RATING_SUCCEEDED, response };
    const { loading, error, totalRating } = reducer(state, action);
    expect(loading).to.be.false;
    expect(error).to.be.null;
    expect(totalRating).to.eq(response.userPercentOfDisability);
  });
});

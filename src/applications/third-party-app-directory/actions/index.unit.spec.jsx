// Node modules.
import { expect } from 'chai';
// Relative imports.
import {
  fetchResultsAction,
  fetchResultsFailure,
  fetchResultsSuccess,
} from './index';
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
} from '../constants';

describe('Actions', () => {
  describe('fetchResultsAction', () => {
    it('should return an action in the shape we expect', () => {
      const options = {
        category: 'Health',
        hideFetchingState: true,
        platform: 'iOS',
      };
      const action = fetchResultsAction(options);

      expect(action).to.be.deep.equal({
        options,
        type: FETCH_RESULTS,
      });
    });
  });

  describe('fetchResultsFailure', () => {
    it('should return an action in the shape we expect', () => {
      const action = fetchResultsFailure('test');

      expect(action).to.be.deep.equal({
        error: 'test',
        type: FETCH_RESULTS_FAILURE,
      });
    });
  });

  describe('fetchResultsSuccess', () => {
    it('should return an action in the shape we expect', () => {
      const response = {
        results: [],
        totalResults: 0,
      };
      const action = fetchResultsSuccess(response);

      expect(action).to.be.deep.equal({
        response,
        type: FETCH_RESULTS_SUCCESS,
      });
    });
  });
});

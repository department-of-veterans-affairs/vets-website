// Dependencies.
import { expect } from 'chai';
// Relative imports.
import {
  fetchFormsAction,
  fetchFormsFailure,
  fetchFormsSuccess,
} from '../../actions';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
} from '../../constants';

describe('Find VA Forms actions', () => {
  describe('fetchFormsAction', () => {
    it('should return an action in the shape we expect', () => {
      const query = 'some text';
      const result = fetchFormsAction(query);

      expect(result).to.be.deep.equal({
        type: FETCH_FORMS,
        query,
      });
    });
  });

  describe('fetchFormsFailure', () => {
    it('should return an action in the shape we expect', () => {
      const result = fetchFormsFailure();

      expect(result).to.be.deep.equal({
        type: FETCH_FORMS_FAILURE,
      });
    });
  });

  describe('fetchFormsSuccess', () => {
    it('should return an action in the shape we expect', () => {
      const results = [];
      const result = fetchFormsSuccess();

      expect(result).to.be.deep.equal({
        results,
        type: FETCH_FORMS_SUCCESS,
      });
    });
  });
});

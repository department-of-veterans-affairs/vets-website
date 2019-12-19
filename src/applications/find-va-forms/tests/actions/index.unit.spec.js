// Dependencies.
import { expect } from 'chai';
import sinon from 'sinon';

// Relative imports.
import {
  fetchFormsAction,
  fetchFormsFailure,
  fetchFormsSuccess,
  fetchFormsThunk,
} from '../../actions';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  UPDATE_PAGINATION,
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
      const results = {};
      const result = fetchFormsSuccess(results);

      expect(result).to.be.deep.equal({
        results,
        type: FETCH_FORMS_SUCCESS,
      });
    });
  });

  describe('fetchFormsThunk', () => {
    let mockedLocation;
    let mockedHistory;

    beforeEach(() => {
      mockedLocation = {
        search: '',
        pathname: '',
      };

      mockedHistory = {
        replaceState: sinon.stub(),
      };
    });

    it('updates search params', async () => {
      const dispatch = () => {};
      const query = 'health';
      const thunk = fetchFormsThunk(query, mockedLocation, mockedHistory);

      await thunk(dispatch);

      const replaceStateStub = mockedHistory.replaceState;

      expect(replaceStateStub.calledOnce).to.be.true;
      expect(replaceStateStub.firstCall.args[2]).to.be.equal('?q=health');
    });

    it('calls dispatch', async () => {
      const dispatch = sinon.stub();
      const query = 'health';
      const thunk = fetchFormsThunk(query, mockedLocation, mockedHistory);

      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: FETCH_FORMS,
          query,
        }),
      ).to.be.true;

      expect(
        dispatch.secondCall.calledWith({
          page: 1,
          startIndex: 0,
          type: UPDATE_PAGINATION,
        }),
      ).to.be.true;

      const thirdCallAction = dispatch.thirdCall.args[0];
      expect(thirdCallAction.type).to.be.equal(FETCH_FORMS_SUCCESS);
      expect(thirdCallAction.results).to.be.an('array');
    });
  });
});

// Dependencies.
import { expect } from 'chai';
import sinon from 'sinon';
// Relative imports.
import {
  fetchResultsAction,
  fetchResultsFailure,
  fetchResultsSuccess,
  fetchResultsThunk,
  updatePaginationAction,
  updateResultsAction,
} from '../../actions';
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  UPDATE_PAGINATION,
  UPDATE_RESULTS,
} from '../../constants';

describe('Find VA Results actions', () => {
  describe('fetchResultsAction', () => {
    it('should return an action in the shape we expect', () => {
      const query = 'some text';
      const action = fetchResultsAction(query);

      expect(action).to.be.deep.equal({
        type: FETCH_RESULTS,
        query,
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
      const results = [];
      const action = fetchResultsSuccess(results);

      expect(action).to.be.deep.equal({
        results,
        type: FETCH_RESULTS_SUCCESS,
      });
    });
  });

  describe('updateResultsAction', () => {
    it('should return an action in the shape we expect', () => {
      const results = [];
      const action = updateResultsAction(results);

      expect(action).to.be.deep.equal({
        results,
        type: UPDATE_RESULTS,
      });
    });
  });

  describe('updatePaginationAction', () => {
    it('should return an action in the shape we expect', () => {
      const action = updatePaginationAction();

      expect(action).to.be.deep.equal({
        page: 1,
        startIndex: 0,
        type: UPDATE_PAGINATION,
      });
    });
  });

  describe('fetchResultsThunk', () => {
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
      const thunk = fetchResultsThunk(query, {
        location: mockedLocation,
        history: mockedHistory,
        mockRequest: true,
      });

      await thunk(dispatch);

      const replaceStateStub = mockedHistory.replaceState;

      expect(replaceStateStub.calledOnce).to.be.true;
      expect(replaceStateStub.firstCall.args[2]).to.be.equal('?q=health');
    });

    it('calls dispatch', async () => {
      const dispatch = sinon.stub();
      const query = 'health';
      const thunk = fetchResultsThunk(query, {
        location: mockedLocation,
        history: mockedHistory,
        mockRequest: true,
      });

      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: FETCH_RESULTS,
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
      expect(thirdCallAction.type).to.be.equal(FETCH_RESULTS_SUCCESS);
      expect(thirdCallAction.results).to.be.an('array');
    });
  });
});

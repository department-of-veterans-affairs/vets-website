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
  updatePageAction,
} from './index';
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  UPDATE_PAGINATION,
  UPDATE_PAGE,
} from '../constants';

describe('Find VA Results actions', () => {
  describe('fetchResultsAction', () => {
    it('should return an action in the shape we expect', () => {
      const options = {
        hideFetchingState: true,
        name: 'boulder',
        state: 'CO',
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

  describe('updatePageAction', () => {
    it('should return an action in the shape we expect', () => {
      const page = 1;
      const action = updatePageAction(page);

      expect(action).to.be.deep.equal({
        page,
        type: UPDATE_PAGE,
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

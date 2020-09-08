// Node modules.
import { expect } from 'chai';
import sinon from 'sinon';
// Relative imports.
import {
  fetchResultsAction,
  fetchResultsFailure,
  fetchResultsSuccess,
  fetchResultsThunk,
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
      const thunk = fetchResultsThunk({
        category: 'Health',
        platform: 'iOS',
        hideFetchingState: false,
        history: mockedHistory,
        location: mockedLocation,
        mockRequest: true,
        page: 1,
        perPage: 10,
      });

      await thunk(dispatch);

      const replaceStateStub = mockedHistory.replaceState;

      expect(replaceStateStub.calledOnce).to.be.true;
      expect(replaceStateStub.firstCall.args[2]).to.be.equal(
        '?category=Health&platform=iOS',
      );
    });

    it('calls dispatch', async () => {
      const dispatch = sinon.stub();
      const thunk = fetchResultsThunk({
        category: 'Health',
        platform: 'iOS',
        hideFetchingState: false,
        history: mockedHistory,
        location: mockedLocation,
        mockRequest: true,
        page: 1,
        perPage: 10,
      });

      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          options: {
            category: 'Health',
            platform: 'iOS',
            hideFetchingState: false,
            page: 1,
          },
          type: FETCH_RESULTS,
        }),
      ).to.be.true;

      const secondCallAction = dispatch.secondCall.args[0];
      expect(secondCallAction.type).to.be.oneOf([
        FETCH_RESULTS_SUCCESS,
        FETCH_RESULTS_FAILURE,
      ]);
    });
  });
});

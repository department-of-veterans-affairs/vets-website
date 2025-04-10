// Dependencies.
import { expect } from 'chai';
import sinon from 'sinon';
// Relative imports.
import { apiRequest } from 'platform/utilities/api';
import {
  fetchResultsAction,
  fetchResultsFailure,
  fetchResultsSuccess,
  fetchResultsThunk,
} from '.';
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
} from '../constants';

describe('Yellow Ribbon actions', () => {
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

  describe('fetchResultsThunk', () => {
    let mockedLocation;
    let mockedHistory;
    let updateQueryParamsStub;
    let apiRequestStub;

    beforeEach(() => {
      mockedLocation = {
        search: '',
        pathname: '',
      };

      mockedHistory = {
        replaceState: sinon.stub(),
      };

      const queryParams = new URLSearchParams(mockedLocation.search);

      apiRequestStub = sinon.stub(apiRequest, 'default').resolves({
        data: {
          results: [],
          totalResults: 0,
        },
      });

      updateQueryParamsStub = sinon.stub(queryParams, 'updateQuery').returns();
    });

    afterEach(() => {
      apiRequestStub.restore();
      updateQueryParamsStub.restore();
    });

    it('updates search params', async () => {
      const dispatch = () => {};
      const thunk = fetchResultsThunk({
        city: 'boulder',
        hideFetchingState: false,
        history: mockedHistory,
        location: mockedLocation,
        mockRequest: true,
        name: 'university',
        page: 1,
        perPage: 10,
        state: 'CO',
      });

      await thunk(dispatch);

      const replaceStateStub = mockedHistory.replaceState;

      expect(replaceStateStub.calledOnce).to.be.true;
      expect(replaceStateStub.firstCall.args[2]).to.be.equal(
        '?city=boulder&name=university&state=CO',
      );
    });

    it('calls dispatch', async () => {
      const dispatch = sinon.stub();
      const thunk = fetchResultsThunk({
        city: 'boulder',
        contributionAmount: 'unlimited',
        hideFetchingState: false,
        history: mockedHistory,
        location: mockedLocation,
        mockRequest: true,
        name: 'university',
        numberOfStudents: 'unlimited',
        page: 1,
        perPage: 10,
        state: 'CO',
      });

      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          options: {
            city: 'boulder',
            contributionAmount: 'unlimited',
            hideFetchingState: false,
            name: 'university',
            numberOfStudents: 'unlimited',
            page: 1,
            state: 'CO',
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

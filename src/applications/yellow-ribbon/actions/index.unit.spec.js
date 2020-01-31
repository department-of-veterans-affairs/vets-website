// Dependencies.
import { expect } from 'chai';
import sinon from 'sinon';
// Relative imports.
import {
  fetchResultsAction,
  fetchResultsFailure,
  fetchResultsSuccess,
  fetchResultsThunk,
  updatePageAction,
  addSchoolToCompareAction,
} from './index';
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  UPDATE_PAGE,
  ADD_SCHOOL_TO_COMPARE,
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

  describe('addSchoolToCompareAction', () => {
    it('should return an action in the shape we expect', () => {
      const school = {
        id: 'asdf',
        name: 'qwer',
      };
      const action = addSchoolToCompareAction(school);

      expect(action).to.be.deep.equal({
        school,
        type: ADD_SCHOOL_TO_COMPARE,
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
      const thunk = fetchResultsThunk({
        hideFetchingState: false,
        history: mockedHistory,
        location: mockedLocation,
        mockRequest: true,
        name: 'boulder',
        page: 1,
        perPage: 10,
        state: 'CO',
      });

      await thunk(dispatch);

      const replaceStateStub = mockedHistory.replaceState;

      expect(replaceStateStub.calledOnce).to.be.true;
      expect(replaceStateStub.firstCall.args[2]).to.be.equal(
        '?name=boulder&state=CO',
      );
    });

    it('calls dispatch', async () => {
      const dispatch = sinon.stub();
      const thunk = fetchResultsThunk({
        history: mockedHistory,
        location: mockedLocation,
        mockRequest: true,
        hideFetchingState: false,
        name: 'boulder',
        state: 'CO',
        page: 1,
        perPage: 10,
      });

      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          options: {
            hideFetchingState: false,
            name: 'boulder',
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

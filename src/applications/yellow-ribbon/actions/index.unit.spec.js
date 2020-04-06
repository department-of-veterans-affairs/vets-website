// Dependencies.
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
    test('should return an action in the shape we expect', () => {
      const options = {
        hideFetchingState: true,
        name: 'boulder',
        state: 'CO',
      };
      const action = fetchResultsAction(options);

      expect(action).toEqual({
        options,
        type: FETCH_RESULTS,
      });
    });
  });

  describe('fetchResultsFailure', () => {
    test('should return an action in the shape we expect', () => {
      const action = fetchResultsFailure('test');

      expect(action).toEqual({
        error: 'test',
        type: FETCH_RESULTS_FAILURE,
      });
    });
  });

  describe('fetchResultsSuccess', () => {
    test('should return an action in the shape we expect', () => {
      const response = {
        results: [],
        totalResults: 0,
      };
      const action = fetchResultsSuccess(response);

      expect(action).toEqual({
        response,
        type: FETCH_RESULTS_SUCCESS,
      });
    });
  });

  describe('addSchoolToCompareAction', () => {
    test('should return an action in the shape we expect', () => {
      const school = {
        id: 'asdf',
        name: 'qwer',
      };
      const action = addSchoolToCompareAction(school);

      expect(action).toEqual({
        school,
        type: ADD_SCHOOL_TO_COMPARE,
      });
    });
  });

  describe('updatePageAction', () => {
    test('should return an action in the shape we expect', () => {
      const page = 1;
      const action = updatePageAction(page);

      expect(action).toEqual({
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

    test('updates search params', async () => {
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

      expect(replaceStateStub.calledOnce).toBe(true);
      expect(replaceStateStub.firstCall.args[2]).toBe(
        '?city=boulder&name=university&state=CO',
      );
    });

    test('calls dispatch', async () => {
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
      ).toBe(true);

      const secondCallAction = dispatch.secondCall.args[0];
      expect(secondCallAction.type).to.be.oneOf([
        FETCH_RESULTS_SUCCESS,
        FETCH_RESULTS_FAILURE,
      ]);
    });
  });
});

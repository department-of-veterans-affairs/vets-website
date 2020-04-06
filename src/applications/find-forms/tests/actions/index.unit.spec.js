// Dependencies.
import sinon from 'sinon';
// Relative imports.
import {
  fetchFormsAction,
  fetchFormsFailure,
  fetchFormsSuccess,
  fetchFormsThunk,
  updatePaginationAction,
} from '../../actions';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  UPDATE_PAGINATION,
} from '../../constants';

describe('Find VA Forms actions', () => {
  describe('fetchFormsAction', () => {
    test('should return an action in the shape we expect', () => {
      const query = 'some text';
      const action = fetchFormsAction(query);

      expect(action).toEqual({
        type: FETCH_FORMS,
        query,
      });
    });
  });

  describe('fetchFormsFailure', () => {
    test('should return an action in the shape we expect', () => {
      const action = fetchFormsFailure('test');

      expect(action).toEqual({
        error: 'test',
        type: FETCH_FORMS_FAILURE,
      });
    });
  });

  describe('fetchFormsSuccess', () => {
    test('should return an action in the shape we expect', () => {
      const results = [];
      const action = fetchFormsSuccess(results);

      expect(action).toEqual({
        results,
        type: FETCH_FORMS_SUCCESS,
      });
    });
  });

  describe('updatePaginationAction', () => {
    test('should return an action in the shape we expect', () => {
      const action = updatePaginationAction();

      expect(action).toEqual({
        page: 1,
        startIndex: 0,
        type: UPDATE_PAGINATION,
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

    test('updates search params', async () => {
      const dispatch = () => {};
      const query = 'health';
      const thunk = fetchFormsThunk(query, {
        location: mockedLocation,
        history: mockedHistory,
        mockRequest: true,
      });

      await thunk(dispatch);

      const replaceStateStub = mockedHistory.replaceState;

      expect(replaceStateStub.calledOnce).toBe(true);
      expect(replaceStateStub.firstCall.args[2]).toBe('?q=health');
    });

    test('calls dispatch', async () => {
      const dispatch = sinon.stub();
      const query = 'health';
      const thunk = fetchFormsThunk(query, {
        location: mockedLocation,
        history: mockedHistory,
        mockRequest: true,
      });

      await thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          type: FETCH_FORMS,
          query,
        }),
      ).toBe(true);

      expect(
        dispatch.secondCall.calledWith({
          page: 1,
          startIndex: 0,
          type: UPDATE_PAGINATION,
        }),
      ).toBe(true);

      const thirdCallAction = dispatch.thirdCall.args[0];
      expect(thirdCallAction.type).toBe(FETCH_FORMS_SUCCESS);
      expect(Array.isArray(thirdCallAction.results)).toBe(true);
    });
  });
});

import { expect } from 'chai';
import sinon from 'sinon';
import {
  fetchFormsAction,
  fetchFormsFailure,
  fetchFormsSuccess,
  fetchFormsThunk,
  updatePaginationAction,
  updateResults,
  updateSortByPropertyName,
  updateSortByPropertyNameThunk,
} from '../../actions';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  INITIAL_SORT_STATE,
  UPDATE_HOW_TO_SORT,
  UPDATE_PAGINATION,
  UPDATE_RESULTS,
} from '../../constants';

describe('Find VA Forms actions', () => {
  describe('fetchFormsAction', () => {
    it('should return an action in the shape we expect', () => {
      const query = 'some text';
      const action = fetchFormsAction(query);

      expect(action).to.be.deep.equal({
        type: FETCH_FORMS,
        query,
      });
    });
  });

  describe('fetchFormsFailure', () => {
    it('should return an action in the shape we expect', () => {
      const action = fetchFormsFailure('test');

      expect(action).to.be.deep.equal({
        error: 'test',
        type: FETCH_FORMS_FAILURE,
      });
    });
  });

  describe('fetchFormsSuccess', () => {
    it('should return an action in the shape we expect', () => {
      const results = [];
      const hasOnlyRetiredForms = false;
      const action = fetchFormsSuccess(results, hasOnlyRetiredForms);

      expect(action).to.be.deep.equal({
        hasOnlyRetiredForms,
        results,
        type: FETCH_FORMS_SUCCESS,
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

  describe('updateResults', () => {
    it('should return an action in the shape we expect', () => {
      const results = ['test'];
      const action = updateResults(results);

      expect(action).to.be.deep.equal({
        results,
        type: UPDATE_RESULTS,
      });
    });
  });

  describe('updateSortByPropertyName', () => {
    it('should return an action in the shape we expect', () => {
      const sortByPropertyName = INITIAL_SORT_STATE;
      const action = updateSortByPropertyName(sortByPropertyName);

      expect(action).to.be.deep.equal({
        sortByPropertyName,
        type: UPDATE_HOW_TO_SORT,
      });
    });
  });

  describe('updateSortByPropertyNameThunk', () => {
    it('should return an action in the shape we expect', () => {
      const dispatch = sinon.stub();
      const sortByPropertyName = INITIAL_SORT_STATE;
      const results = ['test'];

      const thunk = updateSortByPropertyNameThunk(sortByPropertyName, results);
      thunk(dispatch);

      expect(
        dispatch.firstCall.calledWith({
          sortByPropertyName,
          type: UPDATE_HOW_TO_SORT,
        }),
      ).to.be.true;

      expect(
        dispatch.secondCall.calledWith({
          results,
          type: UPDATE_RESULTS,
        }),
      ).to.be.true;
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
      const dispatch = sinon.stub();
      const query = 'health';
      const thunk = fetchFormsThunk(query, {
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

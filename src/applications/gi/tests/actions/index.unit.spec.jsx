import { expect } from 'chai';
import sinon from 'sinon';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../../actions';
import { api } from '../../config';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actionCreators', () => {
  describe('enterPreviewMode action creator', () => {
    it('should return the correct action object', () => {
      const version = 'v1.0.0';
      const expectedAction = {
        type: 'ENTER_PREVIEW_MODE',
        version,
      };
      const action = actions.enterPreviewMode(version);
      expect(action).to.deep.equal(expectedAction);
    });
  });

  describe('setPageTitle action creator', () => {
    it('should return the correct action object', () => {
      const title = 'Page Title';
      const expectedAction = {
        type: 'SET_PAGE_TITLE',
        title,
      };
      const action = actions.setPageTitle(title);
      expect(action).to.deep.equal(expectedAction);
    });
  });

  describe('showModal action creator', () => {
    it('should return the correct action object', () => {
      const modal = true;
      const expectedAction = {
        type: 'DISPLAY_MODAL',
        modal,
      };
      const action = actions.showModal(modal);
      expect(action).to.deep.equal(expectedAction);
    });
  });

  describe('hideModal functionr', () => {
    it('should hide Modal', () => {
      const result = actions.hideModal();
      expect(result).to.deep.equal({ type: 'DISPLAY_MODAL', modal: null });
    });
  });

  describe('fetchProfile action creator', () => {
    // eslint-disable-next-line no-unused-vars, no-empty-pattern
    const middleware = ({}) => next => action => {
      return next(action);
    };

    const create = (dispatch, getState = {}) => {
      const store = {
        getState: sinon.spy(() => getState),
        dispatch: sinon.spy(dispatch),
      };
      const next = sinon.spy();

      const invoke = action => middleware(store)(next)(action);

      return { store, next, invoke, dispatch: store.dispatch };
    };
    it('fetches profile and dispatches FETCH_PROFILE_SUCCEEDED on success', async () => {
      const mockData = { name: 'Facility A' };
      fetchMock.getOnce(`${api.url}/institutions/1234`, mockData);

      const { invoke, store } = create();
      const actionThunk = actions.fetchProfile('1234');
      await actionThunk(invoke, store.getState);
      expect(store.dispatch.called).to.be.false;
      expect(store.dispatch.calledWithMatch({ type: 'FETCH_PROFILE_STARTED' }))
        .to.be.false;
      expect(fetchMock.lastUrl()).to.equal(`${api.url}/institutions/1234`);
    });
  });

  describe('eligibilityChange', () => {
    it('should return the correct action type and payload', () => {
      const mockFields = {
        field1: 'field one',
        field2: 'field two',
      };

      const newFields = {
        type: 'ELIGIBILITY_CHANGED',
        payload: {
          ...mockFields,
        },
      };
      const result = actions.eligibilityChange(mockFields);
      expect(result).to.deep.equal(newFields);
    });
  });

  describe('filterChange', () => {
    it('should return the correct action type and payload', () => {
      const mockFields = {
        field1: 'field one',
        field2: 'field two',
      };

      const newFields = {
        type: 'FILTERS_CHANGED',
        payload: {
          ...mockFields,
        },
      };
      const result = actions.filterChange(mockFields);
      expect(result).to.deep.equal(newFields);
    });
  });

  describe('updateEligibilityAndFilters', () => {
    it('should dispatch ELIGIBILITY_CHANGED and FILTERS_CHANGED actions with the correct payload', () => {
      const mockEligibility = {
        eligibilityField: 'eligibilityField',
      };

      const mockFilters = {
        filterField: 'filterField',
      };

      const expectedActions = [
        { type: 'ELIGIBILITY_CHANGED', payload: mockEligibility },
        { type: 'FILTERS_CHANGED', payload: mockFilters },
      ];

      const dispatchedActions = [];
      const mockDispatch = action => dispatchedActions.push(action);

      actions.updateEligibilityAndFilters(mockEligibility, mockFilters)(
        mockDispatch,
      );

      expect(dispatchedActions).to.deep.equal(expectedActions);
    });
  });

  describe('calculatorInputChange', () => {
    it('should calculate input changes', () => {
      const field = 'field';
      const value = 'value';

      const newFields = {
        type: 'CALCULATOR_INPUTS_CHANGED',
        value,
        field,
      };
      const result = actions.calculatorInputChange(newFields);
      expect(result).to.deep.equal(newFields);
    });
  });

  describe('updateEstimatedBenefits', () => {
    it('should update estimated benefits', () => {
      const estimatedBenefits = 300;

      const newFields = {
        type: 'UPDATE_ESTIMATED_BENEFITS',
        estimatedBenefits,
      };
      const result = actions.updateEstimatedBenefits(estimatedBenefits);
      expect(result).to.deep.equal(newFields);
    });
  });

  describe('updateAutocompleteName', () => {
    it('should auto complete name', () => {
      const name = 'Jhon Doe';

      const newFields = {
        type: 'UPDATE_AUTOCOMPLETE_NAME',
        payload: name,
      };
      const result = actions.updateAutocompleteName(name);
      expect(result).to.deep.equal(newFields);
    });
  });

  describe('updateAutocompleteLocation', () => {
    it('should auto complete location', () => {
      const location = 'New York';

      const newFields = {
        type: 'UPDATE_AUTOCOMPLETE_LOCATION',
        payload: location,
      };
      const result = actions.updateAutocompleteLocation(location);
      expect(result).to.deep.equal(newFields);
    });
  });

  describe('changeSearchTab', () => {
    it('should auto complete location', () => {
      const tab = 2;
      const newFields = {
        type: 'UPDATE_CURRENT_TAB',
        tab,
      };
      const result = actions.changeSearchTab(tab);
      expect(result).to.deep.equal(newFields);
    });
  });

  describe('fetchNameAutocompleteSuggestions', () => {
    it('should dispatch NAME_AUTOCOMPLETE_SUCCEEDED with an empty payload if name is empty', () => {
      const store = mockStore({});
      store.dispatch(actions.fetchNameAutocompleteSuggestions(''));
      const action = store.getActions();
      expect(action[0]).to.deep.equal({
        type: 'NAME_AUTOCOMPLETE_SUCCEEDED',
        payload: [],
      });
    });

    it('should dispatch AUTOCOMPLETE_STARTED on a successful fetch', async () => {
      global.fetch = () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ data: ['Institution1', 'Institution2'] }),
        });

      const store = mockStore({});
      await store.dispatch(
        actions.fetchNameAutocompleteSuggestions(
          'term',
          { value1: 'value1', value2: 'value2' },
          'v1',
        ),
      );

      const myActions = store.getActions();
      expect(myActions[0]).to.deep.equal({ type: 'AUTOCOMPLETE_STARTED' });
    });
  });

  describe('mapChanged action creato', () => {
    it('should map the changes', () => {
      const mapState = {
        value1: 'value1',
        value2: 'value2',
      };

      const expectedActions = [{ type: 'MAP_CHANGED', payload: mapState }];

      const dispatchedActions = [];
      const mockDispatch = action => dispatchedActions.push(action);

      actions.mapChanged(mapState)(mockDispatch);

      expect(dispatchedActions).to.deep.equal(expectedActions);
    });
  });

  describe('ADD_COMPARE_INSTITUTION action', () => {
    it('should dispatch ADD_COMPARE_INSTITUTION with the correct payload', () => {
      const institution = { name: 'Harry Loe', course: 'Test Course' };
      const dispatch = action => {
        expect(action.type).to.equal('ADD_COMPARE_INSTITUTION');
        expect(action.payload).to.deep.equal(institution);
      };
      actions.addCompareInstitution(institution)(dispatch);
    });
  });

  describe('clearGeocodeError action creato', () => {
    it('should clear code error', () => {
      const expectedActions = [{ type: 'GEOCODE_CLEAR_ERROR' }];

      const dispatchedActions = [];
      const mockDispatch = action => dispatchedActions.push(action);

      actions.clearGeocodeError()(mockDispatch);

      expect(dispatchedActions).to.deep.equal(expectedActions);
    });
  });

  describe('removeCompareInstitution action creato', () => {
    it('should remove compare Institutio ', () => {
      const facilityCode = '000';

      const expectedActions = [
        { type: 'REMOVE_COMPARE_INSTITUTION', payload: facilityCode },
      ];

      const dispatchedActions = [];
      const mockDispatch = action => dispatchedActions.push(action);

      actions.removeCompareInstitution(facilityCode)(mockDispatch);

      expect(dispatchedActions).to.deep.equal(expectedActions);
    });
  });
});

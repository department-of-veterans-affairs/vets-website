import { expect } from 'chai';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import mbxGeo from '@mapbox/mapbox-sdk/services/geocoding';
import * as actions from '../../actions';
import { api } from '../../config';
import { fetchSearchByLocationResults } from '../../actions';
import mapboxClient from '../../components/MapboxClient';

const mbxClient = mbxGeo(mapboxClient);
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mbxClientStub = sinon.stub(mbxClient, 'forwardGeocode').returns({
  send: sinon.stub().resolves({
    body: {
      features: [{ center: 'center' }],
    },
  }),
});

describe('actionCreators', () => {
  let originalFetch = global.fetch;
  const mockData = {
    id: 1234,
    name: 'Some Institution',
    address: '123 Some St, Some City, SO 12345',
  };
  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = (url, options) => {
      if (url === `${api.url}/institutions/1234`) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockData),
          overwriteRoutes: true,
        });
      }
      return originalFetch(url, options);
    };
  });
  afterEach(() => {
    global.fetch = originalFetch;
  });
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
    it('should exitPreviewMode', () => {
      const action = actions.exitPreviewMode();
      expect(action.type).to.eq('EXIT_PREVIEW_MODE');
    });
    it('should catch error beneficiaryZIPCodeChanged', () => {
      const beneficiaryZIP = 'abc';
      const action = actions.beneficiaryZIPCodeChanged(beneficiaryZIP);
      expect(action.type).to.eq('BENEFICIARY_ZIP_CODE_CHANGED');
    });
    it('should beneficiaryZIPCodeChanged', () => {
      const store = mockStore({});
      const beneficiaryZIP = 12345;
      const action = store.dispatch(
        actions.beneficiaryZIPCodeChanged(beneficiaryZIP),
      );
      expect(action?.type).to.eq(undefined);
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
      const response = await fetch(`${api.url}/institutions/1234`);
      const data = await response.json();
      const { invoke, store } = create();
      const actionThunk = actions.fetchProfile('1234');
      await actionThunk(invoke, store.getState);
      expect(store.dispatch.called).to.be.false;
      expect(store.dispatch.calledWithMatch({ type: 'FETCH_PROFILE_STARTED' }))
        .to.be.false;
      expect(data).to.equal(mockData);
    });
    it('should dispatch FETCH_PROFILE_SUCCEEDED on successful fetch', () => {
      const mockFetch = sinon.stub(global, 'fetch');
      const mockDispatch = sinon.spy();
      const mockGetState = sinon.stub().returns({
        constants: {
          constants: {
            AVGVABAH: 'sampleValue1',
            AVGDODBAH: 'sampleValue2',
          },
        },
      });
      const mockResponse = {
        ok: true,
        json: sinon.stub().returns(
          Promise.resolve({
            sampleInstitutionDataKey: 'sampleInstitutionDataValue',
          }),
        ),
      };

      mockFetch.resolves(mockResponse);

      return actions
        .fetchProfile('sampleFacilityCode')(mockDispatch, mockGetState)
        .then(() => {
          expect(
            mockDispatch.calledWith({
              type: 'FETCH_PROFILE_SUCCEEDED',
              payload: {
                sampleInstitutionDataKey: 'sampleInstitutionDataValue',
                AVGVABAH: 'sampleValue1',
                AVGDODBAH: 'sampleValue2',
              },
            }),
          ).to.be.true;
          mockFetch.restore();
        });
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
  describe('geolocateUser', () => {
    it('should dispatch GEOCODE_COMPLETE on successful geolocation', async () => {
      const mockQuery = { location: 'TestLocation' };
      const mockCoords = { longitude: 10, latitude: 20 };

      const getCurrentPositionStub = sinon.stub();
      getCurrentPositionStub.callsFake(success =>
        success({ coords: mockCoords }),
      );

      const searchCriteriaFromCoordsStub = sinon.stub(
        actions,
        'searchCriteriaFromCoords',
      );
      searchCriteriaFromCoordsStub.resolves(mockQuery);

      global.navigator = {
        geolocation: {
          getCurrentPosition: getCurrentPositionStub,
        },
      };

      const dispatch = sinon.stub();
      await actions.geolocateUser()(dispatch);
      expect(dispatch.calledWithExactly({ type: 'GEOLOCATE_USER' })).to.be.true;
      searchCriteriaFromCoordsStub.restore();
    });

    it('should dispatch GEOCODE_LOCATION_FAILED on geolocation failure', async () => {
      const mockError = { code: 1 };
      const getCurrentPositionStub = sinon.stub();
      const dispatch = sinon.stub();
      global.navigator = {
        geolocation: {
          getCurrentPosition: getCurrentPositionStub,
        },
      };
      getCurrentPositionStub.callsFake((_, error) => {
        error(mockError);
      });

      await actions.geolocateUser()(dispatch);
      expect(
        sinon.assert.calledWithExactly(dispatch, { type: 'GEOLOCATE_USER' }),
      );
      expect(
        sinon.assert.calledWithExactly(dispatch, {
          type: 'GEOCODE_LOCATION_FAILED',
          code: mockError.code,
        }),
      );
    });
  });

  it('should dispatch GEOCODE_LOCATION_FAILED when navigator.geolocation.getCurrentPosition is not available', () => {
    const dispatch = sinon.spy();
    global.navigator = {};

    actions.geolocateUser()(dispatch);

    expect(dispatch.calledOnce).to.be.true;
    expect(dispatch.firstCall.args[0]).to.have.property(
      'type',
      'GEOCODE_LOCATION_FAILED',
    );
    expect(dispatch.firstCall.args[0]).to.have.property('code', -1);
  });

  describe('fetchSearchByLocationCoords', () => {
    it('should dispatch SEARCH_STARTED and SEARCH_BY_NAME_SUCCEEDED on successful fetch', async () => {
      const dispatch = sinon.spy();
      const fetchStub = sinon.stub(global, 'fetch').resolves({
        ok: true,
        json: () => Promise.resolve({ someData: 'example data' }),
        statusText: 'OK',
      });
      const name = 'exampleName';
      const page = 1;
      const clonedFilters = {
        filter1: 'value1',
        excludedSchoolTypes: 'value2',
      };
      const version = 'v1';
      await actions.fetchSearchByNameResults(
        name,
        page,
        clonedFilters,
        version,
      )(dispatch);
      expect(dispatch.calledTwice).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: 'SEARCH_STARTED',
        payload: { name },
      });
      expect(dispatch.secondCall.args[0]).to.have.property(
        'type',
        'SEARCH_BY_NAME_SUCCEEDED',
      );
      expect(dispatch.secondCall.args[0]).to.have.property('payload');
      if (global.fetch.restore) {
        global.fetch.restore();
      }
      fetchStub.restore();
    });
    it('should dispatch SEARCH_STARTED and SEARCH_FAILED on failed fetch', async () => {
      const dispatch = sinon.spy();
      const fetchStub = sinon.stub(global, 'fetch').resolves({
        ok: false,
        statusText: 'Not Found',
      });
      const name = 'exampleName';
      const page = 1;
      const filters = { filter1: 'value1', excludedSchoolTypes: 'value2' };
      const version = 'v1';

      await actions.fetchSearchByNameResults(name, page, filters, version)(
        dispatch,
      );
      expect(dispatch.calledTwice).to.be.true;
      expect(dispatch.firstCall.args[0]).to.deep.equal({
        type: 'SEARCH_STARTED',
        payload: { name },
      });
      expect(dispatch.secondCall.args[0]).to.have.property(
        'type',
        'SEARCH_FAILED',
      );
      expect(dispatch.secondCall.args[0]).to.have.property(
        'payload',
        'Not Found',
      );
      if (global.fetch.restore) {
        global.fetch.restore();
      }
      fetchStub.restore();
    });
    it('should dispatch NAME_AUTOCOMPLETE_SUCCEEDED on successful fetch', () => {
      const mockFetch = sinon.stub(global, 'fetch');
      const mockDispatch = sinon.spy();

      const mockResponse = {
        ok: true,
        json: sinon.stub().returns(
          Promise.resolve({
            filter1: 'value1',
            excludedSchoolTypes: 'value2',
          }),
        ),
      };

      mockFetch.resolves(mockResponse);

      return actions
        .fetchSearchByLocationCoords(
          'sampleLocation',
          [0, 0],
          10,
          { filter1: 'value1', excludedSchoolTypes: 'value2' },
          'version',
        )(mockDispatch)
        .then(() => {
          expect(
            mockDispatch.calledWith({
              type: 'NAME_AUTOCOMPLETE_SUCCEEDED',
              payload: { filter1: 'value1', excludedSchoolTypes: 'value2' },
            }),
          ).to.be.false;
          mockFetch.restore();
        });
    });

    it('should dispatch SEARCH_FAILED on fetch error with error title', () => {
      const mockFetch = sinon.stub(global, 'fetch');
      const mockDispatch = sinon.spy();

      const mockErrorResponse = {
        ok: false,
        json: sinon
          .stub()
          .returns(Promise.resolve({ errors: [{ title: 'Sample Error' }] })),
      };

      mockFetch.resolves(mockErrorResponse);

      return actions
        .fetchSearchByLocationCoords(
          'sampleLocation',
          [0, 0],
          10,
          { filter1: 'value1', excludedSchoolTypes: 'value2' },
          'version',
        )(mockDispatch)
        .then(() => {
          expect(
            mockDispatch.calledWith({
              type: 'SEARCH_FAILED',
              payload: 'Some Error',
            }),
          ).to.be.false;
          mockFetch.restore();
        });
    });
  });

  describe('fetchCompareDetails', () => {
    it('should dispatch UPDATE_COMPARE_DETAILS on successful fetch', async () => {
      const dispatch = sinon.spy();

      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ data: { someData: 'some data' } }),
        statusText: 'OK',
      };

      const fetchStub = sinon.stub(global, 'fetch').resolves(mockResponse);

      const facilityCodes = 'some codes';
      const filters = { filter1: 'value1', excludedSchoolTypes: 'value2' };
      const version = 'v1';

      await actions.fetchCompareDetails(facilityCodes, filters, version)(
        dispatch,
      );

      expect(fetchStub.calledOnce).to.be.true;
      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.have.property(
        'type',
        'UPDATE_COMPARE_DETAILS',
      );
      expect(dispatch.firstCall.args[0]).to.have.property('payload');
      fetchStub.restore();
    });

    it('should dispatch FETCH_COMPARE_FAILED on failed fetch', async () => {
      const dispatch = sinon.spy();

      const mockResponse = {
        ok: false,
        statusText: 'Not Found',
      };
      const fetchStub = sinon.stub(global, 'fetch').resolves(mockResponse);

      const facilityCodes = 'some codes';
      const filters = { filter1: 'value1', excludedSchoolTypes: 'value2' };
      const version = 'v1';

      await actions.fetchCompareDetails(facilityCodes, filters, version)(
        dispatch,
      );
      expect(fetchStub.calledOnce).to.be.true;
      expect(dispatch.calledOnce).to.be.true;
      expect(dispatch.firstCall.args[0]).to.have.property(
        'type',
        'FETCH_COMPARE_FAILED',
      );
      expect(dispatch.firstCall.args[0]).to.have.property(
        'payload',
        'Not Found',
      );
      fetchStub.restore();
    });
  });

  describe('fetchConstants', () => {
    it('should dispatch FETCH_CONSTANTS_SUCCEEDED when the API call is successful', async () => {
      const mockDispatch = sinon.spy();

      const response = await fetch(`${api.url}/institutions/1234`);
      const data = await response.json();
      actions
        .fetchConstants()(mockDispatch)
        .then(() => {
          expect(mockDispatch.calledTwice).to.be.true;
          expect(mockDispatch.firstCall.args[0]).to.eql({
            type: 'FETCH_CONSTANTS_STARTED',
          });
          expect(mockDispatch.secondCall.args[0]).to.eql({
            type: 'FETCH_CONSTANTS_SUCCEEDED',
            payload: data,
          });
        });
    });
    it('should dispatch FETCH_CONSTANTS_FAILED when the API call fails', async () => {
      global.fetch = (url, options) => {
        if (url === `${api.url}/calculator_constants`) {
          return Promise.resolve({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
          });
        }
        if (url === `${api.url}/institutions/1234`) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockData),
          });
        }

        return originalFetch(url, options);
      };
      const response = await fetch(`${api.url}/calculator_constants`);

      expect(response.ok).to.equal(false);
      expect(response.status).to.equal(500);
      expect(response.statusText).to.equal('Internal Server Error');

      const mockDispatch = sinon.spy();
      actions
        .fetchConstants()(mockDispatch)
        .then(() => {
          expect(mockDispatch.calledTwice).to.be.true;
          expect(mockDispatch.firstCall.args[0]).to.eql({
            type: 'FETCH_CONSTANTS_STARTED',
          });
          expect(mockDispatch.secondCall.args[0].type).to.equal(
            'FETCH_CONSTANTS_FAILED',
          );
        });
    });
  });

  describe('fetchSearchByLocationResults', () => {
    const dispatchSpy = sinon.spy();
    it('should handle geocode success', async () => {
      await fetchSearchByLocationResults('12345', 'distance', {}, 'version')(
        dispatchSpy,
      );
      expect(
        dispatchSpy.calledWith({
          type: 'GEOCODE_STARTED',
          payload: { location: '12345', distance: 'distance' },
        }),
      ).to.be.true;
      expect(
        dispatchSpy.calledWith({
          type: 'GEOCODE_SUCCEEDED',
          payload: [{ center: 'center' }],
        }),
      ).to.be.false;
      mbxClientStub.restore();
    });
  });
  describe('fetchLocationAutocompleteSuggestions', () => {
    let dispatchSpy;
    beforeEach(() => {
      dispatchSpy = sinon.spy();
    });

    afterEach(() => {
      mbxClientStub.restore();
    });
    it('should dispatch LOCATION_AUTOCOMPLETE_SUCCEEDED with empty payload for empty location', () => {
      const action = actions.fetchLocationAutocompleteSuggestions('');
      expect(action.type).to.equal('LOCATION_AUTOCOMPLETE_SUCCEEDED');
      expect(action.payload).to.deep.equal([]);
    });
    it('should handle geocode success', async () => {
      mbxClientStub.returns({
        send: sinon.stub().resolves({
          body: {
            features: ['Feature1', 'Feature2'],
          },
        }),
      });

      await actions.fetchLocationAutocompleteSuggestions('12345')(dispatchSpy);

      expect(dispatchSpy.calledWith({ type: 'AUTOCOMPLETE_STARTED' })).to.be
        .true;
      expect(
        dispatchSpy.calledWith({
          type: 'LOCATION_AUTOCOMPLETE_SUCCEEDED',
          payload: ['Feature1', 'Feature2'],
        }),
      ).to.be.false;
    });
    it('should handle geocode failure', async () => {
      mbxClientStub.returns({
        send: sinon.stub().rejects(new Error('Geocode error')),
      });

      await actions.fetchLocationAutocompleteSuggestions('12345')(dispatchSpy);

      expect(dispatchSpy.calledWith({ type: 'AUTOCOMPLETE_STARTED' })).to.be
        .true;
      expect(
        dispatchSpy.calledWith({
          type: 'AUTOCOMPLETE_FAILED',
          payload: 'Geocode error',
        }),
      ).to.be.false;
    });
  });
  it('creates FETCH_PROFILE_FAILED when fetching profile has failed', () => {
    const fetchStub = sinon.stub(global, 'fetch');
    const errorMessage = 'Not Found';
    const response = new Response(null, {
      status: 404,
      statusText: errorMessage,
    });

    fetchStub.returns(Promise.resolve(response));

    const expectedActions = [
      { type: 'FETCH_PROFILE_STARTED' },
      { type: 'FETCH_PROFILE_FAILED', payload: errorMessage },
    ];

    const store = mockStore({
      constants: { constants: { AVGVABAH: '', AVGDODBAH: '' } },
    });

    return store
      .dispatch(actions.fetchProfile('http://example.com/profile'))
      .then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      })
      .catch(() => {});
  });
  it('creates FETCH_CONSTANTS_STARTED when fetching profile has failed', () => {
    const fetchStub = sinon.stub(global, 'fetch');
    const errorMessage = 'Not Found';
    const response = new Response(null, {
      status: 404,
      statusText: errorMessage,
    });

    fetchStub.returns(Promise.resolve(response));

    const expectedActions = [
      { type: 'FETCH_CONSTANTS_STARTED' },
      { type: 'FETCH_PROFILE_FAILED', payload: errorMessage },
    ];

    const store = mockStore({
      constants: { constants: { AVGVABAH: '', AVGDODBAH: '' } },
    });

    return store
      .dispatch(actions.fetchConstants('http://example.com/profile'))
      .then(() => {
        expect(store.getActions()).to.eql(expectedActions);
      })
      .catch(() => {});
  });
  it('dispatches FETCH_BAH_FAILED when server returns an error', () => {
    const store = mockStore({});
    const fetchStub = sinon.stub(global, 'fetch');
    const mockErrorResponse = {
      errors: [{ title: 'Invalid ZIP Code' }],
    };
    const mockResponse = new Response(JSON.stringify(mockErrorResponse), {
      status: 422,
      headers: { 'Content-type': 'application/json' },
    });

    fetchStub.returns(Promise.resolve(mockResponse));
    return store.dispatch(actions.beneficiaryZIPCodeChanged('12345'));
  });
  it('filterBeforeResults should create an action to filter before results', () => {
    const expectedAction = {
      type: actions.FILTER_BEFORE_RESULTS,
    };
    expect(actions.filterBeforeResultFlag()).to.deep.equal(expectedAction);
  });
});

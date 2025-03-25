<<<<<<< HEAD
=======
import * as apiModule from '@department-of-veterans-affairs/platform-utilities/api';
import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
>>>>>>> main
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
<<<<<<< HEAD
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import YourVAHealthFacilityPage from '../../containers/YourVAHealthFacility';
import { mockHealthFacilityResponse } from '../../utils/mockData';

describe('YourVAHealthFacilityPage', () => {
  const mockStore = configureStore([]);
  let store;
  let props;
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, 'fetch');
=======
import { combineReducers, createStore } from 'redux';
import configureStore from 'redux-mock-store';
import sinon from 'sinon';
import * as geoLocateUser from '../../actions/geoLocateUser';
import * as constants from '../../constants';
import YourVAHealthFacilityPage from '../../containers/YourVAHealthFacility';
import askVaReducer from '../../reducers';
import * as mapboxModule from '../../utils/mapbox';
import { mockHealthFacilityResponse } from '../../utils/mockData';

const mockLocationResponse = {
  zipCode: [{ text: '90210' }],
};

describe('YourVAHealthFacilityPage', () => {
  const mockStore = configureStore([]);
  let store;
  let storeWithRealReducers;
  let props;
  let apiRequestStub;
  let convertLocationStub;
  let convertToLatLngStub;
  let dispatchSpy;

  beforeEach(() => {
>>>>>>> main
    props = {
      data: {},
      setFormData: sinon.spy(),
      goBack: sinon.spy(),
      goForward: sinon.spy(),
    };

    store = mockStore({
      askVA: {
        currentUserLocation: null,
        searchLocationInput: '',
        getLocationInProgress: false,
        getLocationError: false,
        facilityData: null,
        validationError: null,
      },
<<<<<<< HEAD
    });
  });

  afterEach(() => {
    fetchStub.restore();
    store.clearActions();
=======
      navigation: {
        route: {
          path: '',
        },
      },
    });

    const reducers = combineReducers({
      ...askVaReducer,
      navigation: (state = { route: { path: '' } }) => state,
    });
    storeWithRealReducers = createStore(reducers);

    dispatchSpy = sinon.spy(storeWithRealReducers, 'dispatch');
    apiRequestStub = sinon.stub(apiModule, 'apiRequest');
    convertLocationStub = sinon.stub(mapboxModule, 'convertLocation');
    convertToLatLngStub = sinon.stub(mapboxModule, 'convertToLatLng');
  });

  afterEach(() => {
    store.clearActions();
    dispatchSpy.restore();
    apiRequestStub.restore();
    convertLocationStub.restore();
    convertToLatLngStub.restore();
>>>>>>> main
  });

  const renderWithStore = (customState = {}) => {
    if (Object.keys(customState).length) {
      store = mockStore({
        askVA: {
          ...store.getState().askVA,
          ...customState,
        },
<<<<<<< HEAD
=======
        navigation: {
          route: {
            path: '/test-path',
          },
        },
>>>>>>> main
      });
    }
    return mount(
      <Provider store={store}>
        <YourVAHealthFacilityPage {...props} />
      </Provider>,
    );
  };

<<<<<<< HEAD
=======
  const renderWithStoreRTL = (customState = {}) => {
    if (Object.keys(customState).length) {
      storeWithRealReducers = mockStore({
        askVA: {
          ...storeWithRealReducers.getState().askVA,
          ...customState,
        },
        navigation: {
          route: {
            path: '/test-path',
          },
        },
      });
    }
    return render(
      <Provider store={storeWithRealReducers}>
        <YourVAHealthFacilityPage {...props} />
      </Provider>,
    );
  };

>>>>>>> main
  it('should render the component correctly', () => {
    const wrapper = renderWithStore();

    expect(wrapper.find('h3').exists()).to.be.true;
    expect(
      wrapper
        .find('h3')
        .first()
        .text(),
    ).to.equal('Your VA health facility');

    wrapper.unmount();
  });

<<<<<<< HEAD
  it('should handle search submission', async () => {
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockHealthFacilityResponse),
    });

    const wrapper = renderWithStore();

    wrapper.find('input#street-city-state-zip').simulate('change', {
      target: { value: 'Test Location' },
    });
    store.dispatch({ type: 'SET_SEARCH_INPUT', payload: 'Test Location' });

    wrapper.find('form').simulate('submit', { preventDefault: () => {} });

    const actions = store.getActions();
    expect(actions.some(action => action.type === 'SET_SEARCH_INPUT')).to.be
      .true;

    wrapper.unmount();
  });

=======
>>>>>>> main
  it('should handle use my location button click', () => {
    const wrapper = renderWithStore({
      getLocationInProgress: true,
    });

    wrapper.find('.use-my-location-link').simulate('click');
    wrapper.update();

    expect(wrapper.find('va-loading-indicator')).to.have.lengthOf(1);
    wrapper.unmount();
  });

<<<<<<< HEAD
  it('should display facility results after successful search', async () => {
    fetchStub.resolves({
      ok: true,
      json: () => Promise.resolve(mockHealthFacilityResponse),
    });

    const wrapper = renderWithStore({
      searchLocationInput: 'Test Location',
      facilityData: mockHealthFacilityResponse,
    });

    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();

    const storeState = store.getState().askVA;

    expect(storeState.facilityData).to.deep.equal(mockHealthFacilityResponse);

    wrapper.unmount();
  });

  it('should display error message when no location entered', async () => {
    const wrapper = renderWithStore();

    const searchInput = wrapper.find('input#street-city-state-zip');
    expect(searchInput.exists()).to.be.true;
    expect(searchInput.props().value).to.equal('');

    const searchButton = wrapper.find('#facility-search');
    expect(searchButton.exists()).to.be.true;
    searchButton.simulate('click');

    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();

    const requiredSpan = wrapper.find('.form-required-span');
    expect(requiredSpan.exists()).to.be.true;
    expect(requiredSpan.text()).to.equal('(*Required)');

    const inputLabel = wrapper.find('#street-city-state-zip-label');
    expect(inputLabel.exists()).to.be.true;
    expect(inputLabel.text()).to.include('(*Required)');

    wrapper.unmount();
=======
  it('should return facilities after entering a postal code', async () => {
    apiRequestStub.resolves(mockHealthFacilityResponse);
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);

    const { container, getByRole } = renderWithStoreRTL();
    const input = getByRole('searchbox');

    expect(input).to.exist;
    expect(input.value).to.equal('');

    userEvent.type(input, '78750');
    expect(input.value).to.equal('78750');

    userEvent.click(getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(apiRequestStub.called).to.be.true;
      const radio = container.querySelector(
        'va-radio[label="Select VA health facility"]',
      );
      expect(radio).to.exist;
      const option = container.querySelector(
        'va-radio-option[value="vba_349b - VA Regional Benefit Satellite Office at Austin VA Clinic, Austin, TX 78744"]',
      );
      expect(option).to.exist;
      radio.__events.vaValueChange({
        detail: {
          value:
            'vba_349b - VA Regional Benefit Satellite Office at Austin VA Clinic, Austin, TX 78744',
        },
        target: {
          textContent:
            'VA Regional Benefit Satellite Office at Austin VA Clinic, Austin, TX 78744',
        },
      });
      expect(dispatchSpy.firstCall.args[0]).to.deep.equal({
        type: 'SET_LOCATION_SEARCH',
        payload: '78750',
      });
      expect(dispatchSpy.secondCall.args[0]).to.deep.equal({
        type: 'SET_VA_HEALTH_FACILITY',
        payload:
          'VA Regional Benefit Satellite Office at Austin VA Clinic, Austin, TX 78744',
      });
    });
  });

  it('should get facilities from location', async () => {
    apiRequestStub.resolves(mockHealthFacilityResponse);
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);
    const geoLocateUserStub = sinon.stub(geoLocateUser, 'geoLocateUser');
    geoLocateUserStub.callsFake(async dispatch => {
      return dispatch({
        type: geoLocateUser.GEOCODE_COMPLETE,
        payload: [0, 0],
      });
    });

    const { container } = renderWithStoreRTL({
      currentUserLocation: [0, 0],
    });

    const locationButton = container.querySelector('.use-my-location-link');
    userEvent.click(locationButton);

    await waitFor(() => {
      expect(apiRequestStub.called).to.be.true;
      const radio = container.querySelector(
        'va-radio[label="Select VA health facility"]',
      );
      expect(radio).to.exist;
      const option = container.querySelector(
        'va-radio-option[value="vba_349b - VA Regional Benefit Satellite Office at Austin VA Clinic, Austin, TX 78744"]',
      );
      expect(option).to.exist;
    });
    geoLocateUserStub.restore();
  });

  it('should return mock facilities if mockTestingFlagforAPI is enabled', async () => {
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);
    const mockTestingFlagStub = sinon
      .stub(constants, 'getMockTestingFlagforAPI')
      .returns(true);

    const { container, getByRole } = renderWithStoreRTL();
    const input = getByRole('searchbox');

    expect(input).to.exist;
    expect(input.value).to.equal('');

    userEvent.type(input, '78750');
    expect(input.value).to.equal('78750');

    const button = container.querySelector('#facility-search');
    userEvent.click(button);
    await waitFor(() => {
      const radio = container.querySelector(
        'va-radio[label="Select VA health facility"]',
      );
      expect(radio).to.exist;
      const option = container.querySelector(
        'va-radio-option[value="vba_349b - VA Regional Benefit Satellite Office at Austin VA Clinic, Austin, TX 78744"]',
      );
      expect(option).to.exist;
    });
    mockTestingFlagStub.restore();
  });

  it('should display validation error if no city or postal code provided', async () => {
    apiRequestStub.resolves(mockHealthFacilityResponse);
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);

    const { getByRole, getByText } = renderWithStoreRTL();

    userEvent.click(getByRole('button', { name: /continue/i }));
    await waitFor(() => {
      expect(getByText(/please fill in a city or facility name/i)).to.exist;
    });
  });

  it('should display validation error if no facility selected', async () => {
    apiRequestStub.resolves(mockHealthFacilityResponse);
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);

    const { container, getByRole } = renderWithStoreRTL();
    userEvent.type(getByRole('searchbox'), '78750');

    userEvent.click(getByRole('button', { name: /search/i }));
    await waitFor(() => {
      const radio = container.querySelector(
        'va-radio[label="Select VA health facility"]',
      );
      expect(radio).to.exist;
    });

    userEvent.click(getByRole('button', { name: /continue/i }));
    await waitFor(() => {
      const radioWithError = container.querySelector(
        'va-radio[label="Select VA health facility"][error]',
      );
      expect(radioWithError).to.exist;
    });
  });

  it('should display validation error if no city or postal code provided and focus on input', async () => {
    apiRequestStub.resolves(mockHealthFacilityResponse);
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);
    const focusElementSpy = sinon.spy(document, 'querySelector');

    const { getByRole } = renderWithStoreRTL({
      searchLocationInput: '', // Empty search query
    });

    userEvent.click(getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(focusElementSpy.calledWith('#street-city-state-zip')).to.be.true;
    });

    focusElementSpy.restore();
  });

  it('should proceed forward when facility is selected', async () => {
    apiRequestStub.resolves(mockHealthFacilityResponse);
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);

    const goForwardSpy = sinon.spy();
    const { getByRole } = render(
      <Provider store={store}>
        <YourVAHealthFacilityPage
          {...props}
          data={{
            yourHealthFacility:
              'vba_349b - VA Regional Benefit Satellite Office at Austin VA Clinic, Austin, TX 78744',
          }}
          goForward={goForwardSpy}
        />
      </Provider>,
    );

    // Click continue button
    const continueButton = getByRole('button', { name: /continue/i });
    userEvent.click(continueButton);

    await waitFor(() => {
      expect(goForwardSpy.calledOnce).to.be.true;
      expect(goForwardSpy.firstCall.args[0]).to.deep.equal({
        yourHealthFacility:
          'vba_349b - VA Regional Benefit Satellite Office at Austin VA Clinic, Austin, TX 78744',
      });
    });
  });

  it('should handle API error and set isSearching to false', async () => {
    apiRequestStub.rejects(new Error('API Error'));
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);

    const { container, getByRole } = renderWithStoreRTL();

    // First verify loading is not shown
    expect(container.querySelector('va-loading-indicator')).to.not.exist;

    // Trigger a search which should show loading
    userEvent.type(getByRole('searchbox'), '78750');
    userEvent.click(getByRole('button', { name: /search/i }));

    // Loading indicator should appear
    await waitFor(() => {
      expect(container.querySelector('va-loading-indicator')).to.exist;
    });

    // Wait for the error to be handled and loading to disappear
    await waitFor(
      () => {
        expect(container.querySelector('va-loading-indicator')).to.not.exist;
      },
      { timeout: 2000 },
    );

    // Verify API was called
    expect(apiRequestStub.called).to.be.true;
>>>>>>> main
  });
});

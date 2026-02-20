import * as apiModule from '@department-of-veterans-affairs/platform-utilities/api';
import { waitFor } from '@testing-library/dom';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
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
  let sandbox;
  let apiRequestStub;
  let convertLocationStub;
  let convertToLatLngStub;
  let dispatchSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    props = {
      data: {},
      setFormData: sandbox.spy(),
      goBack: sandbox.spy(),
      goForward: sandbox.spy(),
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

    dispatchSpy = sandbox.spy(storeWithRealReducers, 'dispatch');
    apiRequestStub = sandbox.stub(apiModule, 'apiRequest');
    convertLocationStub = sandbox.stub(mapboxModule, 'convertLocation');
    convertToLatLngStub = sandbox.stub(mapboxModule, 'convertToLatLng');
  });

  afterEach(() => {
    store.clearActions();
    sandbox.restore();
  });

  const renderWithStore = (customState = {}) => {
    if (Object.keys(customState).length) {
      store = mockStore({
        askVA: {
          ...store.getState().askVA,
          ...customState,
        },
        navigation: {
          route: {
            path: '/test-path',
          },
        },
      });
    }
    return mount(
      <Provider store={store}>
        <YourVAHealthFacilityPage {...props} />
      </Provider>,
    );
  };

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

  it('should handle use my location button click', () => {
    const wrapper = renderWithStore({
      getLocationInProgress: true,
    });

    wrapper.find('.use-my-location-link').simulate('click');
    wrapper.update();

    expect(wrapper.find('va-loading-indicator')).to.have.lengthOf(1);
    wrapper.unmount();
  });

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
    const geoLocateUserStub = sandbox.stub(geoLocateUser, 'geoLocateUser');
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
  });

  it('should return mock facilities if mockTestingFlagForAPI is enabled', async () => {
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);
    sandbox.stub(constants, 'getMockTestingFlagForAPI').returns(true);

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
  });

  it('should display validation error if no city or postal code provided', async () => {
    apiRequestStub.resolves(mockHealthFacilityResponse);
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);

    const { getByRole, getByText } = renderWithStoreRTL();

    userEvent.click(getByRole('button', { name: /continue/i }));
    await waitFor(() => {
      expect(getByText(/fill in a city or facility name/i)).to.exist;
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
    const focusElementSpy = sandbox.spy(document, 'querySelector');

    const { getByRole } = renderWithStoreRTL({
      searchLocationInput: '', // Empty search query
    });

    userEvent.click(getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(focusElementSpy.calledWith('#street-city-state-zip')).to.be.true;
    });
  });

  it('should proceed forward when facility is selected', async () => {
    apiRequestStub.resolves(mockHealthFacilityResponse);
    convertLocationStub.resolves(mockLocationResponse);
    convertToLatLngStub.resolves([0, 0]);

    const goForwardSpy = sandbox.spy();
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
  });
});

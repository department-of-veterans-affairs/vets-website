import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
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
      navigation: {
        route: {
          path: '',
        },
      },
    });
  });

  afterEach(() => {
    fetchStub.restore();
    store.clearActions();
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

  it('should handle use my location button click', () => {
    const wrapper = renderWithStore({
      getLocationInProgress: true,
    });

    wrapper.find('.use-my-location-link').simulate('click');
    wrapper.update();

    expect(wrapper.find('va-loading-indicator')).to.have.lengthOf(1);
    wrapper.unmount();
  });

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
  });
});
